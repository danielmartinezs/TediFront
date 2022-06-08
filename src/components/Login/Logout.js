import React, { useEffect, useState } from 'react';
import { Button, Container, Navbar, Nav, Modal } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'

export const Logout = () => {
    
    const [show, setShow] = useState(true);
    const navigate = useNavigate();

    return(
        <div>
        <Modal
        show={show}
        onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Cerrar Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Está seguro que desea cerrar sesión?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                    window.location.reload();
                    setShow(false)}
                    }>
                    Cerrar Sesión
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
    );

}
export default Logout;