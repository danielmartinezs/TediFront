import React, { useEffect, useState }from 'react'
import { Accordion, Button, Card, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'
import { AiOutlineCheck, AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import axios from '../../axios/axios';
import PdfCreator from '../../services/PdfCreator'
import "./reportes.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_ADMINISTRADOR_URL = '/profiles/getadmin';

function ReportesNuevoAdmin() {

    const [datos, setDatos] = useState();
    const [tipo, setTipo] = useState();
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState();
    const [alumno, setAlumno] = useState("");
    const [administrador, setAdministrador] = useState('');
    const [busqueda, setBusqueda] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [temasSemestre, setTemasSemestre] = useState([]);
    const [showModalTipo, setShowModalTipo] = useState(true);
    const [showModalAlumnos, setShowModalAlumnos] = useState(false);
    var idAdmin = localStorage.getItem('id');

    useEffect(() => {
        getAdministrador();
    }, [])

    const getAdministrador = () => {
        axios.get(GET_ADMINISTRADOR_URL+"/"+idAdmin).then((response) => {
            setAdministrador(response.data[0].usuario)
        })
    }
    
    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then(response => {
            setAlumnSearch(response.data);
            setAlumnosList(response.data);
        })
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
        setAlumnSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const handleDisplayAlumnos = () => {
        getAlumnos();
        setShowModalAlumnos(true);
    }

    const handleNuevoObjetivo = () => {
        setTemasSemestre([...temasSemestre, {objetivo: objetivo, descripcion: descripcion}]);
        setObjetivo("");
        setDescripcion("");
    }

    return (
        <div>
            <div className='text-center'>
                <h1>Creación de Reportes</h1>
                <Button
                onClick={() => {setShowModalTipo(true)}}>
                    Cambiar
                </Button>
                {tipo === 'Evaluación de Articulación' &&
                <Card>
                    <Card.Header>
                    <h3>{tipo}</h3>
                    </Card.Header>
                    <Card.Body>
                    <input
                    value={nombreArchivo}
                    onChange={(e) => setNombreArchivo(e.target.value)}
                    placeholder='Nombre del archivo'/>
                    <ListGroup>
                        <ListGroupItem>
                            <h5>Nombre del archivo: {nombreArchivo}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Alumno: {alumno}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Titular de lenguaje: {administrador}</h5>
                        </ListGroupItem>
                    </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                        <Button className='btnSeleccion'
                        onClick={() => {
                            setAlumno(alumnosList[alumnSelect-1]?.nombre)
                            setShowModalAlumnos(false)
                            }}>
                            Crear Reporte
                        </Button>
                    </Card.Footer>
                </Card>
                }
                {tipo === 'Evaluación de Habilidades Preverbales' &&
                <Card>
                    <Card.Header>
                        <h3>{tipo}</h3>
                    </Card.Header>
                    <Card.Body>
                        <input
                        value={nombreArchivo}
                        onChange={(e) => setNombreArchivo(e.target.value)}
                        placeholder='Nombre del archivo'/>
                        <ListGroup>
                            <ListGroupItem>
                                <h5>Nombre del archivo: {nombreArchivo}</h5>
                            </ListGroupItem>
                            <ListGroupItem>
                                <h5>Alumno: {alumno}</h5>
                            </ListGroupItem>
                            <ListGroupItem>
                            <h5>Titular de lenguaje: {administrador}</h5>
                            </ListGroupItem>
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                        <Button className='btnSeleccion'
                        onClick={() => {
                            setAlumno(alumnosList[alumnSelect-1]?.nombre)
                            setShowModalAlumnos(false)
                            }}>
                            Crear Reporte
                        </Button>
                    </Card.Footer>
                </Card>
                }
                {tipo === 'Programa Semestral' &&
                <Card>
                    <Card.Header>
                    <h3>{tipo}</h3>
                    </Card.Header>
                    <Card.Body>
                    <input
                    value={nombreArchivo}
                    onChange={(e) => setNombreArchivo(e.target.value)}
                    placeholder='Nombre del archivo'/>
                    <ListGroup>
                        <ListGroupItem>
                            <h5>Nombre del archivo: {nombreArchivo}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Alumno: {alumno}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Titular de lenguaje: {administrador}</h5>
                        </ListGroupItem>
                    </ListGroup>
                    <br/>
                    <h1>Lista de objetivos</h1>
                    <input
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    placeholder='Objetivo'
                    />
                    <input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder='Descirpción del objetivo'
                    />
                    <Button 
                    className='btnSeleccion'
                    onClick={() => {handleNuevoObjetivo()}}
                    >
                        Agregar Objetivo
                    </Button>
                    {JSON.stringify(temasSemestre)}
                    </Card.Body>
                    <Card.Footer>
                        <Button className='btnSeleccion'
                        onClick={() => {
                            setAlumno(alumnosList[alumnSelect-1]?.nombre)
                            setShowModalAlumnos(false)
                            }}>
                            Crear Reporte
                        </Button>
                    </Card.Footer>
                </Card>
                }
                {tipo === 'Reporte Semestral' &&
                <Card>
                    <Card.Header>
                    <h3>{tipo}</h3>
                    </Card.Header>
                    <Card.Body>
                    <input
                    value={nombreArchivo}
                    onChange={(e) => setNombreArchivo(e.target.value)}
                    placeholder='Nombre del archivo'/>
                    <ListGroup>
                        <ListGroupItem>
                            <h5>Nombre del archivo: {nombreArchivo}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Alumno: {alumno}</h5>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5>Titular de lenguaje: {administrador}</h5>
                        </ListGroupItem>
                    </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                        <Button className='btnSeleccion'
                        onClick={() => {
                            setAlumno(alumnosList[alumnSelect-1]?.nombre)
                            setShowModalAlumnos(false)
                            }}>
                            Crear Reporte
                        </Button>
                    </Card.Footer>
                </Card>
                }
            </div>
            {/*MODAL SELECCION TIPO*/}
            <Modal 
            show={showModalTipo}
            scrollable
            onHide={() => setShowModalTipo(false)}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Escoge el tipo de reporte a crear
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Button
                    className='btnSeleccion'
                    value= 'Programa Semestral'
                    onClick={(e) => {
                        setTipo(e.target.value)
                        setShowModalTipo(false)
                        handleDisplayAlumnos()
                        }}>
                        Programa Semestral
                    </Button>
                    <Button
                    className='btnSeleccion'
                    value= 'Reporte Semestral'
                    onClick={(e) => {
                        setTipo(e.target.value)
                        setShowModalTipo(false)
                        handleDisplayAlumnos()
                        }}>
                        Reporte Semestral
                    </Button>
                    <Button
                    className='btnSeleccion'
                    value= 'Evaluación de Articulación'
                    onClick={(e) => {
                        setTipo(e.target.value)
                        setShowModalTipo(false)
                        handleDisplayAlumnos()
                        }}>
                        Evaluación de Articulación
                    </Button>
                    <Button
                    className= 'btnSeleccion'
                    value= 'Evaluación de Habilidades Preverbales'
                    onClick={(e) => {
                        setTipo(e.target.value)
                        setShowModalTipo(false)
                        handleDisplayAlumnos()
                        }}>
                        Evaluación de Habilidades Preverbales
                    </Button>
                </ModalBody>
            </Modal>
            {/* MODAL CONTESTAR ALUMNO */}
            <Modal 
            show={showModalAlumnos}
            onHide={() => setShowModalAlumnos(false)}
            scrollable={true}>
                <Modal.Header>
                    <Modal.Title>¿A qué alumno se le aplicará el reporte?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="containerInput">
                <input
                    className="inputBuscar"
                    value={busqueda}
                    placeholder="Buscar Alumno"
                    maxLength="100"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
                </div>
                {alumnSearch && alumnSearch.map(values => (
                    <div key={values.idAlumno}>
                        <Card
                        className="text-center"
                        border = "warning"
                        style={{ width: '100%' }}>
                            <Card.Body>
                            <div>
                                {values.nombre}
                                <br/>
                                <Button
                                variant="success"
                                onClick={() => {setAlumnSelect(values.idAlumno)}}>
                                    <AiOutlineSelect/>
                                </Button>
                            </div>
                            </Card.Body>
                        </Card>
                    </div>
                    ))
                }
                </Modal.Body>
                <Modal.Footer>        
                    <Button className='btnAct'
                    onClick={() => {
                        setAlumno(alumnosList[alumnSelect-1]?.nombre)
                        setShowModalAlumnos(false)
                        }}>
                        {alumnosList[alumnSelect-1]?.nombre}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ReportesNuevoAdmin