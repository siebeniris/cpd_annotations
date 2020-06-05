import React, {useState, useEffect} from "react";
import {Row, Container} from "react-bootstrap";
import {Link} from 'react-router-dom';
import axios from 'axios';
const shortid = require('shortid')

const BACKEND_PATH = `http://localhost:9000/reviews/`
const BACKEND_USERS = `http://localhost:9000/users/`
//https://tylermcginnis.com/react-router-pass-props-to-link/

function AnnotationFront() {
    const [reviews, setReviews] = useState(null);
    const [username, setUsername] = useState(null);
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
        let res = await axios.get(BACKEND_PATH)
        setReviews(res.data);

    }

    const getRegisterations = async() =>{
        let res= await axios.get(BACKEND_USERS);
        let users_data = res.data;
        let users = [];
        users_data.map((user, index)=>{
            users.push(user.username)
        })
        setRegistered(users);

    }

    const handleAnnotator = e => {
        setUsername(e.target.value)
    }

    const clickRegister =async () =>{
        let now = new Date();
        if(registered.includes(username)){
            alert("username exists, try again")
            return
        }

        await axios.post(
                BACKEND_USERS,
                {
                    id: shortid.generate(),
                    date: now,
                    username: username,
                }).then(alert(`username ${username} registered successfully. Please remember it.`))
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

            <Row>
                <form onSubmit={clickRegister}>
                    <label>
                        <input type="text" value={username} onChange={handleAnnotator}/>
                    </label>
                    <input type="submit" value="Register"/>
                </form>

            </Row>


            <div className="content">
                <h1> Links for Annotations </h1>
                {(reviews && reviews.length > 0) ? (
                    reviews.map((review, index) => {
                            const name = review["name"]
                            let linkl = "reviews/" + String(index)

                            return (
                                <p> {name}
                                    <Link to={linkl}> Link</Link></p>
                            )
                        }
                    )

                ) : (<p>Loading Reviews ...</p>)}
            </div>

        </Container>


    )
}

export default AnnotationFront;
