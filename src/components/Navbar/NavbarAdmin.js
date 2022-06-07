import { Button } from 'bootstrap';
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/LogoT.svg';

const NavbarAdmin = () => {

    {}
        
    return(
        <Navbar 
        expand="md"
        collapseOnSelect
        className="color-nav"
        variant="dark" >
            <Container>
                <Navbar.Brand as={Link} to="/HomeAdmin">
                    <Logo/>
                       Tedi
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className='mr-auto'>
                        <Nav.Link as={Link} to="/Alumnos">Alumnos</Nav.Link>
                        <Nav.Link as={Link} to="/ReportesAdmin">Reportes</Nav.Link>
                        <Nav.Link as={Link} to="/ProgresoAlumAdmin">Progreso</Nav.Link>
                        <Nav.Link as={Link} to="/CuestionariosCreacionAdmin">Cuestionarios</Nav.Link>
                        <Nav.Link as={Link} to="/PerfilSeleccionAdmin">Perfil</Nav.Link>
                        <Nav.Link as={Link} to="/Login">
                            <Button>
                                Cerrar Sesión
                            </Button>
                        </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>            
    )
}

export default NavbarAdmin;