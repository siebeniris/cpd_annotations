import  {BACKEND_PORT, BACKEND_REVIEWS, BACKEND_ANNOTATIONS} from './config'
import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import {Container, Row, Col, Button, ToggleButton, ButtonGroup} from 'react-bootstrap';
import axios from 'axios';
import shortid from "shortid";


const CPT_ANSWERS = ["0 More Positive", "1 More Negative", "2 No Difference"]
const ANSWER_COLOR = ["success", "danger", "warning"]

function Annotator(props) {
    const [reviews, setReviews] = useState(null);
    const [filename, setName] = useState(null);
    const [annotator, setAnnotator] = useState('');
    const [category, setCategory] = useState(null);
    const {match: {params}} = props;
    const [prevPage, setPrev] = useState(null);
    const [nextPage, setNext] = useState(null);
    const [annotatedBy, setAnnotated] = useState(null);
    const [cpts, setCpts] = useState(null);
    const [cptAnswer, setCptAnswer] = useState({});

    const [align, setAlign] = useState({});
    const [align_aspect, setAlignAspect] = useState({});
    const [align_sentiment, setAlignSentiment] = useState({});
    // const [not_clear, setNotClearSentiment] = useState({})


    // load data.
    useEffect(() => {
        if (!reviews) {
            getReviews();
        }
        if (annotatedBy === null && filename) {
            getPastAnnotators();
        }

    })

    // get the annotator list.
    const getPastAnnotators = async () => {
        const query = BACKEND_PORT+BACKEND_ANNOTATIONS + '?filename=' + filename;
        let res = await axios.get(query)
        var annotatorsBy = []
        res.data.map((annotation, index) => {
            annotatorsBy.push(annotation.username)
        })
        setAnnotated(annotatorsBy);
    }

    // get reviews.
    const getReviews = async () => {
        let reviewId = params.reviewId
        console.log(`reviewId ${reviewId}`)
        let res = await axios.get(BACKEND_PORT+BACKEND_REVIEWS + reviewId)
        let review_list = res.data['review_list']

        setReviews(review_list);
        setName(res.data['name'])
        setCategory(res.data['categories'])

        // get distinct list of change points. [0,1,2]
        const cpts_ = []

        review_list.map((review) => {
            cpts_.push(parseInt(review["cpt"]))
        })
        setCpts(cpts_.filter(distinct))

        // for pagination.
        if (parseInt(reviewId) === 0) {
            setPrev("0")
            setNext(String(parseInt(reviewId) + 1))
        } else {
            setPrev(String(parseInt(reviewId) - 1))
            setNext(String(parseInt(reviewId) + 1))
        }
    }

    // reset the review list.
    const clickReset = async () => {
        setAlignSentiment({})
        setAlignAspect({})
        setAlign({})
        setCptAnswer({})
        window.location.reload(false)

        console.log(align_sentiment,align_aspect, align, cptAnswer);
    }

    // click submit
    const clickSubmit = async (e) => {
        console.log({review_list: reviews})
        let now = new Date();
        var annotations = []
        var annots =[]

        reviews.map((review, index) => {
            annotations.push({
                "id": review.id,
                "align": align[`align`+String(index)],
                "align_aspect": align_aspect[`aspectNo`+String(index)],
                "align_sentiment": align_sentiment[`sentimentNo`+String(index)],
                // "not_clear": not_clear[`notClear`+String(index)]
            })
            annots.push(align[`align`+String(index)]||align_aspect[`aspectNo`+String(index)]
                ||align_sentiment[`sentimentNo`+String(index)])
                // ||not_clear[`notClear`+String(index)])
        })
        console.log(`annotations:`, annotations)
        console.log(`annots`, annots)
        // all the aligns are cheked.
        var areAllNotFalse = annots.every(function (i) {
            return i !== undefined;
        })

        let assertLen = Object.keys(cptAnswer).length === cpts.length - 1

        if (areAllNotFalse && assertLen) {
            e.preventDefault()
            await axios.post(BACKEND_PORT+BACKEND_ANNOTATIONS,
                {
                    id: shortid.generate(),
                    date: now,
                    filename: filename,
                    fileId: params.reviewId,
                    username: annotator,
                    annotation: annotations,
                    cptAnswer: cptAnswer
                }).then(
                alert("Submitted!")
            ).catch(error => alert(error))
        } else {
            e.preventDefault();

            // https://stackoverflow.com/questions/38256256/reactjs-page-refreshing-upon-onclick-handle-of-button

            alert("Annotation not completed, please finish.")
        }
    }

    const handleAnnotator = e => {
        setAnnotator(e.target.value)
    }

    // color for the stationary period.
    const colorCpt = cpt => {
        switch (cpt) {
            case "0":
                return {backgroundColor: "#ebab34", "fontWeight": "bold"}
            case "1":
                return {backgroundColor: "#eb4034", "fontWeight": "bold"}
            case "2":
                return {backgroundColor: "#34ebb4", "fontWeight": "bold"}
            case "3":
                return {backgroundColor: "#3499eb", "fontWeight": "bold"}
            case "4":
                return {backgroundColor: "#ebab34", "fontWeight": "bold"}
            case "5":
                return {backgroundColor: "#eb4034", "fontWeight": "bold"}
            case "6":
                return {backgroundColor: "#34ebb4", "fontWeight": "bold"}
            case "7":
                return {backgroundColor: "#3499eb", "fontWeight": "bold"}
            default:
                return {backgroundColor: "#3499eb", "fontWeight": "bold"}
        }
    }


    const renderReview = (review, index) => {
        return (

            <tr　key={`table${index}`} style={{fontSize: "20px"}}>
                <td style={colorCpt(review.cpt)}> {review.cpt}</td>


                <td>{review.date}</td>
                <td>
                    {(review.offset_sent[0] !== 0) ? `...` : ``} {review.review.substring(review.offset_sent[0] - 150, review.offset_sent[0])}
                    <span style={{
                        fontWeight: "bold"
                    }}> {review.review.substring(review.offset_sent[0], review.offset_sent[1])}</span>
                    {review.review.substring(review.offset_sent[1], review.offset_sent[1] + 150)} {`...`}

                    <br/>
                    <br/>
                    <span  style={{fontWeight:"bold", fontColor:"purple"}} >
                        {(review.hashtags && review.hashtags.length>0)? (
                             "#"+ review.hashtags.join(" #")
                    ):(" ")}
                    </span>
                </td>
                <td>
                    <div className="form-check float-left ">
                        <label className="form-check-label text-left">
                            <input type="checkbox" className="form-check-input"
                                   name={`align${index}`} value={align[index]}
                                   checked ={align[index]}
                                   onChange={(event) => {
                                       let key=event.target.name;
                                       align[key] = event.target.checked;
                                       setAlign(align)
                                       console.log(align[`align${index}`])
                                   }}
                            />
                            <span className="checkbox-label"> yes (aspect & sentiment) </span>
                        </label>
                    </div>
                </td>
                <td>
                    <div className="form-check float-left">
                        <label className="form-check-label text-left">
                            <input type="checkbox" className="form-check-input"
                                   name={`aspectNo${index}`} value={align_aspect[index]}
                                   checked ={align_aspect[index]}
                                   onChange={(event) => {
                                       let key=event.target.name;
                                       align_aspect[key] = event.target.checked;
                                       setAlignAspect(align_aspect);
                                   }}
                            />
                            <span className="checkbox-label"> no (aspect) </span>
                            <br/>

                            <input type="checkbox" className="form-check-input"
                                   checked={align_sentiment[index]}
                                   name={`sentimentNo${index}`} value={align_sentiment[index]}
                                   onChange={(event) => {
                                       let key=event.target.name;
                                       align_sentiment[key] = event.target.checked;
                                       setAlignSentiment(align_sentiment);
                                   }}
                            />
                            <span className="checkbox-label"> no (sentiment) </span>
                            <br/>

                            {/*<input type="checkbox" className="form-check-input"*/}
                            {/*       checked={not_clear[index]}*/}
                            {/*       name={`notClear${index}`} value={not_clear[index]}*/}
                            {/*       onChange={(event) => {*/}
                            {/*           let key=event.target.name;*/}
                            {/*           not_clear[key] = event.target.checked;*/}
                            {/*           setNotClearSentiment(not_clear);*/}
                            {/*       }}*/}
                            {/*/>*/}
                            {/*<span className="checkbox-label"> not clear (sentiment) </span>*/}
                            {/*<br/>*/}

                        </label>
                    </div>
                </td>
            </tr>
        );
    };

    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    }


    // for the last question in annotation.
    const crosszip = (cpts) => {
        let cpts1 = cpts.slice(1);
        let cpts2 = cpts.slice(0, cpts.length - 1);
        let c = cpts2.map(function (e, i) {
            return [e, cpts1[i]];
        })
        return c

    }

    return (

        <Container fluid className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Change Point Detection</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                </button>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="/annotation">Annotation <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item ">
                        <a className="nav-link" href="/wiki">Wiki</a>
                    </li>

                </ul>
            </nav>

            {(category && category.length > 0) ?
                (<h3 style={{textAlign: "left"}}>Category:<span
                    style={{"color": "blue", "fontWeight": "bold"}}> {category.join(", ").toUpperCase()}</span></h3>)
                : (' ')}

            {(filename && filename.length > 0) ?
                (<p style={{textAlign: "left"}}>filename:<span
                    style={{"color": "green", "fontWeight": "bold"}}> {filename}</span></p>)
                : (' ')}

            <p style={{textAlign: "left"}}>Annotated by:
                {(annotatedBy && annotatedBy.length > 0) ?
                    (<span style={{"color": "green", "fontWeight": "bold"}}>
                        {annotatedBy.filter(distinct).join()}
                        </span>
                    )
                    : ("None")}
            </p>

            <br/>
            <br/>

            <Row>
                <Table striped bordered hover
                       style={{borderCollapse: "separate", borderSpacing: "5px", "width": "100%"}}>
                    <thead>
                    <tr style={{ backgroundColor: "#dadee3"}}>
                        <th style={{'fontSize': "18px"}}>Time Period</th>
                        <th style={{"width": "8%", 'fontSize': '18px'}}>Date</th>
                        <th>Review</th>
                        <th style={{"width": "20%", "fontSize": "18px"}} colSpan={2}>
                            Does the highlighted sentence align with the majority of sentences in this time period?
                        </th>

                    </tr>
                    </thead>

                    <tbody>
                    {(reviews && reviews.length > 0) ? (
                        reviews.map((review, index) => renderReview(review, index))
                    ) : (null)}
                    </tbody>

                </Table>
            </Row>

                {(cpts && cpts.length > 0) ? (
                    crosszip(cpts).map((a, index) => {
                    return (
                    <Row className="d-block " key={index}>
                    <span style={{
                    textAlign: "center",
                    "fontWeight": "bold"
                }}> {index}. What is the change from time period {a.join(" to time period ")} ? </span>
                    <ButtonGroup toggle>
                    {CPT_ANSWERS.map((answer, ind) => {
                        return (
                            <ToggleButton key={ind} type="checkbox" variant={ANSWER_COLOR[ind]} name={ind}
                                          value={ind} checked={cptAnswer[index] === String(ind)}
                                          onChange={(e) => {
                                              cptAnswer[index] = e.target.value;
                                              setCptAnswer(cptAnswer);
                                              console.log(cptAnswer, cptAnswer[index] === String(ind))
                                              console.log(e.target.checked)
                                          }}>
                                {answer}
                            </ToggleButton>
                        )})}
                    </ButtonGroup>
                        {(cptAnswer )? (
                            (Object.keys(cptAnswer).length)?(
                          <p> {cptAnswer[index]} chosen</p>):(null)
                        ):(null)}
                        <br/>
                        <br/>



                    </Row>)})) : ` `}
            <br/>

            <Row className="align-content-end">
                <Col>
                    <Button variant="danger" onClick={clickReset}>Reset</Button>
                </Col>

                <Col>
                    <form onSubmit={clickSubmit}>
                        <label>
                            Annotator:
                            <input type="text" value={annotator} onChange={handleAnnotator}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                </Col>
            </Row>

            <br/>
            <br/>

            <div className="d-flex justify-content-center align-items-center">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a className="page-link" href={prevPage}>Previous</a></li>
                        <li className="page-item"><a className="page-link" href="#">{params.reviewId}</a></li>
                        <li className="page-item"><a className="page-link" href={nextPage}>Next</a></li>
                    </ul>
                </nav>
            </div>

        </Container>
    );
}

export default Annotator;