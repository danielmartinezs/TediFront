import React, { useEffect, useState }from 'react'
import { Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, Offcanvas } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineFilePdf } from 'react-icons/ai'
import axios from '../../axios/axios';
import PdfCreator from '../../services/PdfCreatorEvaluacionHPV'
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairedetails'
const GET_ADMINISTRADOR_URL = '/profiles/getadmin'
const DATOS_REPORTE_URL = 'reportes/getdatosreporte';

function ReportesNuevoRegistroAdmin() {
    const [datos, setDatos] = useState();
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(0);
    const [idEditar, setIdEditar] = useState(0);
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [preguntaEdit, setPreguntaEdit] = useState('');
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [administrador, setAdministrador] = useState('');
    const [respuestasList, setRespuestasList] = useState([]);
    const [comentariosList, setComentariosList] = useState([]);
    const [showA, setShowA] = useState(false);
    const [showMC, setShowMC] = useState(false);
    const [showMQA, setShowMQA] = useState(false);
    const [showOffEditC, setShowOffEditC] = useState(false);
    const { timestamp } = useParams();
    var idAdmin = localStorage.getItem('id');

    useEffect(() => {
        getDatos();
        getAdministrador();
    }, [])

    const getQuestionnairesDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+selectedQuestionnaire).then((response) => {
            console.log(response.data);
            relacionarKeys(response.data)
        })
    }

    const getAdministrador = () => {
        axios.get(GET_ADMINISTRADOR_URL+"/"+idAdmin).then((response) => {
            setAdministrador(response.data[0].usuario)
        })
    }

    const relacionarKeys = (data) => {
        let datos = respuestasList;
        for(let i = 0; i < respuestasList.length; i++){
            let key = respuestasList[i].id;
            console.log(i+"-"+key);
            for(let j = 0; j < data.length; j++){
                if(data[j].idPregunta === key){
                    console.log("match")
                    datos[i].pregunta = data[j].pregunta;
                    datos[i].opciones = JSON.parse(data[j].opciones);
                }
            }
        }
        console.log(datos);
        setRespuestasList(datos);
        setShowMQA(true);
    } 

    const getDatos = () => {
        axios.get(DATOS_REPORTE_URL+"/"+timestamp).then((response) => {
            setDatos(response.data)
            setSelectedQuestionnaire(response.data[0].idCuestionario)
            setComentariosList(JSON.parse(response.data[0].comentarios))
            setRespuestasList(JSON.parse(response.data[0].respuestas))
        })
    }

    const handleEditarPregunta = () => {
        comentariosList[idEditar].comment = preguntaEdit;
        setShowOffEditC(false)
        setShowA(true)
        setVariante('success')
        setMsg("Comentario editado correctamente")
        setShowMC(false)
    }

    return (
        <div>
            <div className='text-center'>
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
                <h1>Creación de Reportes</h1>
                {datos && 
                <div>
                    <Card>
                        <Card.Header>
                            Datos a imprimir
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
                                    <h5>Cuestionario: {datos[0].titulo}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Materia: {datos[0].materia}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Evaluador: {administrador}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Fecha: {format(parseISO(datos[0].fecha), 'PPPPp', { locale: es })}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Alumno: {datos[0].nombre+' '+datos[0].apellido}</h5>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Button
                                    className='btnEditarRespuesta'
                                    onClick={getQuestionnairesDetails}>
                                        Visualizar respuestas del alumno
                                    </Button>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Button
                                    className='btnEditarRespuesta'
                                    onClick={() => {setShowMC(true)}}>
                                        Visualizar comentarios hechos por el maestro
                                    </Button>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h5>Puntaje: {datos[0].puntaje}</h5>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </div>}
            </div>
            <Button
            className='btnEditarRespuesta'
            onClick={(e) => PdfCreator(datos, administrador, respuestasList, nombreArchivo)}>
                Crear Reporte
                <AiOutlineFilePdf/>
            </Button>
            {/*MODAL VISUALIZAR COMENTARIOS */}
            <Modal
            show={showMC}
            onHide={() =>{setShowMC(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Comentarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comentariosList.map((comentario, index) => {
                        return (
                            <div key={index} className='services'>
                                <div className='first-division'>
                                    {comentario.comment !== "" ?
                                    <h5>{index+1}. {comentario.comment}</h5>
                                    :
                                    <h5>{index+1}. Sin comentarios</h5>
                                    }
                                </div>
                                <div className='third-division'>
                                    <Button
                                    variant='success'
                                    onClick={() => {
                                        setIdEditar(index)
                                        setShowMC(false)
                                        setPreguntaEdit(comentario.comment)
                                        setShowOffEditC(true)
                                    }}>
                                        <AiOutlineEdit/>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>
            {/*MODAL VISUALIZAR RESPUESTAS */}
            <Modal
            show={showMQA}
            onHide={() => {setShowMQA(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Respuestas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {respuestasList.map((respuesta, index) => {
                        return (
                            <div key={index}>
                                <ListGroup>
                                    <ListGroupItem>
                                        <h5>{index+1}. {respuesta.pregunta}</h5>
                                        {respuesta.opciones?.opciones[0].respuesta !== '' ? 
                                        <div>
                                            <h5>Opciones:</h5>
                                            {respuesta.opciones?.opciones.map((opcion, index) => {
                                                return (
                                                    <div key={index} className='text-center'>
                                                        <ListGroup>
                                                            <ListGroupItem>
                                                            <h5>{opcion.respuesta}</h5>
                                                            </ListGroupItem>
                                                        </ListGroup>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        :
                                        <div/>
                                        }
                                        <h5>Respuesta elegida: {respuesta.value}</h5>
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>
            {/*OFFCANVAS EDITAR COMENTARIO */}
            <Offcanvas 
            show={showOffEditC} 
            placement={'bottom'}
            onHide={() => setShowOffEditC(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Editar comentario</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="editComment">
                        <Form.Label>Comentario</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={1}
                        value={preguntaEdit}
                        onChange={(e) => setPreguntaEdit(e.target.value)}>
                            {preguntaEdit}
                        </Form.Control>
                    </Form.Group>
                </Form>
                <Button 
                size='sm'
                variant="danger"
                onClick={() => {
                setShowOffEditC(false)
                setShowMC(true)
                setPreguntaEdit("")}}>
                    Cerrar
                </Button>
                <Button
                size='sm'
                variant="success"
                onClick={handleEditarPregunta}>
                    Guardar
                </Button>
            </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default ReportesNuevoRegistroAdmin