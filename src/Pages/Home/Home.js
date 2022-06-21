import React from "react";
import { Link } from "react-router-dom";
import { Button, Carousel } from 'react-bootstrap';
import foto1 from '../../assets/img1.png';
import foto2 from '../../assets/img2.png';
import foto9 from '../../assets/img12.jpg';
import "./styles.css";


function Home() {

  return (
    <div style={{ display: 'center', padding: 10 }}>
      <Carousel variant="dark">
        <Carousel.Item interval={15000}>
          <div>
            <img
            className="d-block w-100"
            src={foto1}
            alt="Image One"
           />
          </div>
          <Carousel.Caption>
            <Link to="/Progreso">
            <button className="buttonlink">
              Progreso
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto2}
            alt="Image Two"
          />
          <Carousel.Caption>
            <Link to="/Reportes">
            <button className="buttonlink">
              Reportes
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto9}
            alt="Image three"
          />
          <Carousel.Caption>
            <Link to="/PerfilPadre">
            <button className="buttonlink">
              Perfil
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default Home;