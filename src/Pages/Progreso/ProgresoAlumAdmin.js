import { useEffect, useState } from 'react'
import { Accordion, Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas } from'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import { format, parseISO } from 'date-fns';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import { DateTimePicker } from '@material-ui/pickers';
import "./progreso.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_HITOS_ALUMNO_URL = 'profiles/gethitosa';
const INGRESA_HITO_URL = '/profiles/newhito';
const DELETE_HITO_URL = '/profiles/borrahito';

function ProgresoAlumAdmin() {

    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumnosList, setAlumnosList] = useState([]);
    const [hitosList, setHitosList] = useState([]);
    const [showModalHito, setShowModalHito] = useState(false)
    const [descripcion, setDescripcion] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [llave, setLlave] = useState(0);
    const [showO, setShowO] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showMDelete, setShowMDelete] = useState(false);

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
        setShowModalHito(true)
    }

    const handleDeleteHito = async (llave) => {
        const response = await axios.post(DELETE_HITO_URL+"/"+llave)
        setVariante('success')
        setMsg(response.data.message)
        setShowA(true)
        setShowMDelete(false)
        setShowModalHito(false)
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
                setDescripcion("")
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
                                        className='btnBancoPreguntas'
                                        onClick={() => {getHitosList(values.idAlumno)}}
                                        >Hitos</Button>
                                    </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                )
            )}
            <Modal 
                show={showModalHito}
                size="sm"
                scrollable
                onHide={() => setShowModalHito(false)}
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
                                    <h3>{values.descripcion}</h3>
                                    {format(parseISO(values.fecha), 'PPPPp', { locale: es })}
                                    <br/>
                                    <Button
                                    className='btnEditarP'
                                    variant='success'
                                    >
                                        <AiOutlineEdit/>
                                    </Button>
                                    <Button
                                    className='btnBorrarP'
                                    onClick={() => {
                                        setShowMDelete(true)
                                        setLlave(values.idHito)
                                    }}
                                    variant='danger'
                                    >
                                        <AiOutlineDelete/>
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                        }
                        <Button 
                        variant="success"
                        className='btnCrearP'
                        onClick={() => {
                            setShowO(true)
                            setShowModalHito(false)}}>
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
                        <Form className="form">
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
                        <Button 
                        variant="danger" 
                        className='btnBorrarP'
                        onClick={() => {
                            setShowO(false)
                            setDescripcion('')
                        }}>
                            Cerrar
                        </Button>
                        <Button 
                        variant="success"
                        className='btnEditarP' 
                        onClick={handleSubmitHito}>
                            Guardar
                        </Button>
                    </Offcanvas.Body>
                </Offcanvas>

             <Modal show={showMDelete} onHide={() => {setShowMDelete(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar este hito?</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Una vez borrado el hito no podrá recuperarse</Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="success" 
                    onClick={() => {setShowMDelete(false)}}>
                        No
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={() => {handleDeleteHito(llave)}}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal> 
        </div>
    )
}

export default ProgresoAlumAdmin