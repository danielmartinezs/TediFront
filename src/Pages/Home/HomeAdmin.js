import React from "react"; 
import { Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import foto2 from '../../assets/foto2.jpg';
import foto5 from '../../assets/foto5.jpg';
import foto10 from '../../assets/foto10.png';
import foto11 from '../../assets/foto11.png';
import "./styles.css";

function HomeAdmin() {

  return (
    <div style={{ display: 'center', width:1000, padding: 30 }}>
      <Carousel>
        <Carousel.Item interval={15000}>
          <div>            
            <img
            className="d-block w-100"
            src={foto11}
           />
          </div>
          <Carousel.Caption>
            <Button
              className="buttons"
              onClick={() => (window.location.href = "/Alumnos")}>
              Alumnos
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
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/CuestionariosCreacionAdmin")}>
              Cuestionarios
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto10}
            alt="Image Two"
          />
          <Carousel.Caption>
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/ReportesAdmin")}>
              Reportes
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto5}
            alt="Image five"
          />
          <Carousel.Caption>
            <Button
            className="buttons"
            onClick={() => (window.location.href = "/PerfilSeleccionAdmin")}>
              Cuentas
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default HomeAdmin;