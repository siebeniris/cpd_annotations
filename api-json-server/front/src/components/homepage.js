import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import roomrenovation from "../components/images/room-renovation.png";

function Home(){

　return (

    <Container fluid className="homepage " style={{"padding-left":"10px", "padding-right":"10px"}}>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <a className="navbar-brand" href="#">Change Point Detection</a>
         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                 aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         </button>
             <ul className="navbar-nav">
                 <li className="nav-item active">
                     <a className="nav-link " href="#">Home <span className="sr-only">(current)</span> </a>
                 </li>
                 <li className="nav-item">
                     <a className="nav-link" href="/annotation">Annotation </a>
                 </li>
                 <li className="nav-item">
                     <a className="nav-link" href="/wiki">Wiki</a>
                 </li>

                 <li className="nav-item">
                     <a className="nav-link" href="/datasetFront"> Dataset</a>
                 </li>


             </ul>
     </nav>


            <header  className="float-left text-primary" style={{fontWeight:"bold", fontSize:"32px"}}>
                Welcome to the annotation interface for Change Point Detection!</header>
            <br/>
            <br/>



            <h3 style={{"fontWeight":"bold"}}>Guidelines for Annotation</h3>

            <p>There is a table of contents in  <Link to="annotation/"> annotation front page </Link>.
                You could also start from  <Link to="reviews/0"> the first annotation page  </Link> right away. </p>


            <p>Example page: <b>Room and Renovation</b> related reviews. </p>

            <p>On the top of the page, the category <b>Room and Renovation</b> was highlighted.
                And it displays the user names of the annotators who have finished annotating this page.</p>

            <p>The <b>goal</b> of this annotaiton task is to decide whether the reviews (in sentiment and aspect) align with
            other reviews in the same time period and whether the reviews indicate changes from one
            time period to the successive time period. For more detail, regarding the technicality of selection of
                these reviews, refer to page <Link to="wiki">wiki</Link>.</p>

            <p>In the review table, there are selected reviews for different time periods.
                In the following example, the color of the column <b>Time Period</b> for each review indicates
                the time period in which the review is.
                For each date, there is a review and in which the relevant <b>sentence</b> is highlighted,
                the topic keywords for the highlighted sentence are hashtagged, which is
            a reminder for the category on this page. For example, the first sentence is hashtagged with <b>rooms </b>
             and <b>refurbish</b>, which are the keywords for categories <b>Room</b> and <b>Renovation</b>.
            However, when we consider the aspect and the sentiment for each sentence,
                we focus on the aspect such as <b>Room</b>,
            that is relevant with the entities (i.e., rooms, pools, restaurants, etc.) in hotels.
                <b> Renovation</b> is more like a <i>modification</i> of hotel entities.
            </p>

            <p><b>(1)</b> read the sentences under their contexts (the reviews around the highlighted sentences)
                in each time period, and get a grasp of the
                majority sentiment (positive or negative),
                then decide for each sentence whether it aligns with other sentences in this
                time period, regarding sentiment. As for the asepct, decide whether it alighs with the category.</p>
            <div>
                <b>* For each review, </b>
                <ul>
                    <li>
                        check the <i>yes (aspect) </i> checkbox <i> if and only if </i> you find the aspect of the highlighted
                        sentence aligns with the category

                    </li>
                    <li>
                        check the <i>yes (sentiment) </i> checkbox <i> if and only if </i> you find the sentiment of the highlighted
                        sentence aligns with the sentiment of the majority sentiment in the same time period

                    </li>

                </ul>
            </div>



                <p>In the following example, the sentences in the time period <b>0</b> are all
                    about <b>Room</b> (in aspect) and its renovations and are mostly negative (in sentiment).
                     Most reviews in this time period align with the rest,
                    therefore most sentence is annotated with <i>yes (aspect)</i> and <i> yes (sentiment)</i>. Except
                    the first sentence, of which sentiment is positive and the aspect aligns with the rest,
                    so <i>yes (aspect)</i> is checked, but <i>yes (sentiment)</i> is unchecked, so is the third sentence
                    in the time period <b>0</b> and the last sentence in the time period <b>1</b>.

                </p>

            <p><b>(2)</b> After annotating each sentence in each time period, decide whether
            there is a clear change from one time period to the successive one, i.e., more positive,
            more negative, or no difference. As we can see, from <b>0</b> to <b>1</b> ,
            the reviews are mostly becoming more positive regarding <b>Room</b>, so choose <i>More Positive</i>.</p>

            <p><b>(3)</b> After finishing annotating all the sentences and answering all the questions on one page,
            please input your user name (only in a combination of numbers and alphabets), and click <b>Submit</b>.
                After <b>Submit</b>, you could change your answer and <b>Submit</b> again, or you could go to next page
                to continue.
            </p>

            <img src={roomrenovation} alt="example1"/>


        </Container>
 )
}

export default Home;
