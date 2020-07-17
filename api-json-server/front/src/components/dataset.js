import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import {Container} from 'react-bootstrap';
import axios from 'axios';
import {BACKEND_PORT, BACKEND_DATASET} from "./config"


export default function Dataset(props){


    const [data, setData] = useState(null);
    const [category, setCategory] = useState(null);
    const {match: {params}} = props;
    const [prevPage, setPrev] = useState(null);
    const [nextPage, setNext] = useState(null);

    useEffect(()=>{
        if(!data){
            getData();
        }
    })

    const getData = async () =>{
        let dataId = params.dataId
        let res = await axios.get(BACKEND_PORT+BACKEND_DATASET+dataId)
        let sent_list= res.data['sent_list']
        console.log(sent_list)
        setData(sent_list)
        const cat = sent_list[0]['category']
        setCategory(cat)
        if (parseInt(dataId) === 0) {
            setPrev("0")
            setNext(String(parseInt(dataId) + 1))
        } else if(parseInt(dataId)=== 374
        ){
            setPrev(String(parseInt(dataId) - 1))
        } else{
            setPrev(String(parseInt(dataId) - 1))
            setNext(String(parseInt(dataId) + 1))
        }
    }

    const renderTableRow = (elem, index) =>{

        const B = elem['argmin_max']
        return (
        <tr key={index} style={B===true? {border:" 2px solid yellow",
                backgroundColor: "yellow"}:null}>
            <td>{elem.iId}</td>
            <td>{elem.date}</td>
            <td>{elem.cpt}</td>
            <td>{elem.text}</td>
            <td>{elem.sentiment.toFixed(6)}</td>
        </tr>)
    }

    return (
        <Container fluid className="DATA">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Change Point Detection</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                </button>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item ">
                        <a className="nav-link" href="/annotation">Annotation</a>
                    </li>
                    <li className="nav-item ">
                        <a className="nav-link" href="/wiki">Wiki</a>
                    </li>

                    <li className="nav-item active">
                        <a className="nav-link" href="/datasetFront">Dataset <span className="sr-only">(current)</span></a>


                    </li>

                </ul>
            </nav>
<br/>
            {(category && category.length > 0) ?
                (<h3 style={{textAlign: "left"}}>Category:<span
                    style={{"color": "blue", "fontWeight": "bold"}}> {category.toUpperCase()}</span></h3>)
                : (' ')}
                <br/>
            <Table  striped bordered hover
                    style={{borderCollapse: "separate", borderSpacing: "5px", "width": "100%"}}>
                <thead style={{backgroundColor:"#D68F27",
                    'textAlign':'center',
                    'fontWeight':'bold'
                }}>
                <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>Time Period</th>
                    <th>TEXT</th>
                    <th>SCORE</th>
                </tr>
                </thead>


            {(data && data.length>0)?(data.map((elem,index)=> {
                const current_cpt = elem.cpt
                const next_cpt= (data[index+1])?(data[index+1].cpt):0
                const current_label= elem.cpt_label

                if(current_cpt+1===next_cpt){

                    switch(current_label){
                        case 'a': return(
                            <tbody key={`body`+index}>
                            {renderTableRow(elem, index)}
                            <tr key={`cpt${current_cpt}`}>
                                <td colSpan="5"
                                    style={{"backgroundColor":'#1bb568',
                                        'textAlign':'center',
                                        'color':'white',
                                        'fontWeight':'bold'}}> More    Positive </td>
                            </tr>
                            </tbody>

                        )
                        case 'b': return(
                            <tbody key={`body`+index}>
                            {renderTableRow(elem, index)}
                            <tr key={`cpt${current_cpt}`}>
                                <td colSpan="5"
                                    style={{"backgroundColor":'#D11638',
                                        'textAlign':'center',
                                        'color':'white',
                                        'fontWeight':'bold'}}> More    Negative </td>
                            </tr>
                            </tbody>
                        )
                        case 'c': return(
                            <tbody key={`body`+index}>
                            {renderTableRow(elem, index)}
                            <tr key={`cpt${current_cpt}`}>
                                <td colSpan="5"
                                    style={{"backgroundColor":'#7E8E90',
                                        'textAlign':'center',
                                        'color':'white',
                                        'fontWeight':'bold'}}> No    difference </td>
                            </tr>
                            </tbody>


                        )
                    }

                }
                return (
                    <tbody key={`bodymain`+index}>
                    {renderTableRow(elem, index)}
                    </tbody>
                )


            })

            ):null}

        </Table>

            <div className="d-flex justify-content-center align-items-center">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a className="page-link" href={prevPage}>Previous</a></li>
                        <li className="page-item"><a className="page-link" href="#">{params.dataId}</a></li>
                        <li className="page-item"><a className="page-link" href={nextPage}>Next</a></li>
                    </ul>
                </nav>
            </div>

        </Container>


    )
}