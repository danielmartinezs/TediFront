import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { AiOutlineUsergroupAdd, AiOutlineUser } from 'react-icons/ai';
import "./progreso.css"
import foto12 from '../../assets/foto12.jpg';
import foto13 from '../../assets/foto13.jpg';

function ProgresoAdmin() {
    return (
        <div>
            <Card border="primary" className="text-center" style={{ display:'flex' }}>
            <Card.Img variant="top" src={foto13} />
              <Card.Header>
                <h3>Progreso por grupo</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Revisa la información y estadísticas por grupo.
                </Card.Text>
                <Link to={'/ProgresoGrupoAdmin'}>
                  <Button size='lg' className="btnCrear" >
                    Grupo
                    <AiOutlineUsergroupAdd/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card border="primary" className="text-center" style={{ display:'flex'}}>
            <Card.Img variant="top" src={foto12} />
              <Card.Header>
                <h3>Perfiles Alumnos</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Revisar la información y estadísticas de los alumnos individualmente.
                </Card.Text>
                <Link to={'/ProgresoAlumAdmin'}>
                  <Button size='lg' className="btnCrear" >
                    Alumnos
                    <AiOutlineUser/>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
        </div>
    )
}

export default ProgresoAdmin