import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/LogoT.svg';
import Login from '../Login/Login';

const NavbarComp = () => {

    function logout() {
        localStorage.clear();
        return <Login/>;
    }
        
    return(
        <Navbar 
        expand="sm"
        collapseOnSelect
        className="color-nav" 
        variant="dark" >
            <Container>
                <Navbar.Brand as={Link} to="/Home">
                    <Logo/>
                       Tedi
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">        
                        <Nav className='ml-auto'>
                        <Nav.Link as={Link} to="/Reportes">Reportes</Nav.Link>
                        <Nav.Link as={Link} to="/Progreso">Progreso</Nav.Link>
                        <Nav.Link as={Link} to="/PerfilPadre">Perfil</Nav.Link>
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

export default NavbarComp;