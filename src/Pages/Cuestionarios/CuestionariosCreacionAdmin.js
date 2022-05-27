import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Accordion, AccordionCollapse, Alert, Button, ButtonGroup, DropdownButton, Dropdown, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Table } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineSelect } from 'react-icons/ai';
import axios from '../../axios/axios'
import "./cuestionarios.css"
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const UPLOAD_NEW_QUESTIONNAIRE_URL = '/questionnaires/uploadnewquestionnaire'
const ESTABLISH_KEYS_URL = '/questionnaires/establishnewkeys'

function CrearCuestionario() {

    const [nombrec, setNombreC] = useState("");
    const [materiac, setMateriaC] = useState("");
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [maxIdPregunta, setMaxIdPregunta] = useState(1);
    const [maxIdRespuesta, setMaxIdRespuesta] = useState(1);
    const [idPregunta, setIdPregunta] = useState(0);
    const [idRespuesta, setIdRespuesta] = useState(0);
    const [pregunta, setPregunta] = useState("");
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState();
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [respuesta, setRespuesta] = useState([{ "respuesta": "" }]);
    const [respuestaFormatted, setRespuestaFormatted] = useState("{\"opciones\":[{\"respuesta\":\"\"}]}");
    const [newCuestionario, setNewCuestionario] = useState(false);
    const [tipoPregunta, setTipoPregunta] = useState("");
    const [showA, setShowA] = useState(false);
    const [showModalP, setShowModalP] = useState(false)
    const [showModalR, setShowModalR] = useState(false)
    const [showModalO, setShowModalO] = useState(false)
    const [preguntaRespuesta, setPreguntaRespuesta] = useState([]);

    useEffect (() => {
        getQuestionnaires()
        getPreguntas()
        getRespuestas()
    }, [])

    useEffect (() => {
        console.log(preguntaRespuesta)
        console.log("respuesta"+respuesta)
    }, [preguntaRespuesta])

    useEffect (() => {
        getQuestionnaireDetails()
    }, [selectedQuestionnaire])

    const getQuestionnaires = () => {
        axios.get(GET_CUESTIONARIOS_URL).then((response) => {
            setCuestionariosList(response.data)
        })
    }

    const getQuestionnaireDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+selectedQuestionnaire).then((response) => {
            console.log("length"+response.data.length)
            for(let i = 0; i<response.data.length; i++){
                response.data[i].opciones = JSON.parse(response.data[i].opciones)
                console.log(response.data[i].opciones)
            }
            setCuestionariosInfo(response.data)
        })
    }

    const getPreguntas = () => {
        axios.get(GET_PREGUNTAS_URL).then((response) => {
            setPreguntasList(response.data)
        })
    }

    const getRespuestas = () => {
        axios.get(GET_RESPUESTAS_URL).then((response) => {
            setRespuestasList(response.data)
        })
    }

    const handleUploadNewCuestionario = async () => {
        try{
            const response = await axios.post(UPLOAD_NEW_QUESTIONNAIRE_URL, {
                idc: cuestionariosList.length+1,
                nombrec: nombrec,
                materia: materiac,
                qa: preguntaRespuesta
            })
            if(response.status === 200){
                console.log(response)
                setShowA(true)
                setVariante('success')
                setMsg("Se ha creado un nuevo cuestionario")
            }
            console.log(response)
        }catch(error){
            if(!error?.response){
                setShowA(true)
                setVariante('danger')
                setMsg('No hay respuesta del servidor');
              } else if(error.response?.status === 400){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
              } else if(error.response?.status === 401){
                setShowA(true)
                setVariante('danger')
                setMsg('Usuario sin autorización');
              } else if(error.response?.status === 403){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
              }
        }
        establishKey()
    }

    const establishKey = async () => {
        try{
            const respose = await axios.post(ESTABLISH_KEYS_URL, {
                idc: cuestionariosList.length+1,
                qa: preguntaRespuesta
            })
            if(respose.status === 200){
                console.log(respose)
                setShowA(true)
                setVariante('success')
                setMsg(respose.data.message)
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
              }
        }
       
    }

    const newPreguntaRespuesta = () => {
        if(!pregunta){
            setShowA(true)
            setVariante('danger')
            setMsg("No puedes registrar una pregunta vacía")
            return
        }
        if(!tipoPregunta){
            setShowA(true)
            setVariante('danger')
            setMsg("No puedes registrar una pregunta sin su tipo")
            return
        }
        if(idRespuesta === 0 && idPregunta === 0){
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta: (respuestasList.length)+maxIdRespuesta}])
            setMaxIdRespuesta(maxIdRespuesta+1)
            setMaxIdPregunta(maxIdPregunta+1)
        }
        else if(idRespuesta === 0){
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: idPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta:(respuestasList.length)+maxIdRespuesta}])
            setMaxIdRespuesta(maxIdRespuesta+1)
        }
        else if(idPregunta === 0 && idRespuesta !== 0){
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: JSON.stringify(respuesta), idRespuesta: idRespuesta}])
            setMaxIdPregunta(maxIdPregunta+1)
        }
        else if(idPregunta === 0){
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta: idRespuesta}])
            setMaxIdPregunta(maxIdPregunta+1)
        }
        else{
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: idPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: JSON.stringify(respuesta), idRespuesta: idRespuesta}])
        }
        //handleUploadNewCuestionario()
        setPregunta("")
        setRespuesta([{ respuesta: "" }])
        setRespuestaFormatted("")
        setTipoPregunta("")
        setIdPregunta(0)
        setIdRespuesta(0)
    }

    const handleDisplayInfoCuestionario = (idcuestionario) => {
        setSelectedQuestionnaire(idcuestionario)
    }

    const handleSelectPregunta = (values) =>{
        console.log(values)
        setPregunta(values.pregunta)
        setIdPregunta(values.idPregunta)
    }

    const handleSelectRespuesta = (values) =>{
        console.log(values)
        //setRespuesta(values.opciones)
        setRespuesta(JSON.parse(JSON.parse(JSON.stringify(values.opciones))))
        setIdRespuesta(values.id)
    }

    const handleAddRespuesta = () => {
        setRespuesta([...respuesta, { respuesta: "" }])
    }

    const handleRemoveRespuesta = (index) => {
        const opciones = [...respuesta];
        opciones.splice(index, 1);
        setRespuesta(opciones)
    }

    const handleChangeRespuesta = (e, index) => {
        const { name, value } = e.target;
        const list = [...respuesta];
        if(!isNaN(value)){
            const ivalue = parseInt(value);
            list[index][name] = ivalue;
            setRespuesta(list)
        }
        else{
            list[index][name] = value;
            setRespuesta(list);
        }
    };

    const formatRespuesta = () => {
        const rep = "{\"opciones\":"+JSON.stringify(respuesta)+"}";
        setRespuestaFormatted(rep);
        setShowModalO(false);
    }

    if(newCuestionario)
    return(
        <main className="crearCuestionario">
            <div className="inputPreguntas">
            Nombre del Cuestionario
                <input
                className="inputFields"
                maxLength="150"
                placeholder="Ingresa el nombre del cuestionario"
                value={nombrec}
                onChange={(e) => setNombreC(e.target.value)}/>
            <br/>
            Materia
                <input
                className="inputFields"
                maxLength="150"
                placeholder="Ingresa el nombre del cuestionario"
                value={materiac}
                onChange={(e) => setMateriaC(e.target.value)}/>
            <br/>
            Tipo de pregunta<h3>{tipoPregunta}</h3>
            
            <ButtonGroup>
                <Button className="btnBancoPreguntas" value="Opción múltiple" onClick={(e) => setTipoPregunta(e.target.value)}>Opción múltiple</Button>
                <Button className="btnBancoPreguntas" value="Abierta" onClick={(e) => setTipoPregunta(e.target.value)}>Abierta</Button>
            </ButtonGroup>
            Pregunta nueva
            <br/>
                <textarea
                className='inputNewQuestion'
                maxLength="250"
                value={pregunta}
                onChange={(e) => {
                    setPregunta(e.target.value)
                }}/>
            <Button
            className="btnBancoPreguntas"
            size="sm"
            onClick={() => {
                getPreguntas()
                setShowModalP(true)
                }}>
                    Banco de preguntas
            </Button>
                <Modal 
                show={showModalP}
                size="sm"
                scrollable
                onHide={() => setShowModalP(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>
                            Elige una pregunta de las siguientes opciones:
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {preguntasList.map(values => (
                            <div key={values.idPregunta}>
                            <ListGroup>
                                <ListGroupItem>
                                    {values.idPregunta}. {values.pregunta}
                                    <br/>
                                    <Button 
                                    variant="success"
                                    onClick={() => handleSelectPregunta(values)}>
                                        <AiOutlineSelect/>
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                        }
                    </ModalBody>
                </Modal>
            <br/>
            Respuestas
            <br/>
                <textarea
                className='input-new-question'
                disabled
                value={JSON.stringify(respuesta)}
                onChange={(e) => setRespuesta(e.target.value)}/>
                <div>
            {(idRespuesta !== 0) ?
                <div>
                    {console.log("Respuesta:"+respuesta.opciones)}
                    {respuesta.opciones.map(values => (
                        <div key={values}>
                            <ListGroup>
                                <ListGroupItem>
                                    {(values.respuesta)}
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    ))
                    }
                </div>:
                <div>
                    {respuesta.map(values => (
                        <div key={values}>
                            <ListGroup>
                                <ListGroupItem>
                                    {(values.respuesta)}
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    ))
                    }
                </div>
                }
            </div>
            <br/>
            <Button
            className="btnBancoPreguntas"
            size="sm"
            onClick={() => {
                getRespuestas()
                setShowModalR(true)
            }}>
                Banco de respuestas
            </Button>
                <Modal 
                    show={showModalR}
                    size="sm"
                    scrollable
                    onHide={() => setShowModalR(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>
                            Elige un set de respuestas de las siguientes opciones:
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {respuestasList.map(values => (
                            <div key={values.id}>
                                <ListGroup>
                                    <ListGroupItem>
                                        {values.id}. 
                                        <ListGroup>
                                            <ListGroupItem>
                                            {values.opciones}
                                            </ListGroupItem>
                                        </ListGroup>
                                        <br/>
                                        <Button 
                                        variant="success"
                                        onClick={() => handleSelectRespuesta(values)}>
                                            <AiOutlineSelect/>
                                        </Button>
                                    </ListGroupItem>
                                </ListGroup>
                                </div>
                            ))
                            }
                        </ModalBody>
                    </Modal>
            {(tipoPregunta === "Opción múltiple") ? 
            <div>
            <Button
            className="btnRegistroRespuestas"
            onClick={() => {setShowModalO(true)}}>
                Registrar Opciones
            </Button>
            <br/>
            <br/>
            <Modal
            show={showModalO}
            scrollable
            onHide={() => setShowModalO(false)}>
                <ModalHeader>
                    <ModalTitle>
                        Elige una pregunta de las siguientes opciones:
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {respuesta.map((opcion, index) => (
                        <div key={index} className="services">
                            {console.log(opcion.opciones)}
                            <div className="first-division">
                            <input
                                name="respuesta"
                                type="text"
                                id="opcion"
                                value={opcion.opciones}
                                onChange={(e) => handleChangeRespuesta(e, index)}
                            />
                            {respuesta.length-1 === index && 
                            (<Button 
                            size="sm"
                            className="add-btn"
                            variant="success"
                            onClick={handleAddRespuesta}>
                                <span>Nueva opción</span>
                            </Button>)
                            }
                            <br/>
                            {respuesta.length-1 === index && 
                            (<Button 
                            size="sm"
                            className="add-btn"
                            variant="success"
                            onClick={() => {formatRespuesta(idRespuesta)}}>
                                <span>Guardar registros</span>
                            </Button>)
                            }
                            </div>
                            <div className="second-division">
                                {respuesta.length > 1 && 
                                (<Button 
                                size="sm"
                                className="remove-btn"
                                variant="danger"
                                onClick={() => handleRemoveRespuesta(index)}
                                >
                                    <span>Borrar</span>
                                </Button>)}
                            </div>
                        </div>
                    ))}
                </ModalBody>
            </Modal>
            </div>: <br></br>
            }
        <Button 
        className="btnGuardar"
        onClick={newPreguntaRespuesta}>
            Guardar
        </Button>
        <br/>
        </div>
        <div className="outputPreguntas">
                <Alert 
                    show={showA}
                    variant={variante}
                    onClose={() => setShowA(false)}
                    dismissible
                    transition>
                    <Alert.Heading>
                        {msg}
                    </Alert.Heading>
                </Alert>
                <Table>
                    <thead>
                        <tr>
                            {/* <th>Id Pregunta</th> */}
                            <th>Tipo de pregunta</th>
                            <th>Pregunta</th>
                            {/* <th>Id Respuesta</th> */}
                            <th>Respuesta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preguntaRespuesta.map((pr, index) => (
                            <tr key={index}>
                                {/* <td>{pr.idPregunta}</td> */}
                                <td>{pr.tipop}</td>
                                <td>{pr.pregunta}</td>
                                {/* <td>{pr.idRespuesta}</td> */}
                                <td>{JSON.parse(JSON.stringify(pr.respuesta))}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button 
                className="btnGuardar"
                onClick={handleUploadNewCuestionario}>
                    Subir Cuestionario
                </Button>
            </div>
    </main>
    );

    return(
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
                                        onClick={() => {handleDisplayInfoCuestionario(values.idCuestionario)}}>
                                            Desplegar información
                                            <AiOutlineInfoCircle/>
                                        </Button>
                                        <Link to={`/CuestionariosEdicionAdmin/${values.idCuestionario}`}>
                                            <Button className="btnBancoPreguntas" >
                                                Modificar
                                                <AiOutlineEdit/>
                                            </Button>
                                        </Link>
                                        <br/>
                                        {cuestionariosInfo.map(values => (
                                            <div>
                                                <h1>{values.pregunta}</h1>
                                                <h6>{values.tipo}</h6>
                                                <h6>{JSON.stringify(values.opciones)}</h6>
                                            </div>
                                        ))}
                                    </AccordionBody>
                                </AccordionItem>
                        </Accordion>
                </div>  
            ))}
            <br/>
            <Button
            className="btnEditarRespuesta"
            onClick={() => setNewCuestionario(true)}>
                Crear cuestionario
                <AiOutlinePlus/>
            </Button>
        </div>
    )
}

export default CrearCuestionario