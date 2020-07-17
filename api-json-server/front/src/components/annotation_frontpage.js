import  {BACKEND_PORT ,BACKEND_REVIEWS} from './config'
import React, {useState, useEffect} from "react";
import {Container, Table} from "react-bootstrap";
import {Link} from 'react-router-dom';
import axios from 'axios';


//https://tylermcginnis.com/react-router-pass-props-to-link/

function AnnotationFront() {
    const [reviews, setReviews] = useState(null);
    // const [username, setUsername] = useState('');
    // const [registered, setRegistered] = useState(null);

    useEffect(() => {
        if (!reviews) {
            getReviews();
            console.log(reviews)
        }
    })

    const getReviews = async () => {
        let res = await axios.get(BACKEND_PORT+BACKEND_REVIEWS)
        setReviews(res.data);
    }


    return (
        <Container className='AnnotationFront'>

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
                        <a className="nav-link" href="#">Annotation <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item ">
                        <a className="nav-link" href="/wiki">Wiki</a>
                    </li>

                    <li className="nav-item ">
                        <a className="nav-link" href="/datasetFront"> Dataset </a>
                    </li>


                </ul>
            </nav>

            <div className="content">
                <h1> Links for Annotations </h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>File</th>
                        <th>Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(reviews && reviews.length > 0) ? (
                        reviews.map((review, index) => {
                            if(review==null){console.log("null index", index)}
                            const name = (review.hasOwnProperty("name"))?(review["name"]):(" ")
                            let linkl = 'reviews/'+ String(index)

                            return (
                                <tr key={index}>
                                <td>{name}</td>

                                <td><Link to={linkl}> {linkl}</Link></td>
                                </tr>)})
                    ) : null}
                    </tbody>
                </Table>
            </div>
        </Container>


    )
}

export default AnnotationFront;
