import React, { useEffect, useState }from 'react'
import { Accordion, Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas } from 'react-bootstrap'
import { AiOutlineCheck, AiOutlineEdit, AiOutlineInfoCircle, AiOutlineDelete, AiOutlinePlus, AiOutlineFilePdf, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import axios from '../../axios/axios';
import PdfProgramaSemestral from '../../services/PdfCreatorProgramaSemestral'
import "./reportes.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_ADMINISTRADOR_URL = '/profiles/getadmin';
const GET_SEMESTRE_URL = 'reportes/getsemestre';
const GET_FECHAS_EVALUACIONES_URL = 'reportes/getfechasalumno';

function ReportesNuevoAdmin() {

    const [idEditar, setIdEditar] = useState(0);
    const [idDelete, setIdDelete] = useState(0);
    const [datos, setDatos] = useState();
    const [fechasEval, setFechasEval] = useState();
    const [fechaSelect, setFechaSelect] = useState('');
    const [idCuestionario, setIdCuestionario] = useState(0);
    const [tipo, setTipo] = useState();
    const [semestre, setSemestre] = useState();
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState();
    const [alumno, setAlumno] = useState("");
    const [administrador, setAdministrador] = useState('');
    const [busqueda, setBusqueda] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [objetivoEdit, setObjetivoEdit] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [descripcionEdit, setDescripcionEdit] = useState("");
    const [temasSemestre, setTemasSemestre] = useState([]);
    const [showModalTipo, setShowModalTipo] = useState(true);
    const [showModalAlumnos, setShowModalAlumnos] = useState(false);
    const [showModalFechasEval, setShowModalFechasEval] = useState(false);
    const [showModalObjetivos, setShowModalObjetivos] = useState(false);
    const [showMDelete, setShowMDelete] = useState(false);
    const [showOffEditO, setShowOffEditO] = useState(false);
    var idAdmin = localStorage.getItem('id');

    useEffect(() => {
        getAdministrador();
        getSemestre();
    }, [])

    const getAdministrador = () => {
        axios.get(GET_ADMINISTRADOR_URL+"/"+idAdmin).then((response) => {
            setAdministrador(response.data[0].usuario)
        })
    }
    
    const getSemestre = () => {
        axios.get(GET_SEMESTRE_URL).then((response) => {
            setSemestre(response.data)
        })
    }

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then(response => {
            setAlumnSearch(response.data);
            setAlumnosList(response.data);
        })
    }

    const getFechasEvaluaciones = () => {
        axios.get(GET_FECHAS_EVALUACIONES_URL+"/"+alumnSelect).then((response) => {
            setFechasEval(response.data);
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

    const handleDisplayFechas = () => {
        getFechasEvaluaciones()
        setShowModalFechasEval(true);
    }

    const handleNuevoObjetivo = () => {
        setTemasSemestre([...temasSemestre, {objetivo: objetivo, descripcion: descripcion}]);
        setObjetivo("");
        setDescripcion("");
    }

    const handleEditO = (e) => {
        temasSemestre[idEditar].objetivo = objetivoEdit;
        temasSemestre[idEditar].descripcion = descripcionEdit;
        setObjetivoEdit("");
        setDescripcionEdit("");
        setShowOffEditO(false);
        setShowModalObjetivos(true);
    }

    const handleDeleteO = (e) => {
        temasSemestre.splice(idDelete, 1);
        setIdDelete(0);
        setShowMDelete(false);
        setShowModalObjetivos(true);
    }

    return (
        <div>
            <div className='text-center'>
                <h1>Creación de Reportes</h1>
                <Button
                onClick={() => {setShowModalTipo(true)}}>
                    Cambiar tipo de reporte
                </Button>
                <Button
                onClick={() => {setShowModalAlumnos(true)}}>
                    Cambiar alumno
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
                        <ListGroupItem>
                            <h5>Semestre: {semestre[0]?.periodo}</h5>
                        </ListGroupItem>
                    </ListGroup>
                    <br/>
                    <Button
                    onClick={() => {setShowModalObjetivos(true)}}>
                        Listado de objetivos
                    </Button>
                    </Card.Body>
                    <Card.Footer>
                        <Button className='btnSeleccion'
                        onClick={(e) => PdfProgramaSemestral(temasSemestre, semestre, administrador, alumno, nombreArchivo)}>
                            Crear Reporte
                            <AiOutlineFilePdf/>  
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
                        handleDisplayFechas()
                        }}>
                        Evaluación de Articulación
                    </Button>
                    <Button
                    className= 'btnSeleccion'
                    value= 'Evaluación de Habilidades Preverbales'
                    onClick={(e) => {
                        setIdCuestionario(1);
                        setTipo(e.target.value)
                        setShowModalTipo(false)
                        handleDisplayAlumnos()
                        handleDisplayFechas()
                        }}>
                        Evaluación de Habilidades Preverbales
                    </Button>
                </ModalBody>
            </Modal>
            {/* MODAL SELECCIÓN ALUMNO */}
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
                    {alumnSelect &&        
                    <Button className='btnAct'
                    onClick={() => {
                        setAlumno(alumnosList[alumnSelect-1]?.nombre)
                        setShowModalAlumnos(false)
                        }}>
                        {alumnosList[alumnSelect-1]?.nombre}
                    </Button>
                    }
                </Modal.Footer>
            </Modal>
            {/* MODAL ELECCION FECHA */}
            <Modal
            showModalFechasEval
            scrollable={true}>
                <Modal.Header>
                    <Modal.Title>¿Con base a cuál registro deseas realizar el reporte?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fechasEval?.map(values => (
                        <div key={values.idFecha}>
                            <Card
                            className="text-center"
                            border = "warning"
                            style={{ width: '100%' }}>
                                <Card.Body>
                                <div>
                                    {values.fecha}
                                    <br/>
                                    <Button
                                    variant="success"
                                    onClick={() => {
                                        setFechaSelect(values.idFecha)
                                        setShowModalFechasEval(false)
                                        }}>
                                        <AiOutlineSelect/>
                                    </Button>
                                </div>
                                </Card.Body>
                            </Card>
                        </div>
                        ))
                    }
                </Modal.Body>
            </Modal>
            {/* MODAL LISTA DE OBJETIVOS */}
            <Modal
            show={showModalObjetivos}
            scrollable
            onHide={() => {setShowModalObjetivos(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Lista de objetivos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <AiOutlinePlus/>
                </Button>
                {temasSemestre.map((elemento, index) => {
                        return(
                            <div key={index} className="text-center">
                                <ListGroup>
                                    <ListGroupItem>
                                        <h6>Objetivo {index+1}</h6>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h6>{elemento.objetivo}</h6>
                                        <h6>{elemento.descripcion}</h6>
                                <Button
                                className='btnEditarP'
                                onClick={() => {
                                    setShowOffEditO(true)
                                    setShowModalObjetivos(false)
                                    setIdEditar(index);
                                    setObjetivoEdit(elemento.objetivo)
                                    setDescripcionEdit(elemento.descripcion)
                                }}
                                variant='success'>
                                    <AiOutlineEdit/>
                                </Button>
                                <Button
                                className='btnBorrarP'
                                onClick={() => {
                                    setShowMDelete(true)
                                    setShowModalObjetivos(false)
                                    setIdDelete(index);
                                }}
                                variant='danger'>
                                    <AiOutlineDelete/>
                                </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        )
                    }
                    )}
                    <Button
                    className='btnSeleccion'
                    onClick={() => {
                        setShowModalObjetivos(false)
                    }}>
                        Terminar listado de objetivos<AiOutlineCheck/>
                    </Button>
                </Modal.Body>
            </Modal>
            {/*MODAL BORRAR OBJETIVO*/}
            <Modal 
             show={showMDelete} 
             onHide={() => {setShowMDelete(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar este objetivo?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button 
                    variant="success" 
                    onClick={() => {
                        setShowMDelete(false)
                        setShowModalObjetivos(true)}}>
                        No
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={() => {handleDeleteO()}}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*OFFCANVAS EDITAR OBJETIVO*/}
            <Offcanvas 
            show={showOffEditO} 
            placement={'end'} 
            onHide={() => setShowOffEditO(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Editar Objetivos</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="form">
                        <Form.Group
                        className="mb-3"
                        controlId="newHito">
                            <Form.Label>Objetivo</Form.Label>
                            <Form.Control 
                            as="textarea"
                            rows={1}
                            value={objetivoEdit}
                            onChange={(e) => setObjetivoEdit(e.target.value)}>
                                {objetivoEdit}
                            </Form.Control>
                            <br/>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                            as="textarea"
                            rows={1} 
                            value={descripcionEdit}
                            onChange={(e) => setDescripcionEdit(e.target.value)}>
                                {descripcionEdit}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <br/>
                    <Button 
                    variant="danger" 
                    className='btnBorrarP'
                    onClick={() => {
                        setShowOffEditO(false)
                    }}>
                        Cerrar
                    </Button>
                    <Button 
                    variant="success"
                    className='btnEditarP'
                    onClick={handleEditO}>
                        Guardar
                    </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default ReportesNuevoAdmin