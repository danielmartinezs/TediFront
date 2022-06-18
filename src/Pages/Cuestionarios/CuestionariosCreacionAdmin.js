import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Alert, Button, ButtonGroup, Form, FormControl, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineEye, AiOutlineInfoCircle, AiOutlineDelete, AiOutlinePlus, AiOutlineQuestionCircle, AiOutlineSelect, AiOutlineSend, AiOutlineVerticalAlignBottom, AiOutlineVerticalAlignTop } from 'react-icons/ai';
import { BiMessageAltAdd } from 'react-icons/bi'
import SlidingPane from 'react-sliding-pane';
import axios from '../../axios/axios'
import "./cuestionarios.css"
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const UPLOAD_NEW_QUESTIONNAIRE_URL = '/questionnaires/uploadnewquestionnaire'
const ESTABLISH_KEYS_URL = '/questionnaires/establishnewkeys'

function CrearCuestionario() {

    const [nombrec, setNombreC] = useState("");
    const [materiac, setMateriaC] = useState("");
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const [preguntasList, setPreguntasList] = useState([]);
    const [newPreguntasList, setNewPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [newRespuestasList, setNewRespuestasList] = useState([]);
    const [preguntaRespuesta, setPreguntaRespuesta] = useState([]);
    const [maxIdPregunta, setMaxIdPregunta] = useState(1);
    const [maxIdRespuesta, setMaxIdRespuesta] = useState(1);
    const [idPregunta, setIdPregunta] = useState(0);
    const [idRespuesta, setIdRespuesta] = useState(0);
    const [idEditar, setIdEditar] = useState(0);
    const [cambioRespuesta, setCambioRespuesta] = useState(0);
    const [pregunta, setPregunta] = useState("");
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [respuesta, setRespuesta] = useState([{ "respuesta": "" }]);
    const [respuestaFormatted, setRespuestaFormatted] = useState("{\"opciones\":[{\"respuesta\":\"\"}]}");
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [respuestaEdit, setRespuestaEdit] = useState();
    const [respuestaEditAdd, setRespuestaEditAdd] = useState();
    const [respuestaBank, setRespuestaBank] = useState([]);
    const [recentlyRemovedRes, setRecentlyRemovedRes] = useState();
    const [tipoPregunta, setTipoPregunta] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showADelResp, setShowADelResp] = useState(false);
    const [showButtonSave, setShowButtonSave] = useState(false);
    const [showButtonUndo, setShowButtonUndo] = useState(false);
    const [showModalP, setShowModalP] = useState(false)
    const [showModalR, setShowModalR] = useState(false)
    const [showModalO, setShowModalO] = useState(false)
    const [showModalE, setShowModalE] = useState(false)
    const [showAddR, setShowAddR] = useState(false);
    const [showOffEditP, setShowOffEditP] = useState(false);
    const [showOffEditR, setShowOffEditR] = useState(false);
    const [showOffEditO, setShowOffEditO] = useState(false);
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});

    useEffect (() => {
        getQuestionnaires()
        getPreguntas()
        getRespuestas()
    }, [])

    useEffect (() => {
        console.log(preguntaRespuesta)
        console.log("respuesta"+respuesta)
    }, [preguntaRespuesta])


    const getQuestionnaires = () => {
        axios.get(GET_CUESTIONARIOS_URL).then((response) => {
            setCuestionariosList(response.data)
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

    const scrollToTop = () => {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
    };

    const handleUploadNewCuestionario = async () => {
        scrollToTop()
        setDetailsPane({isPaneOpen: false})
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
                establishKeys()
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
    }

    const establishKeys = async () => {
        try{
            const response = await axios.post(ESTABLISH_KEYS_URL, {
                idc: cuestionariosList.length+1,
                qa: preguntaRespuesta
            })
            if(response.status === 200){
                console.log(response)
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
              }
        }
       
    }

    const newPreguntaRespuesta = () => {
        scrollToTop() 
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
        if(idRespuesta === 0 && idPregunta === 0){//si la respuesta y la pregunta son nuevas
            console.log("in 00")
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta: (respuestasList.length)+maxIdRespuesta}])
            setMaxIdRespuesta(maxIdRespuesta+1)
            setMaxIdPregunta(maxIdPregunta+1)
            setNewPreguntasList([...newPreguntasList, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta}])
            setNewRespuestasList([...newRespuestasList, { id: (respuestasList.length)+maxIdRespuesta, opciones: respuestaFormatted}])
        }
        else if(idRespuesta === 0){//si solo la respuesta es nueva
            console.log("in X0")
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: idPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta:(respuestasList.length)+maxIdRespuesta}])
            setMaxIdRespuesta(maxIdRespuesta+1)
            setNewRespuestasList([...newRespuestasList, { id: (respuestasList.length)+maxIdRespuesta, opciones: respuestaFormatted}])
        }
        else if(idPregunta === 0 && idRespuesta !== 0){//si la pregunta es nueva y la respuesta existe
            console.log("in 0#")
            console.log(respuestaBank)
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: JSON.stringify(respuestaBank), idRespuesta: idRespuesta}])
            setMaxIdPregunta(maxIdPregunta+1)
            setNewPreguntasList([...newPreguntasList, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta}])
        }
        else if(idPregunta === 0){//si solo la pregunta es nueva
            console.log("in 0X")
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: respuestaFormatted, idRespuesta: idRespuesta}])
            setMaxIdPregunta(maxIdPregunta+1)
            setNewPreguntasList([...newPreguntasList, { idPregunta: (preguntasList.length)+maxIdPregunta, tipop: tipoPregunta, pregunta: pregunta}])
        }
        else{
            console.log("xd")
            setPreguntaRespuesta([...preguntaRespuesta, { idPregunta: idPregunta, tipop: tipoPregunta, pregunta: pregunta, respuesta: JSON.stringify(respuesta), idRespuesta: idRespuesta}])
        }
        setDetailsPane({isPaneOpen: true})
        setPregunta("")
        setRespuesta([{ respuesta: "" }])
        setRespuestaFormatted("{\"opciones\":[{\"respuesta\":\"\"}]}")
        setTipoPregunta("")
        setIdPregunta(0)
        setIdRespuesta(0)
    }

    const handleDeletePreguntaRespuesta = (index) => {
        preguntaRespuesta.splice(index, 1)
        setDetailsPane({isPaneOpen: false})
        setShowA(true)
        setVariante('danger')
        setMsg("Pregunta eliminada")
        scrollToTop()
    }

    const handleEditarPreguntaRespuesta = (index) => {
        setIdEditar(index)
        setShowModalE(true)
    }

    const handleEditarPregunta = () => {
        preguntaRespuesta[idEditar].pregunta = preguntaEdit;
        //setPreguntaRespuesta([...preguntaRespuesta])
        setShowOffEditP(false)
        setShowA(true)
        setVariante('success')
        setMsg("Pregunta editada")
        setShowModalE(false)
        scrollToTop()
    }

    const handleSetRespuestasEdit = () => {
        setRespuestasEdit(JSON.parse(preguntaRespuesta[idEditar]?.respuesta))
        console.log(JSON.parse(preguntaRespuesta[idEditar]?.respuesta))
        setTipoPreguntaEdit(preguntaRespuesta[idEditar]?.tipop)
        setShowOffEditO(true)
        setShowModalE(false)
    }

    const handleEditRespuesta = () => {
        respuestasEdit.opciones[cambioRespuesta].respuesta = respuestaEdit
        console.log(JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowOffEditR(false)
        setShowOffEditO(true)
    }

    const handleEditAdd = (offset) => {
        console.log("OG"+JSON.stringify(respuestasEdit))
        respuestasEdit.opciones.splice((cambioRespuesta+offset), 0, {respuesta: respuestaEditAdd})
        console.log("CHANGED"+JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowAddR(false)
        setShowOffEditO(true)
        setShowADelResp(true)
        setShowButtonUndo(false)
        setVariante('success')
        setMsg("Se agregó la opción")
        setRespuestaEditAdd("")
    }

    const handleEditarRespuesta = () => {
        preguntaRespuesta[idEditar].respuesta = JSON.stringify(respuestasEdit)
        console.log(preguntaRespuesta[idEditar].respuesta)
        setPreguntaRespuesta([...preguntaRespuesta]);
        setShowOffEditO(false)
        setShowButtonSave(false);
        setShowA(true)
        setVariante('success')
        setMsg("Respuesta editada")
        scrollToTop();
    }

    const handleSelectPregunta = (values) =>{
        console.log(values)
        setPregunta(values.pregunta)
        setIdPregunta(values.idPregunta)
    }

    const handleSelectRespuesta = (values) =>{
        console.log(values)
        //setRespuesta(JSON.parse(JSON.parse(JSON.stringify(values.opciones))))
        setRespuestaBank(JSON.parse(JSON.parse(JSON.stringify(values.opciones))))
        setIdRespuesta(values.id)
        if(values.id === 1){
            setTipoPregunta("Abierta")
            setRespuestaFormatted("{\"opciones\":[{\"respuesta\":\"\"}]}")
        }
        else{
            setTipoPregunta("Opción Múltiple")
        }
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
        if(value === ""){
            const nullval = ""
            list[index][name] = nullval
            setRespuesta(list)
        }
        else if(!isNaN(value)){
            const ivalue = parseInt(value);
            list[index][name] = ivalue;
            setRespuesta(list)
        }
        else{
            list[index][name] = value;
            setRespuesta(list);
        }
    };

    const handleEditRemove = (change) => {
        if(respuestasEdit.opciones.length > 2){
            setCambioRespuesta(change)
            console.log("el cambio es: "+change)
            console.log("OG"+JSON.stringify(respuestasEdit))
            setRecentlyRemovedRes(respuestasEdit.opciones[change].respuesta)
            respuestasEdit.opciones.splice(change, 1)
            console.log("CHANGED"+JSON.stringify(respuestasEdit))
            setShowButtonSave(true)
            setShowButtonUndo(true)
            setShowADelResp(true)
            setVariante('danger')
            setMsg("Se eliminó la opción")
        }
        else{
            setShowButtonUndo(false)
            setShowADelResp(true)
            setVariante('danger')
            setMsg('Una pregunta de opción múltiple debe tener al menos dos opciones')
        }
    }

    const handleUndoRemove = () => {
        respuestasEdit.opciones.splice(cambioRespuesta, 0, {respuesta: recentlyRemovedRes})
        console.log("UNDO"+JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowButtonUndo(false)
        setShowADelResp(true)
        setVariante('success')
        setMsg("Se restauró la opción")
    }

    const formatRespuesta = () => {
        const rep = "{\"opciones\":"+JSON.stringify(respuesta)+"}";
        setRespuestaFormatted(rep);
        setShowModalO(false);
    }

    const renderTooltipEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Haz click para editar el registro de la respuesta
        </Tooltip>
    );

    const renderTooltipDelete = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Haz click para borrar la respuesta del set de opciones
        </Tooltip>
    );

    const renderTooltipAdd = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Haz click para añadir una nueva opción dentro del set de opciones
        </Tooltip>
    );

    return(
        <main>
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
            <Form
            className="form"
            onSubmit={handleUploadNewCuestionario}>
                <h3>Crear cuestionario</h3>
                <br/>
                <Form.Group controlId="newcuestionarioname">
                    <Form.Label>Nombre del cuestionario</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre del cuestionario"
                    maxLength={150}
                    value={nombrec}
                    onChange={(e) => setNombreC(e.target.value)}/>
                    <br/>
                    <Form.Label>Materia</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre de la materia"
                    maxLength={150}
                    value={materiac}
                    onChange={(e) => setMateriaC(e.target.value)}
                    />
                    <br/>
                    <br/>
                    <Form.Label><h3>Pregunta nueva</h3></Form.Label>
                    <br/>
                    <Button
                    className="btnBancoPreguntas"
                    size="sm"
                    onClick={() => {
                        getPreguntas()
                        setShowModalP(true)
                        }}>
                            Banco de preguntas
                            <AiOutlineQuestionCircle size={20}/>
                    </Button>
                    <FormControl
                    as="textarea"
                    placeholder="Ingresa la pregunta"
                    maxLength={250}
                    value={pregunta}
                    onChange={(e) => {
                        setPregunta(e.target.value)
                    }}/>
                    <br/>
                    <Form.Label>Tipo de respuesta</Form.Label>
                    <h3>{tipoPregunta}</h3>
                    <ButtonGroup>
                        <Button 
                        className="btnBancoPreguntas"
                        value="Opción múltiple" 
                        onClick={(e) => {
                            setIdRespuesta(0)
                            setRespuestaBank([])
                            setTipoPregunta(e.target.value)
                            setShowModalO(true)}}>
                            Opción múltiple
                        </Button>
                        <Button 
                        className="btnBancoPreguntas"
                        value="Abierta"
                        onClick={(e) => {
                            setIdRespuesta(0)
                            setRespuestaBank([])
                            setRespuesta([{ respuesta: "" }])
                            setTipoPregunta(e.target.value)}}>
                            Abierta
                        </Button>
                        <Button
                        className="btnBancoPreguntas"
                        size="sm"
                        onClick={() => {
                            setRespuesta([{ respuesta: "" }])
                            getRespuestas()
                            setShowModalR(true)}}>
                            Banco de respuestas
                        </Button>
                    </ButtonGroup>
                    <br/>
                    <br/>
                    <Form.Label><h3>Respuesta(s) nueva</h3></Form.Label>
                    <br/>
                    {(idRespuesta === 0)?
                    <FormControl
                    as="textarea"
                    disabled
                    value={JSON.stringify(respuesta)}
                    onChange={(e) => setRespuesta(e.target.value)}
                    />:
                    <FormControl
                    as="textarea"
                    disabled
                    value={JSON.stringify(respuestaBank)}
                    //onChange={(e) => setRespuesta(e.target.value)}
                    />}
                    <div>
                    {(idRespuesta !== 0) ?
                        <div>
                            {console.log("Respuesta:"+respuestaBank.opciones)}
                            {respuestaBank.opciones.map(values => (
                                <div key={values.respuesta}>
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
                    {(tipoPregunta === "Opción múltiple") &&
                    <div>
                    <Button
                    className="btnRegistroRespuestas"
                    onClick={() => {setShowModalO(true)}}>
                        Editar Opciones
                    </Button>
                    </div>
                    }
                    <Button 
                    className="btnAct"
                    onClick={newPreguntaRespuesta}>
                        Guardar pregunta y respuesta
                        <AiOutlinePlus/>
                    </Button>
                    <Button
                    className="btnAct"
                    onClick={() => {
                        setDetailsPane({isPaneOpen: true})
                    }}>
                        Ver cuestionario
                        <AiOutlineEye/>
                    </Button>
                </Form.Group>
            </Form>
            {/*SLIDING PANE DE TABLA PREGUNTAS */}
            <SlidingPane
            className='sliding-pane'
            isOpen={detailsPane.isPaneOpen}
            title="Registro de preguntas"
            width={window.innerWidth < 600 ? "100%" : "500px"}
            onRequestClose={() => {setDetailsPane({isPaneOpen: false})}}>
            <div className="pane-content">
                {(preguntaRespuesta.length > 0) ?
                <div className="pane-content">
                <Table>
                    <thead>
                        <tr>
                            {/* <th>Id Pregunta</th> */}
                            <th>Tipo de pregunta</th>
                            <th>Pregunta</th>
                            {/* <th>Id Respuesta</th> */}
                            <th>Respuesta</th>
                            <th>Editar</th>
                            <th>Borrar</th>
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
                                <td>
                                    <Button
                                    variant="outline-success"
                                    onClick={() => {handleEditarPreguntaRespuesta(index)}}>
                                        <AiOutlineEdit />
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                    variant="outline-danger"
                                    onClick={() => {handleDeletePreguntaRespuesta(index)}}>
                                        <AiOutlineDelete />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button 
                className="btnAct"
                onClick={handleUploadNewCuestionario}>
                    Subir Cuestionario
                    <AiOutlineSend/>
                </Button>
                </div>
                :
                <div className="text-center">
                <h3>Actualmente no hay preguntas registradas en el cuestionario</h3>
                </div>
                }
            </div>
            </SlidingPane>
            {/*MODAL BANCO PREGUNTAS*/}
            <Modal 
            show={showModalP}
            size="sm"
            scrollable
            onHide={() => setShowModalP(false)}>
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
                                onClick={() => {
                                    setShowModalP(false)
                                    handleSelectPregunta(values)}}>
                                    <AiOutlineSelect/>
                                 </Button>
                            </ListGroupItem>
                        </ListGroup>
                        </div>
                        ))
                    }
                    <br/>
                    <div className="text-center">
                        <h5>Preguntas recién generadas:</h5>
                    </div>
                    {newPreguntasList.map(values => (
                        <div key={values.idPregunta}>
                        <ListGroup>
                            <ListGroupItem>
                                {values.idPregunta}. {values.pregunta}
                                <br/>
                                <Button
                                variant="success"
                                onClick={() => {
                                    setShowModalP(false)
                                    handleSelectPregunta(values)}}>
                                    <AiOutlineSelect/>
                                    </Button>
                            </ListGroupItem>
                        </ListGroup>
                        </div>
                        ))
                    }
                </ModalBody>
            </Modal>
            <div className="inputPreguntas">
            {/*MODAL BANCO RESPUESTAS*/}
            <Modal 
            show={showModalR}
            size="sm"
            scrollable
            onHide={() => setShowModalR(false)}>
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
                                onClick={() => {
                                    setShowModalR(false)
                                    handleSelectRespuesta(values)}}>
                                    <AiOutlineSelect/>
                                </Button>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                    }
                    <br/>
                    <div className="text-center">
                        <h5>Respuestas recién generadas:</h5>
                    </div>	
                    {newRespuestasList.map(values => (
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
                                onClick={() => {
                                    setShowModalR(false)
                                    handleSelectRespuesta(values)}}>
                                    <AiOutlineSelect/>
                                </Button>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                    }
                </ModalBody>
            </Modal>
            <div>
            {/*MODAL REGISTRO PREGUNTAS OPCIÓN MÚLTIPLE*/}
            <Modal
            show={showModalO}
            onHide={() => {
                setShowModalO(false)
                setRespuesta([{ "respuesta": "" }])
            }}
            scrollable>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Registra las respuestas:
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {respuesta?.map((opcion, index) => (
                        <div key={index} className="services">
                            <div className="first-division">
                            <input
                            name="respuesta"
                            type="text"
                            id="opcion"
                            value={opcion.respuesta}
                            onChange={(e) => handleChangeRespuesta(e, index)}/>
                            {respuesta.length-1 === index && 
                            (<Button 
                            size="sm"
                            variant="success"
                            onClick={handleAddRespuesta}>
                                Nueva opción
                                <AiOutlinePlus/>
                            </Button>)
                            }
                            <br/>
                            {respuesta.length-1 === index && respuesta.length > 1 && 
                            (<Button 
                            size="sm"
                            variant="success"
                            onClick={formatRespuesta}>
                                <span>Guardar registros</span>
                                <AiOutlineSend/>
                            </Button>)
                            }
                            </div>
                            <div className="second-division">
                                {respuesta.length > 1 && 
                                (<Button 
                                size="sm"
                                variant="danger"
                                onClick={() => handleRemoveRespuesta(index)}>
                                    <AiOutlineDelete/>
                                </Button>)}
                            </div>
                        </div>
                    ))}
                </ModalBody>
            </Modal>
            {/*MODAL EDICION PREGUNTA RESPUESTA*/}
            <Modal
            show={showModalE}
            onHide={() => {setShowModalE(false)}}
            dismissible>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Edición de pregunta y respuesta
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center">
                        <h5>Pregunta: {preguntaRespuesta[idEditar]?.pregunta}</h5>
                        <Button
                        className="btnAct"
                        onClick={() => {
                            setPreguntaEdit(preguntaRespuesta[idEditar]?.pregunta)
                            setShowOffEditP(true)
                            setShowModalE(false)
                        }}>
                            Editar pregunta<AiOutlineEdit/>
                        </Button>
                        <br/>
                        <Button
                        className="btnAct"
                        onClick={() => {handleSetRespuestasEdit(idEditar)}}>
                            Editar respuesta<AiOutlineEdit/>
                        </Button>
                        <br/>
                    </div>
                </ModalBody>
            </Modal>
            {/*OFFCANVAS EDITAR PREGUNTA*/}
            <Offcanvas 
            show={showOffEditP} 
            placement={'bottom'}
            onHide={() => setShowOffEditP(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Editar pregunta</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="newHito">
                        <Form.Label>Pregunta</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={1}
                        maxLength="250"
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
                setShowOffEditP(false)
                setShowModalE(true)
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
            {/*OFFCANVAS EDITAR RESPUESTAS OPCION MULTIPLE*/}
            <Offcanvas
            show={showOffEditO}
            placement={'start'}
            onHide={() => {showOffEditO(false)}}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Editar respuesta</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <div className='alertas'>
                    <Alert 
                    show={showADelResp}
                    variant={variante}
                    onClose={() => setShowADelResp(false)}
                    dismissible>
                        <Alert.Heading>
                        {msg}
                        {showButtonUndo &&
                        <Button
                        variant="outline-warning"
                        className='btnEditarPregunta'
                        onClick={handleUndoRemove}>
                            Restaurar
                        </Button>}
                        </Alert.Heading>
                    </Alert>
                </div>
                {tipoPreguntaEdit === "Abierta" ?
                <div>
                    Esta pregunta es abierta, por lo que no contiene respuestas editables
                </div>:
                <div>
                    {respuestasEdit.opciones?.map((values, index) => (
                    <div key={index}>
                        <ListGroup className='displaySetRespuestas'>
                            <ListGroupItem className='setRespuestas'>
                                {(values.respuesta)}
                                <div className='setRespuestasBotones'>
                                    <OverlayTrigger
                                    placement='bottom'
                                    overlay={renderTooltipEdit}>
                                        <Button
                                        className='btnEdicion'
                                        variant='success'
                                        onClick={() => {
                                            setRespuestaEdit(values.respuesta)
                                            setCambioRespuesta(index)
                                            setShowOffEditO(false)
                                            setShowOffEditR(true)
                                        }}>
                                            <AiOutlineEdit/>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                    placement='bottom'
                                    overlay={renderTooltipDelete}>
                                        <Button
                                        className='btnEdicion'
                                        variant='danger'
                                        onClick={() => {handleEditRemove(index)}}>
                                            <AiOutlineDelete/>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                    placement='bottom'
                                    overlay={renderTooltipAdd}>
                                        <Button
                                        className='btnEdicion'
                                        variant='warning'
                                        onClick={() => {
                                            setCambioRespuesta(index)
                                            setShowButtonSave(false)
                                            setShowAddR(true)}}>
                                            <BiMessageAltAdd/>
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                    ))
                    }
                    {showAddR &&
                    <div>
                        <Form>
                            <Form.Group
                            className="mb-3"
                            controlId="newRespuesta">
                                <Form.Label>Respuesta nueva</Form.Label>
                                <br/>
                                <Button 
                                className='btnAct'
                                size='sm'
                                variant="success"
                                onClick={() => {handleEditAdd(0)}}>
                                    Guardar encima de la respuesta seleccionada
                                    <AiOutlineVerticalAlignTop size={50}/>
                                </Button>
                                <Form.Control 
                                as="textarea" 
                                rows={1}
                                placeholder="Respuesta nueva"
                                value={respuestaEditAdd}
                                onChange={(e) => {setRespuestaEditAdd(e.target.value)}}>
                                    {respuestaEditAdd}
                                </Form.Control>
                                <br/>
                                <Button 
                                className='btnAct'
                                size='sm' 
                                variant="success" 
                                onClick={() => {handleEditAdd(1)}}>
                                    Guardar debajo de la respuesta seleccionada
                                    <AiOutlineVerticalAlignBottom size={50}/>
                                </Button>
                            </Form.Group>
                        </Form>
                        <Button 
                        size='sm'
                        variant="danger"
                        onClick={() => {
                            setShowAddR(false)
                            setShowOffEditO(true)
                            setRespuestaEditAdd('')}}>
                            Cerrar
                        </Button>
                    </div>
                    }
                    {showButtonSave &&
                    <div>
                        <Button
                        className='btnAct'
                        onClick={handleEditarRespuesta}>
                            Guardar Cambios
                            <AiOutlineSend/>
                        </Button>
                    </div> 
                    }
                </div>}
                </Offcanvas.Body>
            </Offcanvas>
            {/*OFFCANVAS EDITAR RESPUESTA*/}
            <Offcanvas 
            show={showOffEditR} 
            placement={'bottom'} 
            onHide={() => setShowOffEditR(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Editar Respuesta</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                    <Form>
                        <Form.Group
                        className="mb-3"
                        controlId="newHito">
                            <Form.Label>Respuesta</Form.Label>
                            <Form.Control 
                            as="textarea" 
                            rows={1} 
                            value={respuestaEdit}
                            onChange={(e) => setRespuestaEdit(e.target.value)}>
                                {respuestaEdit}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Button 
                    size='sm'
                    variant="danger"
                    onClick={() => {
                        setShowOffEditR(false)
                        setShowOffEditO(true)
                        setRespuestaEdit('')}}>
                        Cerrar
                    </Button>
                    <Button 
                    size='sm' 
                    variant="success" 
                    onClick={handleEditRespuesta}>
                        Guardar
                    </Button>
            </Offcanvas.Body>
            </Offcanvas>
            {/*OFFCANVAS AGREGAR RESPUESTA*/}
            
            </div>
            </div>
        </main>
    );
}

export default CrearCuestionario