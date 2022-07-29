import React from "react"; 
import { Link } from "react-router-dom";
import { Button, Carousel } from 'react-bootstrap';
import foto2 from '../../assets/foto2.jpg';
import foto5 from '../../assets/foto5.jpg';
import foto10 from '../../assets/foto10.png';
import foto11 from '../../assets/foto11.png';
import "./styles.css";

function HomeAdmin() {

  return (
    <div style={{ display: 'center', padding: 10 }}>
      <h3>hola</h3>
      <Carousel variant="dark">
        <Carousel.Item interval={15000}>
          <div>            
            <img
            className="d-block w-100"
            src={foto11}
            alt="Image One"
           />
          </div>
          <Carousel.Caption>
            <Link to="/Alumnos">
            <button className="buttonlink">
              Alumnos
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
            <Link to="/CuestionariosCreacionAdmin">
            <button className="buttonlink">
              Cuestionarios
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto10}
            alt="Image Three"
          />
          <Carousel.Caption>
            <Link to="/ReportesAdmin">
            <button className="buttonlink">
              Reportes
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={15000}>
          <img
            className="d-block w-100"
            src={foto5}
            alt="Image five"
          />
          <Carousel.Caption>
            <Link to="/PerfilSeleccionAdmin">
            <button className="buttonlink">
              Cuentas
            </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default HomeAdmin;