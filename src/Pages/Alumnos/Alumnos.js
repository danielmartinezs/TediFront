import React, { useEffect, useState } from 'react'
import { Alert, Accordion, Button, ButtonGroup, ToggleButton, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
const GET_ALUMNOS_URL = '/profiles/getalumnos'

function Alumnos() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showM, setShowM] = useState(false);
    const [timeStamp, setTimeStamp] = useState();

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
        })
    }

    const handleShowM = () => {
        setShowM(true)
    }

    const handleCloseM = () => {
        setShowM(false)
    }

    const handleTimeStamp = () => {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const fecha = new Date();
        fecha.setTime(timestamp);
        console.log(fecha);
        setTimeStamp(fecha);
    }

    return (
        <div>
            <h1>Página Alumnos</h1>
            <Alert 
                show={show}
                variant={variante}
                onClose={() => setShowM(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
            <div>
            <Modal 
                show={showM} 
                onHide={handleCloseM}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reportar Hito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Detalles</Form.Label>
                    <Form.Control as="textarea" rows={4}>
                        {timeStamp}
                    </Form.Control>
                    </Form.Group>
                </Form>
                <Button variant="success" onClick={handleTimeStamp}>
                    Generar fecha de hoy
                </Button>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseM}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCloseM}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            </div>
            {alumnosList.map(values => (
                    <div className='admin' key={values.idAdministrador}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                    <ButtonGroup>
                                        <Button className="btnBancoPreguntas" onClick={handleShowM}>Reportar Hito</Button>
                                        <Button className="btnBancoPreguntas" onClick={() => (window.location.href = "/CuestionariosResponderAdmin")}>Contestar cuestionario</Button>
                                    </ButtonGroup>
                                    </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default Alumnos