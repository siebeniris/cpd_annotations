import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import {Container, Row, Col, Button} from 'react-bootstrap';
import axios from 'axios';
import shortid from "shortid";

const BACKEND_PATH = `http://localhost:9000/reviews/`
const BACKEND_ANNO = `http://localhost:9000/annotations`

function Annotator(props) {
    const [reviews, setReviews] = useState(null);
    const [filename, setName] = useState(null);
    const [annotator, setAnnotator] = useState(null);
    const [category, setCategory] = useState(null);
    const {match: {params}} = props;
    const [prevPage, setPrev] = useState(null);
    const [nextPage, setNext] = useState(null);
    const [annotatedBy, setAnnotated] = useState(null);

    useEffect(() => {
        if (!reviews) {
            getReviews();
            console.log(reviews);

        }
        if(annotatedBy===null && filename){
            getPastAnnotators();}
        console.log(annotatedBy)

    })

    const getPastAnnotators = async () => {
        console.log('filename', filename)
        const query = BACKEND_ANNO + '?filename=' + filename;
        console.log(query)
        let res = await axios.get(query)
        console.log(`query:`, res.data)
        var annotatorsBy = []
        res.data.map((annotation, index) => {
            annotatorsBy.push(annotation.username)
        })
        console.log(annotatorsBy)
        setAnnotated(annotatorsBy);
    }

    const getReviews = async () => {
        let reviewId = params.reviewId
        console.log(`reviewId ${reviewId}`)
        let res = await axios.get(BACKEND_PATH + reviewId)
        setReviews(res.data["review_list"]);
        console.log(res.data['name'])
        setName(res.data['name'])
        console.log(reviews, filename)
        setCategory(res.data['review_list'][0]['category'])
        console.log(category)
        if (parseInt(reviewId) === 0) {
            setPrev("0")
            setNext(String(parseInt(reviewId) + 1))
        } else {
            setPrev(String(parseInt(reviewId) - 1))
            setNext(String(parseInt(reviewId) + 1))
        }
    }

    // handle the change to click on whether it is typical of the category
    const handleChange = index => e => {
        let newArr = [...reviews];
        newArr[index]["align"] = e.target.value
        setReviews(newArr)
        console.log(reviews, filename)
    }

    const clickReset = async () => {
        let res = await axios.get(BACKEND_PATH + params.reviewId)
        let review_list = res.data['review_list']
        setReviews(review_list);
        setName(res.data['name'])
        console.log(review_list);
    }

    const clickSubmit = async () => {
        console.log({review_list: reviews})
        let now = new Date();
        var annotations = []
        reviews.map((review, index) => {
            annotations.push({
                "id": review.id,
                "align": review.align
            })
        })

        await axios.post(BACKEND_ANNO,
            {
                id: shortid.generate(),
                date: now,
                filename: filename,
                fileId: params.reviewId,
                username: annotator,
                annotation: annotations
            }).then(
            alert("Submitted!")
        ).catch(error => alert(error))
    }

    const handleAnnotator = e => {
        setAnnotator(e.target.value)
    }

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

    const renderReview = (review, index) => {
        return (

            <tr style={{fontSize: "20px"}}>
                <td style={colorCpt(review.cpt)}> {review.cpt}</td>


                <td>{review.date}</td>
                <td>
                    {(review.offset[0] !== 0) ? `...` : ``} {review.sentence.substring(review.offset[0] - 150, review.offset[0])}
                    <span style={{
                        color: "green",
                        fontWeight: "bold"
                    }}> {review.sentence.substring(review.offset[0], review.offset[1])}</span>
                    {review.sentence.substring(review.offset[1], review.offset[1] + 150)} {`...`}
                </td>
                <td>

                    <div className="checkbox-list">
                        <label className="checkbox">
                            <input type="radio" className="checkbox-control" checked={review.align === 'yes'}
                                   name="yes" value="yes" onChange={handleChange(index)}/>
                            <span className="checkbox-label"> yes </span>
                            <br/>
                            <input type="radio" className="checkbox-control" checked={review.align === "no"}
                                   name="no" value="no" onChange={handleChange(index)}/>
                            <span className="checkbox-label"> no </span>
                        </label>
                        <br/>

                        {(review.align) ? <span role={'img'}>&#10004; {review.align}</span> : ``}
                    </div>
                </td>
            </tr>
        );
    };

    const distinct = (value, index, self) =>{
        return self.indexOf(value)== index;
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
                (
                    <span style={{"color": "green", "fontWeight": "bold"}}>
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
                        <th style={{"width": "12%", 'fontSize': '18px'}}>Date</th>
                        <th>Sentence</th>
                        <th style={{"fontSize": "18px"}}>
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