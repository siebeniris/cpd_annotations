import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import roomrenovation from "../components/images/room-renovation.png";

function Wiki() {
    return (

        <Container  className="homepage" style={{"padding-left":"10px", "padding-right":"10px"}}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Change Point Detection</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                </button>
                <ul className="navbar-nav">
                    <li className="nav-item ">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/annotation">Annotation</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Wiki <span className="sr-only">(current)</span></a>
                    </li>

                </ul>
            </nav>

            <Container>
                Coming Soon....
            </Container>
        </Container>)



}

export default Wiki;
