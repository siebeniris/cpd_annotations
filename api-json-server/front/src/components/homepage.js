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

             </ul>
     </nav>


            <header  className="float-left text-primary" style={{fontWeight:"bold", fontSize:"32px"}}>
                Welcome to the annotation interface for Change Point Detection!</header>
            <br/>
            <br/>



            <h3 style={{"fontWeight":"bold"}}>Guidelines for Annotation</h3>

            <p>There is a table of contents in  <Link to="annotation/"> annotation front page </Link>.
                You could also start from  <Link to="reviews/0"> the first annotation page  </Link> right away. </p>


            <p>Example page: <span class="text-primary">Room and Renovation</span> related reviews in
                <Link to="reviews/26">  page 26  </Link> </p>
            <p>On the top of the page, the category <span className="text-primary">Room and Renovation</span> was highlighted. </p>
            <p>And it displays the user names of the annotators who have finished annotating this page.</p>

            <p>The <b>goal</b> of this annotaiton task is to decide whether the reviews (in sentiment and aspect) align with
            other reviews in the same time period and whether the reviews indicate changes from one
            time period to the successive time period. For more detail, regarding the selection of
                these reviews, refer to page <Link to="wiki">wiki</Link>.</p>

            <p>In the review table, there are selected reviews for different time periods.
                In the following example, the color of the column <b>Time Period</b> for each review indicates
                the time period in which the review is.
                For each date, there is a review and in which the relevant <b>sentence</b> is highlighted,
                the topic keywords for the highlighted sentence are hashtagged, which is
            a reminder for the category on this page. For example, the second sentence is hashtagged with <b>rooms </b>
             and <b>updating</b>, which are the keywords for categories <b>Room</b> and <b>Renovation</b>.
            However, when we consider the aspect and the sentiment for each sentence,
                we focus on the aspect such as <b>Room</b>,
            that is relevant with the entities (i.e., rooms, pools, restaurants, cafes, parking lot, stuff, etc.) in hotels.
                <b> Renovation</b> is more like a <i>modification</i> of hotel entities.
            </p>

            <p><b>(1)</b> read the sentences under their contexts (the reviews around the highlighted sentences)
                in each time period, and get a grasp of the
                majority sentiment (positive or negative), and the majority aspect,
                then decide for each sentence whether it aligns with other sentences in this
                time period, regarding sentiment and aspect. </p>
            <div>
                <b>* For each review, </b>
                <ul>
                    <li> check the <i>yes(aspect & sentiment) </i> checkbox <i>if and only if</i>  you find both the sentiment and aspect
                        of the highlighted sentence align with the other sentences in the same period (i)
                    </li>
                    <li>
                        check the <i>no (aspect) </i> checkbox <i> if and only if </i> you find the aspect of the highlighted
                        sentence doesn't align and the sentiment of the highlighted sentence does align with the other sentences in the same period (ii)

                    </li>
                    <li>
                        check the <i>no (sentiment) </i> checkbox <i> if and only if </i> you find the sentiment of the highlighted
                        sentence doesn't align and the aspect of the highlighted sentence does align with the other sentences in the same period (iii)

                    </li>
                    <li>
                        check the <i>not clear (sentiment) </i> checkbox <i> if and only if </i> you find the sentiment of the highlighted (iv)
                        sentence not clear to determine.


                    </li>
                </ul>
            </div>


           <p><b> The <i>yes</i> checkbox and <i>no</i> checkboxes should be exlusive to each other.
            You could check one or two <i>no</i> checkboxes, or only check the <i>yes</i> checkbox. </b> </p>

        <p><b>The <i>no (sentiment) </i> checkbox and <i>not clear (sentiment)</i> checkbox are exclusive to each other</b></p>
        <div>
            The possible choices for question "Does this highlighted sentence align with other sentences in this time period":
            <ul>
                <li> (i)</li>

                <li>(ii) </li>
                <li>(ii) and (iii)</li>
                <li>(ii) and (iv)</li>
                <li>(iii)</li>
                <li>(iv)</li>

            </ul>

        </div>

                <p>In the following example, the sentences in the time period <b>0</b> are all
                    about <b>Room</b> (in aspect) and its renovations and are all negative (in sentiment).
                     Each review in this time period aligns with the rest,
                    therefore each sentence is annotated with <i>yes (aspect & sentiment)</i>.
                    For example, the first sentence's sentiment in time period <b>1</b> is hard to determine under the context,
                    so <i>not clear (sentiment)</i> is checked.
                   And the second sentence in time period <b>1</b>, i.e.,
            "Please update the hot tubs". On the one hand, under the context "the hot tubs" are in the pools, so the
            aspect of this sentence is <b>pool</b>  rather than <b>room</b>; on the other hand, the sentence is asking to do the
            renovation, which means it has a negative sentiment about the hot tubs. Nonetheless, other sentences
            in this time period have positive sentiments about the rooms in terms of renovations. So this sentence
            is annotated with <b>no</b> both in aspect and sentiment.
                    The second-to-last sentence in time period <b>2</b> is about <b>pool</b> rather than <b>room</b>,
                    but the sentiment leans in being positive, so only <i>no (aspect) </i>  is checked.
                </p>

            <p><b>(2)</b> After annotating each sentence in each time period, decide whether
            there is a clear change from one time period to the successive one, i.e., more positive,
            more negative, or no difference. As we can see, from <b>0</b> to <b>1</b> and from <b>1</b> to <b>2</b>,
            the reviews are mostly becoming more positive regarding <b>Room</b>, so choose <i>More Positive</i> for
            both questions.</p>

            <p><b>(3)</b> After finishing annotating all the sentences and answering all the questions,
            please input your user name (only in a combination of numbers and alphabets), and click <b>Submit</b>.
            </p>
        <p>* <i> When clicked on the checkboxes for questions in the bottom, only after inputing the annotator name,
            the checkboxes will be checked in interface. Sorry for the inconvenience.</i></p>

            <img src={roomrenovation} alt="example1"/>


        </Container>
 )
}

export default Home;
