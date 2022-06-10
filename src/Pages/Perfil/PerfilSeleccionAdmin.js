import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { AiOutlineUserAdd, AiOutlineUser } from 'react-icons/ai';
import './perfil.css'
import foto8 from '../../assets/foto8.jpg'
import foto6 from '../../assets/foto6.jpg';
import foto7 from '../../assets/foto7.jpg';

function PerfilSeleccionAdmin() {
    return (
        <div>
            <h1>Control de cuentas</h1>
            <div>
            <Card border="primary" className="text-center" style={{ display:'flex' }}>
            <Card.Img variant="top" src={foto8} />
              <Card.Header>
                <h3>Perfiles Alumnos</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Editar la información de los alumnos.
                </Card.Text>
                <Link to={'/PerfilEditarAlumno'}>
                  <Button size='lg' className="btnCrear" >
                    Alumnnos
                    <AiOutlineUser/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card border="primary" className="text-center" style={{ display:'flex' }}>
            <Card.Img variant="top" src={foto7} />
              <Card.Header>
                <h3>Perfiles Tutor</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Editar la información de los tutores.
                </Card.Text>
                <Link to={'/PerfilEditarTutor'}>
                  <Button size='lg' className="btnCrear" >
                    Tutor
                    <AiOutlineUser/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card border="primary" className="text-center" style={{ display:'flex'}}>
            <Card.Img variant="top" src={foto6} />
              <Card.Header>
                <h3>Perfiles Administrador</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Editar los perfiles administradores de la institución.
                </Card.Text>
                <Link to={'/PerfilEditarAdmin'}>
                  <Button size='lg' className="btnCrear" >
                    Administrador
                    <AiOutlineUser/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <br/>
            <Link to={'/PerfilCrearPerfilNuevo'}>
              <Button size='lg' className="btnCrearNuevo">
                Crear Perfil Nuevo
                <AiOutlineUserAdd/>
              </Button>
            </Link>
            </div>
        </div>
    )
}

export default PerfilSeleccionAdmin