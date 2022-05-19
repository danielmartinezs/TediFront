import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { AiOutlineUserAdd, AiOutlineUser } from 'react-icons/ai';
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
                <Button
                  size='lg'
                  className='btnCrear'
                  onClick={() => (window.location.href = "/PerfilEditarAdmin")}>
                    Administrador
                    <AiOutlineUser/>
                </Button>
              </Card.Body>
            </Card>
            <Card border="primary" className="text-center" style={{ display:'flex' }}>
            <Card.Img variant="top" src={foto7} />
              <Card.Body>
                <Card.Title>Perfiles Tutor</Card.Title>
                <Card.Text>
                  Editar la información de los tutores y sus respectivos hijos.
                </Card.Text>
                <Button
                  size='lg'
                  className='btnCrear'
                  onClick={() => (window.location.href = "/PerfilEditarTutor")}>
                    Tutor
                    <AiOutlineUser/>
                </Button>
              </Card.Body>
            </Card>
            <br/>
            <Button
            size='lg'
            className='btnCrear'
            onClick={() => (window.location.href = "/PerfilCrearPerfil")}>
              Crear Perfil Nuevo
              <AiOutlineUserAdd/>
            </Button>
        </div>
    )
}

export default PerfilSeleccionAdmin