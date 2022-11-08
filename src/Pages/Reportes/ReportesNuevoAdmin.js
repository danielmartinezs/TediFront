import React, { useEffect, useState }from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { AiOutlineCalendar, AiOutlineCheck, AiOutlineClose, AiOutlineDelete, AiOutlineEdit, AiOutlineFilePdf, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import axios from 'axios'
import PdfProgramaSemestral from '../../services/PdfCreatorProgramaSemestral'
import PdfReporteSemestral from '../../services/PdfCreatorReporteSemestral';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import "./reportes.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_ADMINISTRADOR_URL = '/profiles/getadmin';
const GET_SEMESTRE_URL = 'reportes/getsemestre';
const GET_CUESTIONARIOS_URL = 'questionnaires/getcuestionarios';
const GET_FECHAS_EVALUACIONES_URL = 'reportes/especificafechareporte';
const GET_PLAN_SEMESTRAL_URL = 'reportes/getplansemestral';

function ReportesNuevoAdmin() {

    const [idEditar, setIdEditar] = useState(0);
    const [idDelete, setIdDelete] = useState(0);
    const [fechasEval, setFechasEval] = useState();
    const [fechaSelect, setFechaSelect] = useState('');
    const [timestamp, setTimestamp] = useState('')
    const [idCuestionario, setIdCuestionario] = useState(0);
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const [tipo, setTipo] = useState();
    const [categoria, setCategoria] = useState();
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState();
    const [alumno, setAlumno] = useState("");
    const [administrador, setAdministrador] = useState('');
    const [busqueda, setBusqueda] = useState("");
    const [planSelect, setPlanSelect] = useState();
    const [detalles, setDetalles] = useState();
    const [veredicto, setVeredicto] = useState('');
    const [cumplido, setCumplido] = useState('');
    const [objetivo, setObjetivo] = useState("");
    const [objetivoEdit, setObjetivoEdit] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [descripcionEdit, setDescripcionEdit] = useState("");
    const [temasSemestre, setTemasSemestre] = useState([]);
    const [temarioSemestral, setTemarioSemestral] = useState([]);
    const [semestre, setSemestre] = useState();
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showModalTipo, setShowModalTipo] = useState(true);
    const [showModalAlumnos, setShowModalAlumnos] = useState(false);
    const [showModalFechasEval, setShowModalFechasEval] = useState(false);
    const [showModalObjetivos, setShowModalObjetivos] = useState(false);
    const [showModalCheck, setShowModalCheck] = useState(false);
    const [showModalPlan, setShowModalPlan] = useState(false);
    const [showMDelete, setShowMDelete] = useState(false);
    const [showOffEditO, setShowOffEditO] = useState(false);
    const [btnState, setBtnState] = useState(false);
    var idAdmin = localStorage.getItem('id');

    useEffect(() => {
        getAdministrador();
        getSemestre();
        getCuestionarios();
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

    const getCuestionarios = () => {
        axios.get(GET_CUESTIONARIOS_URL).then((response) => {
            setCuestionariosList(response.data)
        })
    }

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then(response => {
            setAlumnSearch(response.data);
            setAlumnosList(response.data);
        })
    }

    const getFechasEvaluaciones = () => {
        axios.post(GET_FECHAS_EVALUACIONES_URL, {
            idCuestionario: idCuestionario,
            idAlumno: alumnSelect,
        }).then((response) => {
            setFechasEval(response.data);
        })
    }

    const conversionHorario = (fecha) => {
        setFechaSelect(fecha)
        let newtimestamp = 0;
        newtimestamp = new Date(fecha);
        newtimestamp.setHours(newtimestamp.getHours()-6);//cambiar a 4 o 5 o 6 dependiendo del horario
        newtimestamp = newtimestamp.toISOString();
        setTimestamp(newtimestamp)
    }

    const getPlanSemestral = () => {
        axios.get(GET_PLAN_SEMESTRAL_URL+"/"+alumnSelect).then((response) => {
            setTemarioSemestral(response.data);
            console.log(JSON.parse(response.data[0].detalles));
        })
    }

    const findAlumno = (id) => {
        console.log(id)
        for(let i = 0; i < alumnosList.length; i++){
            if(alumnosList[i].idAlumno === id){
                return(alumnosList[i].nombre + ' ' + alumnosList[i].apellido);
            }
        }
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
        getFechasEvaluaciones();
        //getFechasEvaluacionesH();
        setShowModalFechasEval(true);
    }

    const handleDisplayPlanSemestral = () => {
        getPlanSemestral();
        setShowModalPlan(true);
    }

    const handleDisplayCheckeo = (slot) => {
        setPlanSelect(slot);
        const details = JSON.parse(temarioSemestral[slot].detalles);
        for(var i = 0; i < details.length; i++){
            details[i].cumplido = false;
        }
        setDetalles(details);
        setShowModalPlan(false)
        setShowModalCheck(true)
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

    const toggleCheck = (slug) => {
        console.log(slug+'Antes: '+detalles[slug].cumplido)
        detalles[slug].cumplido = !detalles[slug].cumplido;
        setBtnState(btnState => !btnState);
        console.log(slug+'Ahora: '+detalles[slug].cumplido)
        setDetalles(detalles);
        veredict();
    }

    const veredict = () => {
        var veredicto = "";
        for(var i = 0; i < detalles.length; i++){
            if(detalles[i].cumplido){
                veredicto += "✅ ";
            }
            else{
                veredicto += "❌ ";
            }
        }
        setVeredicto(veredicto);
        {!veredicto.includes("❌ ")? setCumplido('Se cumplieron todos los objetivos'): setCumplido('No se cumplieron todos los objetivos') }
    }

    const renderTooltipFecha = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Para poder generar este reporte primero debes de elegir una fecha ya existente, en caso de no contar con una no podras generar el reporte.
        </Tooltip>
    );

    return (
        <div>
            <div className='alertas'>
              <Alert 
              show={show}
              variant={variante}
              onClose={() => setShow(false)}
              dismissible>
                <Alert.Heading>
                  {msg}
                </Alert.Heading>
              </Alert>
            </div>
            <div className='text-center'>
                <h1>Creación de Reportes</h1>
                <Button
                onClick={() => {
                    setShowModalTipo(true)
                    setAlumnSelect()
                    setDetalles()
                    setNombreArchivo()}}>
                    Cambiar tipo de reporte
                </Button>
                <Button
                onClick={() => {
                    setShowModalAlumnos(true)
                    setDetalles()
                    setNombreArchivo()
                    }}>
                    Cambiar alumno
                </Button>
                {categoria === 'Semestral' &&
                    <div>
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
                        className='btnEditarRespuesta'
                        onClick={() => {setShowModalObjetivos(true)}}>
                            Listado de objetivos
                        </Button>
                        </Card.Body>
                        <Card.Footer>
                            <Button
                            className='btnEditarRespuesta'
                            onClick={(e) => {
                                PdfProgramaSemestral(temasSemestre, semestre, administrador, alumnSelect, alumno, nombreArchivo)
                                }}>
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
                            <ListGroupItem>
                                <h5>Detalles: {detalles &&JSON.stringify(detalles)} </h5>
                            </ListGroupItem>
                            <ListGroupItem>
                                <h5>Veredicto: {veredicto}</h5>
                            </ListGroupItem>
                            <ListGroupItem>
                                <h5>Estado del objetivo: {cumplido}</h5>
                            </ListGroupItem>
                        </ListGroup>
                        <br/>
                        <Button
                        className='btnEditarRespuesta'
                        onClick={() => {handleDisplayPlanSemestral()}}>
                            Elegir plan semestral
                        </Button>
                        </Card.Body>
                        <Card.Footer>
                            <Button
                            className='btnEditarRespuesta'
                            onClick={(e) => PdfReporteSemestral(temarioSemestral, detalles, administrador, alumnSelect, alumno, nombreArchivo, cumplido)}>
                                Crear Reporte
                                <AiOutlineFilePdf/> 
                            </Button>
                        </Card.Footer>
                    </Card>
                    }
                    </div>
                }
                {categoria === 'Cuestionario' &&
                    <div>
                        <Card>
                        <Card.Header>
                            <h3>{tipo}</h3>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup>
                                <ListGroupItem>
                                    <h5>Alumno: {alumno}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Titular de lenguaje: {administrador}</h5>
                                </ListGroupItem>
                                {fechaSelect &&
                                <ListGroupItem>
                                    <h5>Fecha del reporte: {format(parseISO(fechaSelect), 'PPPPp', { locale: es })}</h5>
                                </ListGroupItem>}
                                <OverlayTrigger
                                placement="bottom"
                                overlay={renderTooltipFecha}>
                                    <Button
                                    className='btnCrear'
                                    onClick={() => {handleDisplayFechas()}}>
                                        Elegir fecha
                                        <AiOutlineCalendar/>
                                    </Button>
                                </OverlayTrigger>
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            {fechaSelect !== "" &&
                            <Link to={`/ReportesNuevoRegistroAdmin/${timestamp}`}>
                                <Button
                                className='btnCrear'>
                                    Generar reporte
                                    <AiOutlineFilePdf/> 
                                </Button>
                            </Link>}
                        </Card.Footer>
                    </Card>
                    </div>
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
                    <div className='text-center'>
                    <Card>
                        <Card.Header>
                            <h3>Programas Semestrales</h3>
                        </Card.Header>
                        <Card.Body>
                            <Button
                            className='btnEditarRespuesta'
                            value= 'Programa Semestral'
                            onClick={(e) => {
                                setTipo(e.target.value)
                                setCategoria('Semestral')
                                setShowModalTipo(false)
                                handleDisplayAlumnos()
                                }}>
                                Programa Semestral
                            </Button>
                            <Button
                            className='btnEditarRespuesta'
                            value= 'Reporte Semestral'
                            onClick={(e) => {
                                setTipo(e.target.value)
                                setCategoria('Semestral')
                                setShowModalTipo(false)
                                handleDisplayAlumnos()
                                }}>
                                Reporte Semestral
                            </Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <h3>Cuestionarios</h3>
                        </Card.Header>
                        <Card.Body>
                            {cuestionariosList.map((cuestionario, index) => {
                                return (
                                    <Button
                                    className='btnEditarRespuesta'
                                    value={cuestionario.nombre}
                                    onClick={(e) => {
                                        setTipo(e.target.value)
                                        setCategoria('Cuestionario')
                                        setShowModalTipo(false)
                                        setIdCuestionario(index+1)
                                        handleDisplayAlumnos()
                                        }}>
                                        {cuestionario.nombre}
                                    </Button>
                                )
                            })}       
                        </Card.Body>
                    </Card>
                    </div>
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
                {alumnSearch && alumnSearch.map((values, index) => (
                    <div key={index}>
                        <Card
                        className="text-center"
                        border = "warning"
                        style={{ width: '100%' }}>
                            <Card.Body>
                            <div>
                                {values.nombre+' '+values.apellido}
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
                    <Button
                    className='btnAct'
                    onClick={() => {
                        setAlumno(findAlumno(alumnSelect))
                        setShowModalAlumnos(false)
                        }}>
                        {findAlumno(alumnSelect)}
                    </Button>
                    }
                </Modal.Footer>
            </Modal>
            {/* MODAL ELECCION FECHA */}
            <Modal
            show={showModalFechasEval}
            scrollable={true}
            onHide={() => {setShowModalFechasEval(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Con base a cuál registro deseas realizar el reporte?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fechasEval?.length > 0 ? 
                    <div>
                        {fechasEval.map(values => (
                        <div key={values.idFecha}>
                            <Card
                            className="text-center"
                            border = "warning"
                            style={{ width: '100%' }}>
                                <Card.Body>
                                <div>
                                    {format(parseISO(values.fecha), 'PPPp', { locale: es })}
                                    <br/>
                                    <Button
                                    variant="success"
                                    onClick={() => {
                                        conversionHorario(values.fecha)
                                        setShowModalFechasEval(false)
                                        }}>
                                        <AiOutlineSelect/>
                                    </Button>
                                </div>
                                </Card.Body>
                            </Card>
                        </div>
                        ))}
                    </div>
                    :
                    <div>
                        Al alumno no se le ha asignado ningún registro de evaluación
                    </div>
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
                className='btnAct'
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
                    className='btnEditarRespuesta'
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
            {/*MODAL SELECT PLAN*/}
            <Modal
            show={showModalPlan}
            onHide={() => {setShowModalPlan(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {temarioSemestral.length > 0 ?
                    <div className='text-center'>
                        <h5>Listado de Planes Semestrales</h5>
                        {temarioSemestral.map((elemento, index) => {
                                return(
                                    <div key={index} className="text-center">
                                        <ListGroup>
                                            <ListGroupItem>
                                                <h6>Nombre: {elemento.planSemestral} </h6>
                                                <h6>Semestre: {elemento.periodo}</h6>
                                            </ListGroupItem>
                                            <Button
                                            variant="success"
                                            onClick={() => {handleDisplayCheckeo(index)}}>
                                                <AiOutlineSelect/>
                                            </Button>
                                        </ListGroup>
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="text-center">
                        <h6>El alumno actualmente no cuenta con un plan semestral</h6>
                    </div>
                    }
                </Modal.Body>
                    
            </Modal>
            {/*MODAL CHECKEO DE OBJETIVOS*/}
            <Modal
            show={showModalCheck}
            onHide={() => {setShowModalCheck(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Revisión de Plan Semestral:<br/> {temarioSemestral[planSelect]?.planSemestral}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                    {detalles?.map((elemento, index) => {
                        return(
                            <div key={index} className="text-center">
                                <ListGroup>
                                    <ListGroupItem>
                                        <h6>Objetivo: {elemento.objetivo}</h6>
                                        <h6>Descripción: {elemento.descripcion}</h6>
                                        <h6>Estado del objetivo: {elemento.cumplido ? 'Cumplido' : 'No cumplido'}</h6>
                                        {elemento.cumplido ?
                                         <Button
                                         className='btnBorrarP'
                                         variant='success'>
                                            <AiOutlineCheck/>
                                        </Button> : 
                                        <Button
                                        className='btnBorrarP'
                                         variant='danger'>
                                            <AiOutlineClose/>
                                        </Button>}
                                    <Button
                                    className='btnBorrarP'
                                    onClick={() => {toggleCheck(index)}}>
                                        Cambiar estado
                                    </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        )
                    }
                    )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReportesNuevoAdmin