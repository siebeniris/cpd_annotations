import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter } from 'react-router-dom';
import './App.css';

import Home from './components/homepage';
import Annotator from './components/Annotator';
import AnnotationFront from "./components/annotation_frontpage";
import Wiki from "./components/wikipage";

function App(){
    return (
        <BrowserRouter>
            <Route path = "/home" component={Home}/>
            <Route path ="/annotation" component={AnnotationFront}/>
            <Route path="/reviews/:reviewId" component={Annotator}/>
            <Route path ="/wiki" component={Wiki}/>

        </BrowserRouter>

    )
}

export default App;