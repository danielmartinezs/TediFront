import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/LogoT.svg';

const NavbarComp = () => {

    {}
        
    return(
        <Navbar className="color-nav" variant="dark" >
            <Container>
                <Logo/>
                    <Navbar.Brand as={Link} to="/Home">
                       Tedi
                    </Navbar.Brand>
                    
                    <Nav className="me-auto">
                    <Nav.Link as={Link} to="/Reportes">Reportes</Nav.Link>
                    <Nav.Link as={Link} to="/Progreso">Progreso</Nav.Link>
                    <Nav.Link as={Link} to="/PerfilPadre">Perfil</Nav.Link>
                    </Nav>
            </Container>
        </Navbar>            
    )
}

export default NavbarComp;