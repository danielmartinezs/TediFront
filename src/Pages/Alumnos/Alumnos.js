import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Accordion, Button, ButtonGroup, Modal } from 'react-bootstrap';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const INGRESA_HITO_URL = '/profiles/newhito';

function Alumnos() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState(0);
    const [descripcion, setDescripcion] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showM, setShowM] = useState(false);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
        })
    }

    const handleCloseM = () => {
        setShowM(false)
        setDescripcion("")
    }

    const handleSubmitHito = async (e) => {
        e.preventDefault()
        setShowM(false)
        try{
            const response = await axios.post(INGRESA_HITO_URL, {
                ida: alumnSelect,
                desc: descripcion
            })
            if(response.status === 200){
                setShow(true)
                setVariante('success')
                setMsg(response.data.message)
            }
        }
        catch(error){
            setShow(true)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
        }
    }

    const handleNewHito = (ida) => {
        setShowM(true)
        setAlumnSelect(ida);

    }

    return (
        <div>
            <h1>Página Alumnos</h1>
            <Alert 
                show={show}
                variant={variante}
                onClose={() => setShow(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
            <div>
            <Modal 
                show={showM}
            >
                <Modal.Header>
                    <Modal.Title>Reportar Hito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="newHito"
                    >
                    <Form.Label>Detalles</Form.Label>
                    <Form.Control as="textarea" rows={4} onChange={(e) => setDescripcion(e.target.value)}>
                        {descripcion}
                    </Form.Control>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleCloseM}>
                    Cerrar
                </Button>
                <Button variant="success" onClick={handleSubmitHito}>
                    Guardar
                </Button>
                </Modal.Footer>
            </Modal>
            </div>
            {alumnosList.map(values => (
                    <div className='admin' key={values.idAlumno}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                    <ButtonGroup>
                                        <Button className="btnBancoPreguntas" onClick={() => handleNewHito(values.idAlumno)}>Reportar Hito</Button>
                                        <Link to={`/CuestionariosResponderAdmin/${values.idAlumno}`}>
                                            <Button className="btnBancoPreguntas" >Contestar cuestionario</Button>
                                        </Link>
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