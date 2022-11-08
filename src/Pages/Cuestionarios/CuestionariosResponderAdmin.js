import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom'
import { Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import {  AiOutlineEdit, AiOutlineSend, AiOutlineFilePdf, AiTwotoneStar } from 'react-icons/ai';
import "./cuestionarios.css";
import axios from 'axios'
const GET_QUESTIONNAIRE_INFO_URL = '/questionnaires/getquestionnaireinfo'
const SUBMIT_QUESTIONNAIRE_URL = '/questionnaires/submitquestionnaire'
const EDIT_QUESTIONNAIRE_URL = '/questionnaires/editsubmittedquestionnaire'
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
    const [respuestaAbierta, setRespuestaAbierta] = useState([]);
    const [puntaje, setPuntaje] = useState([]);
    const [puntajeEdit, setPuntajeEdit] = useState([]);
    const [respuestaEdit, setRespuestaEdit] = useState();
    const [descripcion, setDescripcion] = useState("");
    const [comment, setComment] = useState("");
    const [tiempoRegistro, setTiempoRegistro] = useState();
    const [timestamp, setTimestamp] = useState();
    const [llaveCambio, setLlaveCambio] = useState(0);
    const [msg, setMsg] = useState("");
    const [variante, setVariante] = useState('');
    const [numeroPregunta, setNumeroPregunta] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [resultadoPuntaje, setResultadoPuntaje] = useState(0);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(0);
    const [showButtonEdit, setShowButtonEdit] = useState(false);
    const [showOffHito, setShowOffHito] = useState(false);
    const [showOffRes, setShowOffRes] = useState(false);
    const [showMEdit, setShowMEdit] = useState(false);
    const [showA, setShowA] = useState(false);
    const [isSelectedQuestionnaire, setIsSelectedQuestionnaire] = useState(true);
    const [isDone, setIsDone] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const {idAlumno} = useParams();

    useEffect (() => {
        getCuestionarios()
    }, [])

    useEffect (() => {
       getQuestionnaireInfo()
    }, [selectedQuestionnaire])

    const getQuestionnaireInfo = () => {
        axios.get(GET_QUESTIONNAIRE_INFO_URL+"/"+selectedQuestionnaire).then((response) => {
            setPreguntasList(response.data)
        })
    }

    const getCuestionarios = () => {
        axios.get(GET_CUESTIONARIOS_URL).then((response) => {
            setCuestionariosList(response.data)
        })
    }

    const formatQuestions = () => {
        const opc = preguntasList.map((lis) => JSON.parse(JSON.parse(JSON.stringify(lis.opciones))));
        setFormattedAnswers(opc)
        setIsStart(false)
        console.log(preguntasList)
    }

    const handleSelectedQuestionnaire = (idcuestionario) => {
        setSelectedQuestionnaire(idcuestionario)
        setIsSelectedQuestionnaire(false)
        setIsStart(true)
    }

    const handleUploadCuestionario = async (resultadoPuntaje, respuestas) => {
        console.log("resultadoPuntaje"+resultadoPuntaje)
        try{
            const response = await axios.post(SUBMIT_QUESTIONNAIRE_URL, {
                ida: idAlumno,
                idc: selectedQuestionnaire,
                respuestas: JSON.stringify(respuestas),
                comentarios: JSON.stringify(comentarios),
                puntaje: resultadoPuntaje
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg("Las respuestas han sido registradas correctamente")
                console.log(response.data)
                setTiempoRegistro(response.data.message)
                setTimestamp(response.data.message)
                conversionHorario(response.data.message)
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
        calcularPuntajeEdit()
        try{
            const response = await axios.post(EDIT_QUESTIONNAIRE_URL, {
                ida: idAlumno,
                idc: selectedQuestionnaire,
                timestamp: tiempoRegistro,
                respuestas: JSON.stringify(respuestasEdit),
                comentarios: JSON.stringify(comentariosEdit),
                puntaje: resultadoPuntaje
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
                setShowButtonEdit(false)
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

    const conversionHorario = (fecha) => {
        let newtimestamp = 0;
        newtimestamp = new Date(fecha);
        newtimestamp.setHours(newtimestamp.getHours()-6);//cambiar a 4 o 5 o 6 dependiendo del horario
        newtimestamp = newtimestamp.toISOString();
        setTimestamp(newtimestamp)
    }

    const calcularPuntaje = () => {
        console.log("calculando puntaje")
        console.log(puntaje)
        let result = null
        for(let i = 0; i < puntaje.length; i++){
            if(!isNaN(puntaje[i].puntaje)){
                result += puntaje[i].puntaje
                console.log(result)
            }
        }
        setResultadoPuntaje(result)
    }

    const calcularPuntajeEdit = () => {
        console.log("modificando puntaje")
        console.log(puntajeEdit)
        let result = null
        for(let i = 0; i < puntajeEdit.length; i++){
            if(!isNaN(puntajeEdit[i].puntaje)){
                result += puntajeEdit[i].puntaje
                console.log(result)
            }
        }
        setResultadoPuntaje(result)
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
        const newPuntaje =
        {
            puntaje: answer
        }
        setPuntaje([...puntaje, newPuntaje])
        setPuntajeEdit([...puntajeEdit, newPuntaje])
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
            const newPuntaje =
            {
                puntaje: answer
            }
            setPuntaje([...puntaje, newPuntaje])
            setPuntajeEdit([...puntajeEdit, newPuntaje])
            const newQA = 
            {
                id: preguntasList[preguntaActual].idPregunta,
                numpregunta: preguntaActual,
                pregunta: preguntasList[preguntaActual].pregunta,
                respuesta: answer,
                comentario: comment
            }
            setEdicionList([...edicionList, newQA])
            calcularPuntaje()
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
        const editPuntaje =
        {
            puntaje: answer
        }
        puntajeEdit[numeroPregunta] = editPuntaje;
        const editedQA = 
        {
            id: edicionList[numeroPregunta].id,
            numpregunta: edicionList[numeroPregunta].numpregunta,
            pregunta: edicionList[numeroPregunta].pregunta,
            respuesta: answer,
            comentario: comment
        }
        edicionList[numeroPregunta] = editedQA;
        calcularPuntajeEdit()
        setComment("");
        setRespuestaEdit("");
        setLlaveCambio(0);
        setShowOffRes(false)
        setShowMEdit(true)
        setShowButtonEdit(true)
    }

    const WrapItUp = () => {
        setIsFinished(true)
        setComment("")
        console.log("resultadoPuntaje"+resultadoPuntaje)
        handleUploadCuestionario(resultadoPuntaje, respuestas)
    }

    const renderTooltipSelect = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Selecciona para cambiar la respuesta
        </Tooltip>
    );

    const renderTooltipDisabled = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            La pregunta es de opción múltiple, para guardar los cambios selecciona una de las opciones
        </Tooltip>
    );

    if(isSelectedQuestionnaire)
    return (
        <div>
            {cuestionariosList.map(values => (
                <div key={values.idCuestionario}>
                    <Card 
                    className="text-center"
                    border = "warning"
                    style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Header>Cuestionario #{values.idCuestionario}</Card.Header>
                            <Card.Title><h1>{values.nombre}</h1></Card.Title>
                                <Button
                                className='buttonh'
                                onClick = {() => handleSelectedQuestionnaire(values.idCuestionario)}>
                                    Contestar cuestionario
                                    <AiOutlineEdit/>
                                </Button>
                        </Card.Body>
                        <Card.Footer>
                            Materia: {values.materia}
                        </Card.Footer>
                    </Card>
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
        <div className="fin">
            <Alert 
            show={showA}
            variant={variante}
            onClose={() => setShowA(false)}
            className="alerta"
            dismissible>
            <Alert.Heading>
                {msg}
            </Alert.Heading>
            </Alert>
            {console.log(resultadoPuntaje)}
            {isNaN(resultadoPuntaje) || resultadoPuntaje === null?
            <div/>
            :
            <span>
            El alumno obtuvo un puntaje de {resultadoPuntaje}
            </span>}
            <span>
            Has concluido con el cuestionario {preguntasList[0]?.nombre}
            </span>
          <Button 
          className='buttonq' 
          onClick={() => {setShowMEdit(true)}}>
            Editar Respuestas
          </Button>
          <Link to={`/ReportesNuevoRegistroAdmin/${timestamp}`}>
                <Button
                className='btnCrear'>
                    Generar reporte
                    <AiOutlineFilePdf/>
                </Button>
          </Link>
          <Link to={'/Alumnos'}>
            <Button 
            size='lg' 
            className="buttonq" >
                Regresar a página de alumnos
            </Button>
          </Link>
        </div>
        {/*MODAL EDITAR RESPUESTAS */}
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
                {showButtonEdit === true?
                <div>
                    <Button
                    className='btnEditarRespuesta'
                    size='lg'
                    onClick={() => {
                        handleSubmitEdicion()
                        setShowMEdit(false)}}>
                        Guardar registros
                        <AiOutlineSend/>
                    </Button>
                </div>:
                <div>
                </div>}
            </ModalBody>
        </Modal>
        {/*OFFCANVAS EDITAR RESPUESTAS */}
        <Offcanvas
        show={showOffRes}
        onHide={() => setShowOffRes(false)}
        placement={'end'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title><h4>Editar Pregunta {numeroPregunta+1}</h4></Offcanvas.Title>
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
                        <div>
                            {
                            formattedAnswers[numeroPregunta].opciones.map((Respuesta) => (
                                <OverlayTrigger
                                placement='left'
                                overlay={renderTooltipSelect}>
                                    <Button
                                    className='btnEditarRespuesta'
                                    variant='success'
                                    key={Respuesta.respuesta} 
                                    onClick = {(e) => {
                                        handleEditRespuesta(Respuesta.respuesta, e)}}>
                                        {Respuesta.respuesta}
                                    </Button>
                                </OverlayTrigger>
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
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}/>
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
                        {preguntasList[numeroPregunta]?.tipo === "Opción múltiple"?
                        <OverlayTrigger
                        placement='bottom'
                        overlay={renderTooltipDisabled}>
                            <Button 
                            variant="success"
                            className='btnEditarP'
                            onClick={renderTooltipDisabled}>
                                Guardar cambios
                            </Button>
                        </OverlayTrigger>
                        :
                        <Button 
                        variant="success"
                        className='btnEditarP'
                        onClick={(e) => {handleEditRespuesta(respuestaEdit, e)}}>
                            Guardar cambios
                        </Button>}
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
                        <Button 
                        size='sm' 
                        variant="danger" 
                        onClick={() => {setShowOffHito(false)
                            setDescripcion('')}}>
                            Cerrar
                        </Button>
                        <Button 
                        size='sm' 
                        variant="success" 
                        onClick={handleSubmitHito}>
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
                    {isDone && 
                    <button className='button-previous'
                    onClick = {() => WrapItUp()}>
                        Enviar
                    </button>}
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
                    className='input-answer'
                    placeholder='Escribe la respuesta del alumno'
                    scrollable='true'
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