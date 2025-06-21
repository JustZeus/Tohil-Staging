import { useContext, useRef, useEffect } from "react"
import Navbar from "../../components/navbar/navbar"
import {homeImg} from "./images/img"
import "./home.css"
import {color} from "../dashboard/const"

export function HomeApp(){
    const bgRef = useRef(null);
    const forestRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
      const handleScroll = () => {
        const value = window.scrollY;
        
        if (bgRef.current) {
          bgRef.current.style.top = value * 0.5 + "px"; // Ajusta el factor para el efecto parallax
        }
        
        if (forestRef.current) {
          forestRef.current.style.bottom = value * 0.15 + "px"; // Movimiento más lento
        }
        
        if (textRef.current) {
        const startFade = 100; // Cuando comienza el desvanecimiento (en pixels)
        const endFade = 500;   // Cuando está completamente desvanecido
        
        // Calcula la opacidad (valor entre 0 y 1)
        let opacity = 1;
        if (value > startFade) {
          opacity = 1 - (value - startFade) / (endFade - startFade);
          opacity = Math.max(0, opacity); // No menor que 0
        }
        
        textRef.current.style.opacity = opacity;
        textRef.current.style.transform = `translateY(${value * 0.5}px)`; // Movimiento más suave
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return(
        <div>
        <Navbar/>
  
        {/* PARALLAX SECTIONS */}
        <div className="homeSection">
           {/* Section 0 */}
            <section className="section0">
                <img src={homeImg.bg} alt=""  ref={bgRef}  />
                <img src={homeImg.forest} alt=""  ref={forestRef} />
                <h1 id="text" ref={textRef} >TOHIL</h1>
            </section>
          {/* Section 1 */}
          <section className="section1">
              <div className="content">
                <h2>Monitoring and Alert Platform</h2>
                <p>
                  Inspired by the Mayan god of fire, Tohil is a fire monitoring and alert platform that seeks to protect both nature and people. Our mission is to anticipate, detect, and communicate risk situations related to fires in real time.
                  <br />
                  <br />
                  Through an intuitive interface and interactive map, users can view affected areas, alert levels, and receive practical recommendations to stay safe. Tohil automatically notifies the appropriate authorities in case of danger, enabling a rapid and efficient response.
                  <br />
                  <br />
                  With four alert levels, from favorable conditions to wildfires out of control, Tohil combines technology, prevention, and community responsibility to help you stay informed and act in a timely manner.
                  This homepage offers a quick introduction to the app and a step-by-step usage guide to help you navigate Tohil effectively.          
                </p>
              </div>      
          </section>
  
          {/* Section 2 */}
          <section className="section2">
            <div className="content">
                <h2>How to Use Tohil</h2>
                <div className="content1">
                  <ol className="steps">
                    <li>Go to the “Dashboard” section to see all current wildfire alerts.</li>
                    <li>On the left-hand sidebar, you'll find:</li>
                    <ul>
                      <li>A zone filter, where you can select the region you're interested in.</li>
                      <li>A list of alert cards, each summarizing an active alert.</li>
                    </ul>
                  </ol>
                  <p>Each alert card includes:</p>
                  <ul className="steps">
                    <li>A description of the alert and its severity level.</li>
                    <li>Two buttons:</li>
                    <ul>
                      <li><strong>View Map:</strong> Highlights the affected area on the map (right side) using a polygon.</li>
                      <li><strong>More Info:</strong> Displays full details about the incident, including safety recommendations and insights.</li>
                    </ul>
                    <li>At the bottom of the card, you’ll see whether authorities have been notified. If so, it shows which authority and the exact time of notification.</li>
                  </ul>
                </div>
            </div>
            <div className="content ">
              <h2>Alert Levels</h2>
              <div className="content2">
                <p>Tohil classifies wildfire alerts into 4 levels, with color indicators for easy recognition:</p>
                <ul className="steps">
                  <li><strong style={{color:color(1)}}>Level 1</strong>:  Favorable conditions for a potential fire. Stay alert in the area.</li>
                  <li><strong style={{color:color(2)}}>Level 2 </strong>:  Favorable conditions for a potential fire. Stay alert in the area.</li>
                  <li> <strong style={{color:color(3)}}>Level 3</strong>:  Confirmed fire. Visual systems have detected clear imagery of active flames.</li>
                  <li><strong style={{color:color(4)}}>Level 4</strong>:  High-risk or out-of-control fire. Immediate response and maximum caution required.</li>
                </ul>
              </div>
              <div className="safety">
                  <span>Safety and Rapid Response</span><br />
                  Whenever an alert is triggered, Tohil not only informs general users but also automatically notifies the appropriate authorities. This ensures a fast and coordinated response to protect people and ecosystems.

                  With Tohil, you're always one step ahead of wildfire threats.
                  Your safety is our priority.
                </div>
            </div>
          </section>
  
          {/* Section 3 */}
          <section className="section3">
            <div className="full-image" >
              <h2>Alert Dashboard View</h2>
              <img
                src={homeImg.dash}
                alt="Gran incendio"
              />
            </div>
          </section>
        </div>
      </div>
        
    )
}

