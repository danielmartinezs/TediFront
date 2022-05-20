import { useEffect, useState } from 'react'
import { Accordion, Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas } from'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import { format, parseISO } from 'date-fns';
import { AiOutlinePlus } from 'react-icons/ai';
const es = require('date-fns/locale/es')
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_HITOS_ALUMNO_URL = 'profiles/gethitosa';
const INGRESA_HITO_URL = '/profiles/newhito';

function ProgresoAlumAdmin() {

    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumnosList, setAlumnosList] = useState([]);
    const [hitosList, setHitosList] = useState([]);
    const [showModalH, setShowModalH] = useState(false)
    const [descripcion, setDescripcion] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showO, setShowO] = useState(false);
    const [showA, setShowA] = useState(false);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
        })
    }

    const getHitosList = (ida) => {
        axios.get(GET_HITOS_ALUMNO_URL+"/"+ida).then((response) => {
            setHitosList(response.data)
        })
        setAlumnSelect(ida)
        setShowModalH(true)
    }

    const handleSubmitHito = async (e) => {
        e.preventDefault()
        setShowO(false)
        try{
            const response = await axios.post(INGRESA_HITO_URL, {
                ida: alumnSelect,
                desc: descripcion
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
            }
        }
        catch(error){
            setShowA(true)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
        }
    }

    return (
        <div> <h3>Progreso por Alumno</h3>
            <Alert 
                show={showA}
                variant={variante}
                onClose={() => setShowA(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
            {alumnosList.map(values => (
                    <div className='admin' key={values.idAlumno}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                        <Button
                                        onClick={() => {getHitosList(values.idAlumno)}}
                                        >Hitos</Button>
                                    </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                )
            )}
            <Modal 
                show={showModalH}
                size="sm"
                scrollable
                onHide={() => setShowModalH(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>
                            Hitos del alumno:
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {hitosList.map(values => (
                            <div key={values.idHito}>
                            <ListGroup>
                                <ListGroupItem>
                                    {values.idHito}. 
                                    {values.descripcion}
                                    <br/>
                                    {format(parseISO(values.fecha), 'PPPPp')}
                                    <br/>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                        }
                        <Button 
                        variant="success"
                        onClick={() => {
                            setShowO(true)
                            setShowModalH(false)}}>
                            Agregar nuevo hito
                            <AiOutlinePlus/>
                        </Button>
                    </ModalBody>
                </Modal>
                <Offcanvas show={showO} onHide={() => setShowO(false)}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Nuevo hito</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
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
                        <Button variant="danger" onClick={() => {
                            setShowO(false)
                            setDescripcion('')}}>
                            Cerrar
                        </Button>
                        <Button variant="success" onClick={handleSubmitHito}>
                            Guardar
                        </Button>
                    </Offcanvas.Body>
                </Offcanvas>
        </div>
    )
}

export default ProgresoAlumAdmin