import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Accordion, Button, ButtonGroup, Modal } from 'react-bootstrap';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import { AiOutlineSearch, AiOutlineSliders } from 'react-icons/ai';
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import ReactPaginate from 'react-paginate';
import "./alumnos.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const INGRESA_HITO_URL = '/profiles/newhito';

function Alumnos() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showM, setShowM] = useState(false);
    const alumnosPerPage = 5;
    const pageVisisted = pageNumber * alumnosPerPage;
    const pageCount = Math.ceil(alumnosList.length / alumnosPerPage);
    const [alumnosPag, setAlumnosPag] = useState([]);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
            setAlumnosPag((response.data).slice(pageVisisted, pageVisisted + alumnosPerPage));
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

    const handleNewHito = (ida) => {
        setShowM(true)
        setAlumnSelect(ida);
    }

    const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                return;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) || elemento.apellido.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        if(terminoBusqueda === ""){
            setAlumnosPag((alumnosList).slice(0, 0 + alumnosPerPage))
        }
        else{
            setAlumnosPag(resultadosBusqueda);
        }
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const onPageChange = ({ selected }) => {
        setPageNumber(selected);
        setAlumnosPag((alumnosList).slice(selected * alumnosPerPage, selected * alumnosPerPage + alumnosPerPage));
    }

    return (
        <div className='text-center'>
            <h1>Listado de Alumnos</h1>
            <div className='alertas'>
                <Alert 
                show={showA}
                variant={variante}
                onClose={() => setShowA(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
                </Alert>
            </div>
            <div>
                <div className="containerInput">
                {/* <button>
                    <AiOutlineSliders/>
                </button> */}
                <input
                    className="inputBuscar"
                    value={busqueda}
                    maxLength="100"
                    placeholder="Buscar Alumno"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
            <Modal 
            show={showM}
            onHide={() => setShowM(false)}
            dismissible>
                <Modal.Header closeButton>
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
            {alumnosPag && alumnosPag.map(values => (
                    <div className='admin' key={values.idAlumno}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre+' '+values.apellido}</AccordionHeader>
                                    <AccordionBody>
                                        <ButtonGroup>
                                            <Button className="btnBancoPreguntas" onClick={() => handleNewHito(values.idAlumno)}>Reportar Hito</Button>
                                            <Link to={`/CuestionariosResponderAdmin/${values.idAlumno}`}>
                                                <Button className="btnBancoPreguntas" >Contestar cuestionario</Button>
                                            </Link>
                                            <Link to={`/PerfilEditarAlumno`}>
                                                <Button className="btnBancoPreguntas" >Editar información</Button>
                                            </Link>
                                        </ButtonGroup>
                                    </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                )
            )}
            <br/>
            {busqueda === "" &&
            <ReactPaginate
            previousLabel={'Anterior'}
            nextLabel={'Siguiente'}
            pageCount={pageCount}
            onPageChange={onPageChange}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtns"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}/>}
        </div>
    )
}

export default Alumnos