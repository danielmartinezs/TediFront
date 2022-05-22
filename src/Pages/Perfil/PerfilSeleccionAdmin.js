import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { AiOutlineUserAdd, AiOutlineUser } from 'react-icons/ai';
import './perfil.css'
import foto6 from '../../assets/foto6.jpg';
import foto7 from '../../assets/foto7.jpg';

function PerfilSeleccionAdmin() {
    return (
        <div>
            <h1>Página de control de cuentas</h1>
            <Card border="primary" className="text-center" style={{ display:'flex'}}>
            <Card.Img variant="top" src={foto6} />
              <Card.Body>
                <Card.Title>Perfiles Administrador</Card.Title>
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
            <Card border="primary" className="text-center" style={{ display:'flex' }}>
            <Card.Img variant="top" src={foto7} />
              <Card.Body>
                <Card.Title>Perfiles Tutor</Card.Title>
                <Card.Text>
                  Editar la información de los tutores y sus respectivos hijos.
                </Card.Text>
                <Link to={'/PerfilEditarTutor'}>
                  <Button size='lg' className="btnCrear" >
                    Tutor
                    <AiOutlineUser/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <br/>
            <Link to={'/PerfilCrearPerfil'}>
              <Button size='lg' className="btnCrearNuevo">
                Crear Perfil Nuevo
                <AiOutlineUserAdd/>
              </Button>
            </Link>
        </div>
    )
}

export default PerfilSeleccionAdmin