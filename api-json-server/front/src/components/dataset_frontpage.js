import  {BACKEND_PORT ,BACKEND_DATASET} from './config'
import React, {useState, useEffect} from "react";
import {Container, Table} from "react-bootstrap";
import {Link} from 'react-router-dom';
import axios from 'axios';


export default function DatasetFront(){
    const [data, setData] = useState(null);

    useEffect(()=>{
        if(!data){
            getData();
        }
    })

    const getData = async () => {
        let res = await axios.get(BACKEND_PORT + BACKEND_DATASET)
        console.log(res.data)
        setData(res.data);
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
                    <li className="nav-item">
                        <a className="nav-link" href="#">Annotation </a>
                    </li>
                    <li className="nav-item ">
                        <a className="nav-link" href="/wiki">Wiki</a>
                    </li>

                    <li className="nav-item active">
                        <a className="nav-link" href="/datasetFront"> Dataset <span className="sr-only">(current)</span></a>
                    </li>

                </ul>
            </nav>

            <div className="content">
                <h1> Links for Dataset </h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>File</th>
                        <th>Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(data && data.length > 0) ? (
                        data.map((dat, index) => {
                            // const name = (review.hasOwnProperty("name"))?(review["name"]):(" ")
                            let linkl = 'dataset/'+ String(index)

                            return (
                                <tr key={index}>
                                    <td>{index}</td>

                                    <td><Link to={linkl}> {linkl}</Link></td>
                                </tr>)})
                    ) : null}
                    </tbody>
                </Table>
            </div>
        </Container>


    )
}