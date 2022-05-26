import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom'
import { Accordion, Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import {  AiOutlineEdit, AiOutlineSend, AiTwotoneStar } from 'react-icons/ai';
import "./cuestionarios.css";
import axios from '../../axios/axios'
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const UPLOAD_QUESTIONNAIRES_URL = '/questionnaires/uploadquestionnaire'
const EDIT_QUESTIONNAIRES_URL = '/questionnaires/editquestionnaire'
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'
const GET_RECENT_ENTRY_URL = 'questionnaires/getrecententry'
const INGRESA_HITO_URL = '/profiles/newhito';

function Respuesta () {

    const [preguntasList, setPreguntasList] = useState([])
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const [formattedAnswers, setFormattedAnswers] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [comentariosEdit, setComentariosEdit] = useState([]);
    const [edicionList, setEdicionList] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [respuestaAbierta, setRespuestaAbierta] = useState([]);
    const [respuestaEdit, setRespuestaEdit] = useState();
    const [showOffHito, setShowOffHito] = useState(false);
    const [showOffRes, setShowOffRes] = useState(false);
    const [showMEdit, setShowMEdit] = useState(false);
    const [showA, setShowA] = useState(false);
    const [msg, setMsg] = useState("");
    const [variante, setVariante] = useState('');
    const [numeroPregunta, setNumeroPregunta] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [puntaje, setPuntaje] = useState(0);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(0);
    const [isSelectedQuestionnaire, setIsSelectedQuestionnaire] = useState(true);
    const [isDone, setIsDone] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [comment, setComment] = useState("");
    const [tiempoRegistro, setTiempoRegistro] = useState();
    const [llaveCambio, setLlaveCambio] = useState(0);
    const {idAlumno} = useParams();

    useEffect (() => {
        getCuestionarios()
    }, [])

    useEffect (() => {
       getQuestionnairesDetails()
    }, [selectedQuestionnaire])

    useEffect (() => {
        console.log(edicionList)
    }, [preguntaActual])

    const getQuestionnairesDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+selectedQuestionnaire).then((response) => {
            setPreguntasList(response.data)
        })
    }

    const getCuestionarios = () => {
        axios.get(GET_CUESTIONARIOS_URL).then((response) => {
            setCuestionariosList(response.data)
        })
    }

    const getMostRecent = () => {
        axios.get(GET_RECENT_ENTRY_URL+"/"+idAlumno).then((response) => {
            console.log(response)
            setTiempoRegistro(response.data[0].ultimoregistro)
        })

    }

    const formatQuestions = () => {
        const opc = preguntasList.map((lis) => JSON.parse(JSON.parse(JSON.stringify(lis.opciones))));
        setFormattedAnswers(opc)
        setIsStart(false)
        console.log(preguntasList)
    }

    const handleSelectedQuestionnaire = (idcuestionario) => {
        console.log("cuestionario elegido "+idcuestionario)
        setSelectedQuestionnaire(idcuestionario)
        setIsSelectedQuestionnaire(false)
        setIsStart(true)
    }

    const handleUploadCuestionario = async (respuestas) => {
        try{
            const response = await axios.post(UPLOAD_QUESTIONNAIRES_URL, {
                ida: idAlumno,
                idc: selectedQuestionnaire,
                respuestas: JSON.stringify(respuestas),
                comentarios: JSON.stringify(comentarios)
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
            }
        }catch(error){
            if(!error?.response){
                setMsg('No hay respuesta del servidor');
              } else if(error.response?.status === 400){
                setMsg(error.response.data.message);
              } else if(error.response?.status === 401){
                setMsg('Usuario sin autorización');
              } else if(error.response?.status === 403){
                setMsg(error.response.data.message);
              } else if(error.response?.status === 500){
                setMsg("Algo salió mal al cargar los datos");
              }
        }
    }

    const handleSubmitEdicion = async () => {
        try{
            const response = await axios.post(EDIT_QUESTIONNAIRES_URL, {
                ida: idAlumno,
                idc: selectedQuestionnaire,
                timestamp: tiempoRegistro,
                respuestas: JSON.stringify(respuestasEdit),
                comentarios: JSON.stringify(comentariosEdit)
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
            }
        }catch(error){
            if(!error?.response){
                setShowA(true)
                setVariante('error')
                setMsg('No hay respuesta del servidor');
              } else if(error.response?.status === 400){
                setShowA(true)
                setVariante('error')
                setMsg(error.response.data.message);
              } else if(error.response?.status === 401){
                setShowA(true)
                setVariante('error')
                setMsg('Usuario sin autorización');
              } else if(error.response?.status === 403){
                setShowA(true)
                setMsg(error.response.data.message);
              } else if(error.response?.status === 500){
                setShowA(true)
                setVariante('error')
                setMsg("Algo salió mal al cargar los datos");
              }
        }
    }

    const handleSubmitHito = async (e) => {
        e.preventDefault()
        setShowOffHito(false)
        try{
            const response = await axios.post(INGRESA_HITO_URL, {
                ida: idAlumno,
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

    const handleAnswerAbierta = (answer, preguntaActual) => {
        const newAnswer = 
        {
            value: answer
        }
        setRespuestaAbierta([...respuestasEdit, newAnswer])
    }

    const handleEditAnswerAbierta = (answer) => {
        const editAnswer = 
        {
            value: answer
        }
        respuestaAbierta[numeroPregunta] = editAnswer;
    }

    const handleRespuestasArray = (answer, preguntaActual) => {
        const newAnswer = 
        {
            id: preguntasList[preguntaActual].idPregunta,
            value: answer
        }
        setRespuestas([...respuestas, newAnswer])
        setRespuestasEdit([...respuestasEdit, newAnswer])
        const newComment = 
        {
            comment: comment
        }
        setComentarios([...comentarios, newComment])
        setComentariosEdit([...comentariosEdit, newComment])
        const newQA = 
        {
            id: preguntasList[preguntaActual].idPregunta,
            numpregunta: preguntaActual,
            pregunta: preguntasList[preguntaActual].pregunta,
            respuesta: answer,
            comentario: comment
        }
        setEdicionList([...edicionList, newQA])
    }

    function handleAnswerSubmit(answer, e){
        if(isNaN(answer)){
            setPuntaje(puntaje+0)
        }else{
            setPuntaje(puntaje+answer)
        }
        if(preguntaActual === preguntasList.length - 1){
            const newAnswer = 
            {
                id: preguntasList[preguntaActual].idPregunta,
                value: answer
            }
            setRespuestas([...respuestas, newAnswer])
            setRespuestasEdit([...respuestasEdit, newAnswer])
            const newComment = 
            {
                comment: comment
            }
            setComentarios([...comentarios, newComment])
            setComentariosEdit([...comentariosEdit, newComment])
            const newQA = 
            {
                id: preguntasList[preguntaActual].idPregunta,
                numpregunta: preguntaActual,
                pregunta: preguntasList[preguntaActual].pregunta,
                respuesta: answer,
                comentario: comment
            }
            setEdicionList([...edicionList, newQA])
            setIsDone(true)
        }
        else{
            handleRespuestasArray(answer, preguntaActual)
            setPreguntaActual(preguntaActual + 1)
            setComment("")
        }
    }

    const handleEditRespuesta = (answer, e) => {
        const editAnswer = 
        {
            id: edicionList[numeroPregunta].id,
            value: answer
        }
        respuestasEdit[numeroPregunta] = editAnswer;
        const editComment = 
        {
            comment: comment
        }
        comentariosEdit[numeroPregunta] = editComment;
        const editedQA = 
        {
            id: edicionList[numeroPregunta].id,
            numpregunta: edicionList[numeroPregunta].numpregunta,
            pregunta: edicionList[numeroPregunta].pregunta,
            respuesta: answer,
            comentario: comment
        }
        edicionList[numeroPregunta] = editedQA;
        setComment("");
        setRespuestaEdit("");
        setLlaveCambio(0);
        setShowOffRes(false)
        setShowMEdit(true)
    }

    const WrapItUp = () => {
        setIsFinished(true)
        setComment("")
        handleUploadCuestionario(respuestas)
        getMostRecent()
    }

    if(isSelectedQuestionnaire)
    return (
        <div>
            {cuestionariosList.map(values => (
                    <div key={values.idCuestionario}>
                            <Accordion>
                                <AccordionItem>
                                    <AccordionHeader>
                                        Cuestionario #{values.idCuestionario}
                                        <h1>{values.nombre}</h1>
                                        Materia: {values.materia}
                                    </AccordionHeader>
                                    <AccordionBody>
                                        <Button
                                        onClick = {() => handleSelectedQuestionnaire(values.idCuestionario)}>
                                            elegir cuestionario
                                        </Button>
                                    </AccordionBody>
                                </AccordionItem>
                            </Accordion>
                    </div>  
            ))}
        </div>
    );

    if (isStart)
    return (
      <main className="cuestionario">
        <div className="fin">
            <span>
            Bienvenido al cuestionario {preguntasList[preguntaActual]?.idCuestionario}
            </span>
            <h2>{preguntasList[preguntaActual]?.nombre}</h2>
            <button 
            className='buttonq'
            onClick={() => formatQuestions()}>
                Comenzar
          </button>
           <button 
            className="buttonq"
            onClick={() => {
                setIsStart(false)
                setIsSelectedQuestionnaire(true)}}>
                Regresar
            </button>
        </div>
      </main>
    );

    if (isFinished)
    return (
      <main className="cuestionario">
          <Alert 
                show={showA}
                variant={variante}
                onClose={() => setShowA(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
        <div className="fin">
            <span>
            Has concluido con el cuestionario {preguntasList[0]?.nombre}
            </span>
          <Button 
          className='buttonq' 
          onClick={() => {setShowMEdit(true)}}>
            Editar Respuestas
          </Button>
          <Link to={'/Alumnos'}>
            <Button 
            size='lg' 
            className="buttonq" >
                Regresar a página de alumnos
            </Button>
          </Link>
        </div>
        <Modal 
        show={showMEdit}
        size="lg"
        scrollable
        onHide={() => setShowMEdit(false)}
        >
        <ModalHeader closeButton>
            <ModalTitle>
                Registro de Respuestas:
            </ModalTitle>
        </ModalHeader>
            <ModalBody>
                {edicionList && edicionList.map(values => (
                    <div key={values.id}>
                        <ListGroup>
                            <ListGroupItem>
                                {console.log("numero pregunta es"+values.numpregunta)}
                                {console.log("values id es"+values.id)}
                                {console.log("llavecambio es"+llaveCambio)}
                                {console.log(respuestasEdit)}
                                {console.log(comentariosEdit)}
                                <h3>{values.pregunta}</h3>
                                <h2>Comentario: {values.comentario}</h2>
                                <h2>Respuesta elegida: {values.respuesta}</h2>
                                <br/>
                                <Button
                                className='btnEditarRespuesta'
                                onClick={() => {
                                    setShowOffRes(true)
                                    setShowMEdit(false)
                                    setLlaveCambio(values.id)
                                    setNumeroPregunta(values.numpregunta)
                                    setComment(values.comentario)
                                    setRespuestaEdit(respuestaAbierta[values.numpregunta]?.value)
                                }}
                                variant='success'
                                >
                                    Editar<AiOutlineEdit/>
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                        </div>
                    ))
                }
                <Button
                className='btnEditarRespuesta'
                onClick={() => {
                    handleSubmitEdicion()
                    setShowMEdit(false)
                }}>
                Guardar registros
                <AiOutlineSend/>
            </Button>
            </ModalBody>
        </Modal>
        <Offcanvas
        show={showOffRes}
        placement={'end'}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Editar respuesta</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form className="form">
                            <Form.Group
                            className="mb-3"
                            controlId="EditRespuesta"
                            >
                            <Form.Label><h1>{preguntasList[numeroPregunta]?.pregunta}</h1></Form.Label>
                            <br/>
                            <Form.Label>Respuesta Elegida: {respuestasEdit[numeroPregunta]?.value}</Form.Label>
                            {(preguntasList[numeroPregunta]?.tipo === "Opción múltiple") ?
                            <div>{
                                formattedAnswers[numeroPregunta].opciones.map((Respuesta) => (
                                    <Button
                                    className='btnEditarRespuesta'
                                    variant='success'
                                    key={Respuesta.respuesta} 
                                    onClick = {(e) => {
                                        handleEditRespuesta(Respuesta.respuesta, e)}}>
                                        {Respuesta.respuesta}
                                    </Button>
                                ))
                            }</div>:
                            <div>
                                <Form.Control
                                as="textarea" 
                                rows={4}
                                value={respuestaEdit}
                                onChange={(e) => {
                                    setRespuestaEdit(e.target.value)
                                    handleEditAnswerAbierta(e.target.value)
                                }}>
                                    {respuestas[numeroPregunta]?.value}
                                </Form.Control>
                            </div>}
                            <Form.Label>Comentario</Form.Label>
                            <Form.Control 
                            as="textarea" 
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}>
                                {comment}
                            </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button 
                        variant="danger" 
                        className='btnBorrarP'
                        onClick={() => {
                            setShowOffRes(false)
                            setDescripcion('')
                        }}>
                            Cerrar
                        </Button>
                        <Button 
                        variant="success"
                        className='btnEditarP'
                        onClick={(e) => {handleEditRespuesta(respuestaEdit, e)}}>
                            Guardar cambios
                        </Button>
                    </Offcanvas.Body>
        </Offcanvas>
      </main>
    );

    return(
        <main className='cuestionario'>
            <Offcanvas 
            show={showOffHito} 
            placement={'bottom'} 
            onHide={() => setShowOffHito(false)}>
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
                            <Form.Control 
                            as="textarea" 
                            rows={1} 
                            onChange={(e) => setDescripcion(e.target.value)}>
                                {descripcion}
                            </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button size='sm' variant="danger" onClick={() => {setShowOffHito(false)
                            setDescripcion('')}}>
                            Cerrar
                        </Button>
                        <Button size='sm' variant="success" onClick={handleSubmitHito}>
                            Guardar
                        </Button>
                    </Offcanvas.Body>
                </Offcanvas>
            <div className='left-side'>
                <div className='numero-pregunta'>
                    <span>Pregunta {preguntaActual + 1} de {preguntasList.length}</span>
                </div>
                <div className='titulo-pregunta'>
                    {preguntasList[preguntaActual]?.pregunta}
                </div>
                <div >
                    Comentarios
                    <textarea
                    className='input-comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}/>
                </div>
                <div>
                    {isDone? 
                    <button className='button-previous'
                    onClick = {() => WrapItUp()}>
                        Enviar
                    </button>
                    : 
                    <div>
                    </div>}
                </div>
            </div>
                <div className='numero-pregunta'>
                    <Button 
                    className='buttonh' 
                    onClick={() => setShowOffHito(true)}>
                        Hito<AiTwotoneStar/>
                    </Button>
                    <span>{preguntasList[preguntaActual]?.tipo}</span>
                </div>
                {(preguntasList[preguntaActual]?.tipo === "Opción múltiple") ?
                <div className='right-side'>{
                    formattedAnswers[preguntaActual].opciones.map((Respuesta) => (
                        <button 
                        className='buttonq' 
                        key={Respuesta.respuesta} 
                        onClick = {(e) => handleAnswerSubmit(Respuesta.respuesta, e)}>
                            {Respuesta.respuesta}
                        </button>
                    ))
                }</div>:
                <div className='open-question'>
                    <textarea
                    onChange={(e) => setRespuestaEdit(e.target.value)}>
                    </textarea> 
                <Button 
                className='buttonq'
                onClick = {(e) => {
                    handleAnswerSubmit(respuestaEdit, e)
                    handleAnswerAbierta(respuestaEdit, e)
                }}
                >Siguiente</Button>
                </div>}
        </main>
    )
}

export default Respuesta;