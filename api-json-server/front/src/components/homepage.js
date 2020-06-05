import React, {useState, useEffect} from "react";
import {Container} from "react-bootstrap";

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
    </Container>
 )
}

export default Home;
