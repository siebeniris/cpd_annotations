import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import username_page from "../components/images/username.png";
import top from "../components/images/top.png";
import sentence1 from "../components/images/0.png"

function Home(){

　return (

    <Container className="homepage">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <a className="navbar-brand" href="#">Change Point Detection</a>
         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                 aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         </button>
             <ul className="navbar-nav">
                 <li className="nav-item active">
                     <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                 </li>
                 <li className="nav-item">
                     <a className="nav-link" href="/annotation">Annotation</a>
                 </li>

             </ul>
     </nav>


        <Row className="">
            <div>
            <p class="text-primary" style={{fontWeight:"bold"}}> Welcome to the annotation interface for Change Point Detection</p>
            </div>
        </Row>

        <Col>
            <h2>Instructions</h2>

            <p style={{fontWeight:"bold"}}>Step1: Register Username  </p>

            <p>Go to <Link to="annotation/"> annotation front page </Link>, register your username:</p>
            <p><img src={username_page} alt="register"/></p>

            <p>Please input an username with all alphabets and longer than 3 characters. Then click on button "Register".</p>

            <p style={{fontWeight:"bold"}}>Step2: Annotate  </p>

            <p>There is a table of contents in  <Link to="annotation/"> annotation front page </Link>.  </p>
            <p>You could also start from  <Link to="reviews/0"> the first annotation page  </Link> right away. </p>

            <h3>Guidelines for Annotation</h3>
            <p>Example page: <span class="text-primary">Pool</span> related reviews in <Link to="reviews/25">  page 25  </Link> </p>
            <p>On the top of the page, the category <span className="text-primary">Pool</span> was highlighted. </p>
            <p>And it displays the usernames of the annotators who have finished annotating this page.</p>
            <p><img src={top} alt="pool"/></p>
            <p>In the table, there are selected reviews for different <span className="text-warning">stationary period</span>.
            In this example, all the reviews colored orange in  <span className="text-warning">stationary period</span>  represents the reviews in
            stationary period <b>0</b>.</p>
            <p><img src={sentence1} alt="example1"/> </p>


        </Col>
    </Container>
 )
}

export default Home;
