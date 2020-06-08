import  {BACKEND_PORT, BACKEND_REVIEWS, BACKEND_USERS, BACKEND_ANNOTATIONS} from './config'
import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import {Container, Row, Col, Button, ToggleButton, ButtonGroup} from 'react-bootstrap';
import axios from 'axios';
import shortid from "shortid";


const CPT_ANSWERS = ["More Positive", "More Negative", "No Difference"]
const ANSWER_COLOR = ["success", "danger", "warning"]

function Annotator(props) {
    const [reviews, setReviews] = useState(null);
    const [filename, setName] = useState(null);
    const [annotator, setAnnotator] = useState(null);
    const [category, setCategory] = useState(null);
    const {match: {params}} = props;
    const [prevPage, setPrev] = useState(null);
    const [nextPage, setNext] = useState(null);
    const [annotatedBy, setAnnotated] = useState(null);
    const [cpts, setCpts] = useState(null);
    const [cptAnswer, setCptAnswer] = useState({});
    // localhost:9000/users
    const [users, setUsers] = useState(null);


    // load data.
    useEffect(() => {
        if (!reviews) {
            getReviews();
        }
        if (annotatedBy === null && filename) {
            getPastAnnotators();
        }
        if (!users) {
            getUserList();
        }
    })

    // get user list.
    const getUserList = async () => {
        let res = await axios.get(BACKEND_PORT+ BACKEND_USERS)
        var user_list = []
        res.data.map((user, index) => {
            user_list.push(user.username)
        })
        setUsers(user_list);
    }

    // get the annotator list.
    const getPastAnnotators = async () => {
        console.log('filename', filename)
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
        setCategory(res.data['review_list'][0]['category'])

        // get distinct list of change points. [0,1,2]
        const cpts_ = []
        review_list.map((review, index) => {
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
        let res = await axios.get(BACKEND_PORT+BACKEND_REVIEWS + params.reviewId)
        let review_list = res.data['review_list']
        setReviews(review_list);
        setName(res.data['name'])
        console.log(review_list);
    }

    // click submit
    const clickSubmit = async (e) => {
        console.log({review_list: reviews})
        let now = new Date();
        var annotations = []
        var aligns = []
        reviews.map((review, index) => {
            annotations.push({
                "id": review.id,
                "align": review.align,
                "align_aspect": review.align_aspect,
                "align_sentiment": review.align_sentiment
            })
            aligns.push(review.align);
        })
        console.log(`align ==>`, aligns)

        // all the aligns are cheked.
        var areAllNotNull = aligns.every(function (i) {
            return i !== undefined;
        })

        console.log("users:", users)
        let assertLen = Object.keys(cptAnswer).length === cpts.length - 1

        if (!users.includes(annotator)) {
            e.preventDefault();
            alert("Please register first.")
        }

        if (areAllNotNull && assertLen) {
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
                return {"background-color": "#ebab34", "fontWeight": "bold"}
            case "1":
                return {"background-color": "#eb4034", "fontWeight": "bold"}
            case "2":
                return {"background-color": "#34ebb4", "fontWeight": "bold"}
            case "3":
                return {"background-color": "#3499eb", "fontWeight": "bold"}
            case "4":
                return {"background-color": "#ebab34", "fontWeight": "bold"}
            case "5":
                return {"background-color": "#eb4034", "fontWeight": "bold"}
            case "6":
                return {"background-color": "#34ebb4", "fontWeight": "bold"}
            case "7":
                return {"background-color": "#3499eb", "fontWeight": "bold"}
            default:
                return {"background-color": "#3499eb", "fontWeight": "bold"}
        }
    }

    const handleAspect = index => e => {
        let newArr = [...reviews];
        newArr[index]["align_aspect"] = e.target.value
        setReviews(newArr)
        console.log(reviews, filename)
    }

    const handleSentiment = index => e => {
        let newArr = [...reviews];
        newArr[index]["align_sentiment"] = e.target.value
        setReviews(newArr)
        console.log(reviews, filename)
    }

    // handle the change to click on whether it is typical of the category
    const handleChangeAlign = index => e => {
        let newArr = [...reviews];
        newArr[index]["align"] = e.target.value
        setReviews(newArr)
        console.log(reviews, filename)
    }


    const renderReview = (review, index) => {
        return (

            <tr style={{fontSize: "20px"}}>
                <td style={colorCpt(review.cpt)}> {review.cpt}</td>


                <td>{review.date}</td>
                <td>
                    {(review.offset[0] !== 0) ? `...` : ``} {review.sentence.substring(review.offset[0] - 150, review.offset[0])}
                    <span style={{
                        fontWeight: "bold"
                    }}> {review.sentence.substring(review.offset[0], review.offset[1])}</span>
                    {review.sentence.substring(review.offset[1], review.offset[1] + 150)} {`...`}
                </td>
                <td>
                    <div className="checkbox-list float-left">
                        <label className="checkbox text-left">
                            <input type="checkbox" className="checkbox-control" checked={review.align}
                                   name="yes" value="yes" onChange={handleChangeAlign(index)}/>
                            <span className="checkbox-label"> yes (aspect & sentiment) </span>
                            <br/>

                            {(review.align) ? <span role={'img'}>&#10004;</span> : ``}
                            <br/>
                            <br/>

                            <input type="checkbox" className="checkbox-control" checked={review.align_aspect}
                                   name="aspect_no" value="no" onChange={handleAspect(index)}/>
                            <span className="checkbox-label"> no (aspect) </span>
                            <br/>

                            <input type="checkbox" className="checkbox-control" checked={review.align_sentiment}
                                   name="sentiment_no" value="no" onChange={handleSentiment(index)}/>
                            <span className="checkbox-label"> no (sentiment) </span>
                            <br/>
                            {(review.align_aspect || review.align_sentiment) ? <span role={'img'}>&#10004;</span> : ``}
                        </label>
                    </div>
                </td>
            </tr>
        );
    };

    const distinct = (value, index, self) => {
        return self.indexOf(value) == index;
    }


    // for the last question in annotation.
    const crosszip = (cpts) => {
        let cpts1 = cpts.slice(1);
        let cpts2 = cpts.slice(0, cpts.length - 1);
        let c = cpts2.map(function (e, i) {
            return [e, cpts1[i]];
        })

        return c.map((a, index) => {
            return (
                <div key={index}>
                    <span style={{
                        "text-align": "center",
                        "fontWeight": "bold"
                    }}> {index}. What is the change from {a.join(" to ")} ? </span>
                    <ButtonGroup toggle>
                        {CPT_ANSWERS.map((answer, ind) => {
                            return (

                                <div key={ind}>
                                    <ToggleButton key={ind} type="radio" variant={ANSWER_COLOR[ind]} name="radio"
                                                  value={ind} checked={cptAnswer === ind}
                                                  onChange={(e) => {
                                                      console.log(cptAnswer)
                                                      setCptAnswer(state => (state[index] = e.currentTarget.value, state))
                                                  }}>
                                        {answer}
                                    </ToggleButton>
                                    <br/>
                                </div>)
                        })}
                    </ButtonGroup>
                </div>
            )
        })
    }

    return (

        <Container fluid className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Change Point Detection</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                </button>
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/annotation">Annotation <span className="sr-only">(current)</span></a>
                    </li>

                </ul>
            </nav>

            {(category && category.length > 0) ?
                (<h3 style={{"text-align": "left"}}>Category:<span
                    style={{"color": "blue", "fontWeight": "bold"}}> {category.toUpperCase()}</span></h3>)
                : (' ')}

            {(filename && filename.length > 0) ?
                (<p style={{"text-align": "left"}}>filename:<span
                    style={{"color": "green", "fontWeight": "bold"}}> {filename}</span></p>)
                : (' ')}

            <p style={{"text-align": "left"}}>Annotated by:
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
                       style={{"border-collapse": "separate", "border-spacing": "5px", "width": "100%"}}>
                    <thead>
                    <tr style={{"background-color": "#dadee3"}}>
                        <th style={{'fontSize': "18px"}}>Stationary Period</th>
                        <th style={{"width": "8%", 'fontSize': '18px'}}>Date</th>
                        <th>Sentence</th>
                        <th style={{"width": "15%", "fontSize": "18px"}}>
                            Does this review align with other reviews in this stationary period?
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {(reviews && reviews.length > 0) ? (
                        reviews.map((review, index) => renderReview(review, index))
                    ) : (
                        <p>No Reviews found, You may have finished annotation. Thank you!</p>
                    )}
                    </tbody>

                </Table>
            </Row>

            <Row>
                <p>{(cpts && cpts.length > 0) ? (crosszip(cpts)) : ` `}</p>

            </Row>

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