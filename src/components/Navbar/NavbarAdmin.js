import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/LogoT.svg';
import Login from '../Login/Login';

const NavbarAdmin = () => {

    function logout() {
        localStorage.clear();
        return <Login/>;
    }
    
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
                        <Button
                        variant='outline-light'
                        onClick={logout}>
                            Cerrar Sesión
                        </Button>
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>            
    )
}

export default NavbarAdmin;