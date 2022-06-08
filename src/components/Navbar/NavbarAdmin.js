import React from 'react';
import { Button, Container, Navbar, Nav, Modal } from 'react-bootstrap'
import { BiLogOut } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/LogoT.svg';
import Logout from '../Login/Logout';

const NavbarAdmin = () => {

    const navigate = useNavigate();

    function logout() {
        navigate('/logout');
        return <Logout/>;
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
                        <Nav.Link as={Link} to="/CuestionariosAdmin">Cuestionarios</Nav.Link>
                        <Nav.Link as={Link} to="/PerfilSeleccionAdmin">Perfiles</Nav.Link>
                        <Button
                        variant='outline-light'
                        onClick={logout}>
                            Cerrar Sesión
                            <BiLogOut/>
                        </Button>
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarAdmin;