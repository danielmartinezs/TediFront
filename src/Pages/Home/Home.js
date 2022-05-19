import React from "react"; 
import { Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import foto1 from '../../assets/foto1.png';
import foto2 from '../../assets/foto2.jpg';
import foto9 from '../../assets/foto9.jpg';
import "./styles.css";


function Home() {

  return (
    <div style={{ display: 'center', width:1200, border:1, padding: 30 }}>
      <Carousel>
        <Carousel.Item interval={15000}>
          <div>
            <img
            className="d-block w-100"
            src={foto1}
            alt="Image One"
           />
          </div>
          <Carousel.Caption>
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/Progreso")}>
              Progreso
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto2}
            alt="Image Two"
          />
          <Carousel.Caption>
            <h3>Reportes</h3>
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/Reportes")}>
              Reporte
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto9}
            alt="Image three"
          />
          <Carousel.Caption>
            <h3>Perfil</h3>
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/PerfilPadre")}>
              Perfil
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default Home;