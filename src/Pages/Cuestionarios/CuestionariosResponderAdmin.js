import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Accordion, Alert, Button, Form, Offcanvas } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import { AiTwotoneStar } from 'react-icons/ai';
import "./cuestionarios.css";
import axios from '../../axios/axios'
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const UPLOAD_QUESTIONNAIRES_URL = '/questionnaires/uploadquestionnaire'
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'
const GET_RECENTLY_QUESTIONNAIRE_URL = ''
const INGRESA_HITO_URL = '/profiles/newhito';

function Respuesta () {

    const [preguntasList, setPreguntasList] = useState([])
    const [descripcion, setDescripcion] = useState("");
    const [showO, setShowO] = useState(false);
    const [showA, setShowA] = useState(false);
    const [msg, setMsg] = useState("");
    const [variante, setVariante] = useState('');
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [puntaje, setPuntaje] = useState(0);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(0);
    const [isSelectedQuestionnaire, setIsSelectedQuestionnaire] = useState(true);
    const [isDone, setIsDone] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [comment, setComment] = useState("");
    const [respuestas, setRespuestas] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const {idAlumno} = useParams();

    useEffect (() => {
        getCuestionarios()
    }, [])

    useEffect (() => {
       getQuestionnairesDetails()
    }, [selectedQuestionnaire])

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

    const formatQuestions = () => {
        const opc = preguntasList.map((lis) => JSON.parse(JSON.parse(JSON.stringify(lis.opciones))));
        setAnswers(opc)
        setIsStart(false)
        console.log(preguntasList)
    }

    const handleSelectedQuestionnaire = (idcuestionario) => {
        console.log("cuestionario elegido "+idcuestionario)
        setSelectedQuestionnaire(idcuestionario)
        setIsSelectedQuestionnaire(false)
        setIsStart(true)
    }

    const handleRespuestasArray = (answer, preguntaActual) => {
        const newAnswer = 
        {
            id: preguntasList[preguntaActual].idPregunta,
            value: answer
        }
        setRespuestas([...respuestas, newAnswer])
        const newComment = 
        {
            comment: comment
        }
        setComentarios([...comentarios, newComment])
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

    const handleSubmitHito = async (e) => {
        e.preventDefault()
        setShowO(false)
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

    function handleAnswerSubmit(answer, e){
        if(answer === "NR"){
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
            const newComment = 
            {
                comment: comment
            }
            setComentarios([...comentarios, newComment])
            setIsDone(true)
        }
        else{
            handleRespuestasArray(answer, preguntaActual)
            setPreguntaActual(preguntaActual + 1)
            setComment("")
        }
    }

    const WrapItUp = () => {
        setIsFinished(true)
        handleUploadCuestionario(respuestas)
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
            Bienvenido al cuestinario {preguntasList[0]?.idCuestionario}
            </span>
            <h2>{preguntasList[0]?.nombre}</h2>
          <button className='buttonq' onClick={() => formatQuestions()}>
            Comenzar
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
            Has concluido con el cuestionario ¡Felicidades!
            <span>
            El alumno obtuvo un puntaje de {puntaje} de 15
            </span>
          <button className='buttonq' onClick={() => (window.location.href = "/CuestionariosResponderAdmin")}>
            Volver a tomar cuestionario
          </button>
        </div>
      </main>
    );

    return(
        <main className='cuestionario'>
            <Offcanvas show={showO} placement={'bottom'} onHide={() => setShowO(false)}>
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
                            <Form.Control as="textarea" rows={1} onChange={(e) => setDescripcion(e.target.value)}>
                                {descripcion}
                            </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button size='sm' variant="danger" onClick={() => {setShowO(false)
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
                    <button className='button-previous'>
                        Regresar
                    </button>}
                </div>
            </div>
                <div className='numero-pregunta'>
                    <Button className='buttonh' onClick={() => setShowO(true)}>
                        Hito<AiTwotoneStar/>
                    </Button>
                    <span>{preguntasList[preguntaActual]?.tipo}</span>
                </div>
                {(preguntasList[preguntaActual]?.tipo === "Opción múltiple") ?
                <div className='right-side'>{
                    answers[preguntaActual].opciones.map((Respuesta) => (
                        <button className='buttonq' key={Respuesta.respuesta} 
                        onClick = {(e) => handleAnswerSubmit(Respuesta.respuesta, e)}>
                            {Respuesta.respuesta}
                        </button>
                    ))
                }</div>: <textarea></textarea>}
        </main>
    )
}

export default Respuesta;