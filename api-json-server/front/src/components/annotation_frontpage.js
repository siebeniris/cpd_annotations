import  {BACKEND_PORT ,BACKEND_REVIEWS, BACKEND_USERS} from './config'
import React, {useState, useEffect} from "react";
import {Row, Container, Table} from "react-bootstrap";
import {Link} from 'react-router-dom';
import axios from 'axios';
const shortid = require('shortid')


//https://tylermcginnis.com/react-router-pass-props-to-link/

function AnnotationFront() {
    const [reviews, setReviews] = useState(null);
    const [username, setUsername] = useState('');
    const [registered, setRegistered] = useState(null);

    useEffect(() => {
        if (!reviews) {
            getReviews();
            console.log(reviews)
        }
        if (!registered){
            getRegisterations();
            console.log(registered)
        }

    })

    const getReviews = async () => {
        let res = await axios.get(BACKEND_PORT+BACKEND_REVIEWS)
        setReviews(res.data);

    }

    const getRegisterations = async() =>{
        let res= await axios.get(BACKEND_PORT+BACKEND_USERS);
        let users_data = res.data;
        let users = [];
        users_data.map((user, index)=>{
            users.push(user.username)
        })
        setRegistered(users);

    }

    const handleAnnotator = e => {
        setUsername(e.target.value)
        console.log(username)
    }

    const clickRegister =async (e) =>{

        let now = new Date();
        if(registered.includes(username)){
            e.preventDefault();
            alert("username exists, try again")
            return
        }

        if(username.length>3){
        await axios.post(
                BACKEND_PORT+BACKEND_USERS,
                {
                    id: shortid.generate(),
                    date: now,
                    username: username,
                }).then(alert(`username ${username} registered successfully. Please remember it.`))}
        else{
            e.preventDefault()
            alert("The input username is too short, please try again!")
        }
    }


    return (
        <Container className='AnnotationFront'>

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
                        <a className="nav-link" href="#">Annotation <span className="sr-only">(current)</span></a>
                    </li>

                </ul>
            </nav>

            <Row className="justify-content-md-center">
                <br/>
                <form onSubmit={(e) => {clickRegister(e)}}>
                    <label>
                        <input type="text" value={username} onChange={handleAnnotator}
                        placeholder="Enter Username"/>


                    </label>
                    <input type="submit" value="Register"/>
                    <small id="usernameHelp" className="form-text text-muted">
                        Please enter an all-alphabet username longer than 3 characters.
                    </small>
                </form>


            </Row>
            <br/>
            <br/>


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
                            let linkl = "reviews/" + String(index)

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
