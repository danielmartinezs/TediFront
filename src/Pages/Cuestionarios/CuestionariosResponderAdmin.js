import { useState, useEffect } from 'react';
import "./cuestionarios.css";
import axios from '../../axios/axios'
const GET_QUESTIONNAIRES_URL = '/questionnaires/getquestionnaires'
const UPLOAD_QUESTIONNAIRES_URL = '/questionnaires/uploadquestionnaire'

function Respuesta () {

    const [preguntasList, setPreguntasList] = useState([])
    const [msg, setMsg] = useState("");
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [puntaje, setPuntaje] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isStart, setIsStart] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [comment, setComment] = useState("");
    const [respuestas, setRespuestas] = useState([]);
    const [legitrespuesta, setLegitRespuestas] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [cuestionario, setCuestionario] = useState([]);

    useEffect (() => {
        getQuestionnaires()
    }, [])

    useEffect (() => {
       //setLegitRespuestas(respuestas)
       console.log(preguntaActual)
       console.log(preguntasList[preguntaActual])
    }, [preguntaActual])

    const getQuestionnaires = () => {
        axios.get(GET_QUESTIONNAIRES_URL).then((response) => {
            setPreguntasList(response.data)
        })
    }

    const formatQuestions = () => {
        //console.log(preguntasList)
        const opc = preguntasList.map((lis) => JSON.parse(JSON.parse(JSON.stringify(lis.opciones))));
        setAnswers(opc)
        setIsStart(false)
        console.log(preguntasList)
    }

    const handleRespuestasArray = (answer, preguntaActual) => {
        const newAnswer = 
        {
            id: preguntasList[preguntaActual].idPregunta,
            value: answer,
            comment: comment
        }
        setRespuestas([...respuestas, newAnswer])
    }

    const handleUploadCuestionario = async (respuestas) => {
        try{
            const response = await axios.post(UPLOAD_QUESTIONNAIRES_URL, {
                idc: preguntasList[preguntaActual]?.idCuestionario,
                respuestas: respuestas 
            })
            console.log(response)
        }catch(error){
            if(!error?.response){
                setMsg('No hay respuesta del servidor');
              } else if(error.response?.status === 400){
                setMsg(error.response.data.message);
              } else if(error.response?.status === 401){
                setMsg('Usuario sin autorización');
              } else if(error.response?.status === 403){
                setMsg(error.response.data.message);
              }
        }
    }

    const WrapItUp = () => {
        setIsFinished(true)
        handleUploadCuestionario(respuestas)
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
                value: answer,
                comment: comment
            }
            setRespuestas([...respuestas, newAnswer])
            setIsDone(true)
        }
        else{
            handleRespuestasArray(answer, preguntaActual)
            setPreguntaActual(preguntaActual + 1)
            setComment("")
        }
    }

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
                    onClick = {(e) => WrapItUp()}>
                        Enviar
                    </button>
                    : 
                    <button className='button-previous'>
                        Regresar
                    </button>}
                </div>
            </div>
                <div className='numero-pregunta'>
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