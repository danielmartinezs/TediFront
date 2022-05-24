import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Accordion, Button, ButtonGroup, Modal } from 'react-bootstrap';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
import "./alumnos.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const INGRESA_HITO_URL = '/profiles/newhito';

function Alumnos() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [busqueda, setBusqueda] = useState("");
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
            setAlumnSearch(response.data)
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

    const filtrar = (terminoBusqueda) => {
        console.log("El termino es "+terminoBusqueda)
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                setAlumnSearch(alumnosList)
                return elemento;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        console.log("Resultado busqueda es: "+resultadosBusqueda)
        setAlumnSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
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
                <div className="containerInput">
                <input
                    className="inputBuscar"
                    value={busqueda}
                    placeholder="Buscar Alumno"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
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
            {alumnSearch && alumnSearch.map(values => (
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