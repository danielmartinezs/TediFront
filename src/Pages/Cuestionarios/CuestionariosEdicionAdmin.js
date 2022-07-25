import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Form, FormControl, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineQuestionCircle, AiOutlineRollback, AiOutlineSelect, AiOutlineSend, AiOutlineVerticalAlignBottom, AiOutlineVerticalAlignTop } from 'react-icons/ai'
import { BiMessageAltAdd } from 'react-icons/bi'
import SlidingPane from 'react-sliding-pane';
import axios from '../../axios/axios';
const GET_QUESTIONNAIRE_INFO_URL = '/questionnaires/getquestionnaireinfo'
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const GET_RESPUESTA_URL = '/questionnaires/getanswer'
const EDIT_NOMBRE_CUESTIONARIO_URL = '/questionnaires/editquestionairename'
const EDIT_MATERIA_CUESTIONARIO_URL = '/questionnaires/editmateria'
const GET_MATERIAS_URL = '/questionnaires/getmaterias'
const EDIT_RESPUESTA_URL = '/questionnaires/editanswer'
const EDIT_CREATE_RESPUESTA_URL = '/questionnaires/editcreateanswer'
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const EDIT_PREGUNTA_URL = '/questionnaires/editquestion'
const EDIT_CREATE_PREGUNTA_URL = '/questionnaires/editcreatequestion'
const DELETE_CUESTIONARIO_URL = '/questionnaires/deletequestionnaire'
const DELETE_QA_URL = '/questionnaires/deleteqa'
const NEW_PREGUNTA_URL = '/questionnaires/addquestion'
const ESTABLISH_KEY_URL = '/questionnaires/establishnewkey'

function CuestionariosEdicionAdmin() {

    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const [materiasList, setMateriasList] = useState([]);
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [newRespuesta, setNewRespuesta] = useState([{ "respuesta": "" }]);
    const [newRespuestaFormatted, setNewRespuestaFormatted] = useState("{\"opciones\":[{\"respuesta\":\"\"}]}");
    const [newRespuestaBank, setNewRespuestaBank] = useState([]);
    const [respuestaEdit, setRespuestaEdit] = useState();
    const [respuestaEditAdd, setRespuestaEditAdd] = useState();
    const [recentlyRemovedRes, setRecentlyRemovedRes] = useState();
    const [idRespuestaEdit, setIdRespuestaEdit] = useState(0);
    const [idRespuestaDelete, setIdRespuestaDelete] = useState(0);
    const [cambioRespuesta, setCambioRespuesta] = useState(0);
    const [idPreguntaDelete, setIdPreguntaDelete] = useState(0);
    const [idPreguntaEdit, setIdPreguntaEdit] = useState(0);
    const [newPreguntaId, setNewPreguntaId] = useState(0);
    const [newRespuestaId, setNewRespuestaId] = useState(0);
    const [nombrec, setNombreC] = useState("");
    const [materiac, setMateriaC] = useState("");
    const [newPregunta, setNewPregunta] = useState("");
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [tipoNewPregunta, setTipoNewPregunta] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showButtonSave, setShowButtonSave] = useState(false);
    const [showButtonUndo, setShowButtonUndo] = useState(false);
    const [showMDelete, setShowMDelete] = useState(false);
    const [showMDeleteQA, setShowMDeleteQA] = useState(false);
    const [showModalRes, setShowModalRes] = useState(false);
    const [showModalCerrar, setShowModalCerrar] = useState(false);
    const [showModalResEdit, setShowModalResEdit] = useState(false);
    const [showModalPregEdit, setShowModalPregEdit] = useState(false);
    const [showModalBancoR, setShowModalBancoR] = useState(false);
    const [showModalBancoP, setShowModalBancoP] = useState(false);
    const [showModalBancoM, setShowModalBancoM] = useState(false);
    const [showModalOpMul, setShowModalOpMul] = useState(false);
    const [showOffEditNC, setShowOffEditNC] = useState(false);
    const [showOffEditMC, setShowOffEditMC] = useState(false);
    const [showOffEditR, setShowOffEditR] = useState(false);
    const [showOffEditP, setShowOffEditP] = useState(false);
    const [showOffAddR, setShowOffAddR] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showADelResp, setShowADelResp] = useState(false);
    const [showAOpMul, setShowAOpMul] = useState(false);
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});
    const {idCuestionario} = useParams();
    const navigate = useNavigate();

    useEffect (() => {
        getQuestionnaireInfo()
    }, [])

    useEffect (() => {
        getQuestionnaireInfo()
    }, [showA])

    const getQuestionnaireInfo = () => {
        axios.get(GET_QUESTIONNAIRE_INFO_URL+"/"+idCuestionario).then((response) => {
            setCuestionariosInfo(response.data)
            setNombreC(response.data[0].nombre)
            setMateriaC(response.data[0].materia)
        })
    }

    const getMateriasList = () => {
        axios.get(GET_MATERIAS_URL).then((response) => {
            setMateriasList(response.data)
        })
        setShowOffEditMC(true)
    }

    const getRespuesta = (idres) => {
        axios.get(GET_RESPUESTA_URL+"/"+idres).then((response) => {
            setRespuestas(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
            setRespuestasEdit(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
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

    const editarNombreCuestionario = async () => {
        setShowOffEditNC(false);
        try{
            const response = await axios.post(EDIT_NOMBRE_CUESTIONARIO_URL, {
                id: idCuestionario,
                nombre: nombrec
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
            }
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
              } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
              }
        }
    }

    const editarMateriaCuestionario = async () => {
        setShowOffEditMC(false);
        try{
            const response = await axios.post(EDIT_MATERIA_CUESTIONARIO_URL, {
                id: idCuestionario,
                materia: materiac
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
            }
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
            } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
            }
        }
    }

    const editarPregunta = async () => {
        setShowOffEditP(false)
        setShowModalPregEdit(false)
        try{
        const response = await axios.post(EDIT_PREGUNTA_URL, {
            idp: idPreguntaEdit,
            pregunta: preguntaEdit
        })
        if(response.status === 200){
            console.log(response)
            setShowA(true)
            setVariante('success')
            setMsg(response.data.message)
        }
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

    const editarCrearPregunta = async () => {
        setShowOffEditP(false)
        console.log("idredit"+idRespuestaEdit)
        console.log("idpedit"+idPreguntaEdit)
        try{
        const response = await axios.post(EDIT_CREATE_PREGUNTA_URL, {
            idc : idCuestionario,
            idp: idPreguntaEdit,
            idr: idRespuestaEdit,
            pregunta: preguntaEdit,
            tipo: tipoPreguntaEdit
        })
        if(response.status === 200){
            console.log(response)
            setShowA(true)
            setVariante('success')
            setMsg(response.data.message)
            setIdRespuestaEdit(0)
            setIdPreguntaEdit(0)
            setPreguntaEdit("")
            setTipoPreguntaEdit("")
        }
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
            } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
            }
        }
    }

    const editarRespuesta = async () => {
        setShowOffEditR(false)
        setShowModalResEdit(false)
        console.log(JSON.stringify(respuestasEdit))
        try{
        const response = await axios.post(EDIT_RESPUESTA_URL, {
            idr: idRespuestaEdit,
            opciones: JSON.stringify(respuestasEdit)
        })
        if(response.status === 200){
            console.log(response)
            setShowA(true)
            setVariante('success')
            setMsg(response.data.message)
            setCambioRespuesta(0)
            setRespuestaEdit("")
            setShowButtonSave(false)
        }
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

    const editarCrearRespuesta = async () => {
        console.log("edite y cree una nueva repsuesta")
        setShowOffEditR(false)
        setShowModalResEdit(false)
        console.log("idp es: "+idPreguntaEdit)
        console.log(JSON.stringify(respuestasEdit))
        try{
        const response = await axios.post(EDIT_CREATE_RESPUESTA_URL, {
            idc: idCuestionario,
            idp: idPreguntaEdit,
            idr: idRespuestaEdit,
            opciones: JSON.stringify(respuestasEdit)
        })
        if(response.status === 200){
            console.log(response)
            setShowA(true)
            setVariante('success')
            setMsg(response.data.message)
            setCambioRespuesta(0)
            setRespuestaEdit("")
            setIdPreguntaEdit(0)
            setShowButtonSave(false)
        }
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
            } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
            }
        }
    }

    const handleSetRespuestas = (idres) => {
        getRespuesta(idres)
        console.log("El id de la respuesta es"+idres)
        console.log("El ide de la pregunta a editar es"+idPreguntaEdit)
        setShowModalRes(true)
    }

    const handleSubmitNewPregunta = async () => {
        setDetailsPane({isPaneOpen: false})
        let newres = ""
        if(newRespuestaId === 1 || tipoNewPregunta === "Abierta"){
            newres = newRespuestaFormatted;
        }
        else if(newRespuestaId === 0){
            console.log("NEWRES: "+newRespuestaFormatted)
            newres = newRespuestaFormatted;
        }
        else{
            newres = JSON.stringify(newRespuestaBank);
        }
        console.log("El tipo de la pregunta es: "+tipoNewPregunta)
        console.log("La respuesta es: "+newres)
        console.log("La pregunta es: "+newPregunta)
        try{
        const response = await axios.post(NEW_PREGUNTA_URL, {
            idc: idCuestionario,
            pregunta: newPregunta,
            tipo: tipoNewPregunta,
            respuesta: newres
        })
        if(response.status === 200){
            console.log(response)
            setShowA(true)
            setVariante('success')
            setMsg(response.data.message)
            establishKey()
            setNewPregunta("");
            setNewRespuesta([{ "respuesta": "" }]);
            setNewRespuestaId(0);
            setNewPreguntaId(0);
            setTipoNewPregunta("");
        }
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

    const establishKey = async () => {
        let newres = "";
        if(newRespuestaId === 1 || tipoNewPregunta === "Abierta"){
            newres = newRespuestaFormatted;
        }
        else if(newRespuestaId === 0){
            newres = newRespuestaFormatted;
        }
        else{
            newres = JSON.stringify(newRespuestaBank);
        }
        try{
            const response = await axios.post(ESTABLISH_KEY_URL, {
                idc: idCuestionario,
                pregunta: newPregunta,
                tipo: tipoNewPregunta,
                respuesta: newres
            })
            if(response.status === 200){
                console.log(response);
                setShowA(true);
                setVariante('success');
                setMsg(response.data.message);
                setNewPregunta("");
                setNewRespuesta("");
                setNewRespuestaId(0);
                setNewPreguntaId(0);
                setTipoNewPregunta("");
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
              } else if(error.response?.status === 404){
                setMsg(error.response.data.message);
              }
        }
    }

    const handleDeleteCuestionario = async () => {
        const response = await axios.post(DELETE_CUESTIONARIO_URL+"/"+idCuestionario)
        setShowA(true)
        setVariante('success')
        setMsg(response.data.message)
        setShowMDelete(false)
        navigate('/CuestionariosAdmin')
    }

    const handleDeleteQA = async () => {
        if(cuestionariosInfo.length < 2){
            setShowA(true)
            setVariante('danger')
            setMsg('En cuestionario debe de tener al menos una pregunta')
            return
        }
        try{
            const response = await axios.post(DELETE_QA_URL, {
                idc: idCuestionario,
                idp: idPreguntaDelete,
                idr: idRespuestaDelete
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('danger')
                setMsg(response.data.message)
                setIdPreguntaDelete(0)
                setIdRespuestaDelete(0)
                setShowMDeleteQA(false)
            }
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
            } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
            }
        }
    }

    const handleEditRespuesta = () => {
        respuestasEdit.opciones[cambioRespuesta].respuesta = respuestaEdit
        console.log(JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowOffEditR(false)
        setShowModalRes(true)
    }

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

    const handleEditAdd = (offset) => {
        console.log("OG"+JSON.stringify(respuestasEdit))
        respuestasEdit.opciones.splice((cambioRespuesta+offset), 0, {respuesta: respuestaEditAdd})
        console.log("CHANGED"+JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowOffAddR(false)
        setShowModalRes(true)
        setShowADelResp(true)
        setShowButtonUndo(false)
        setVariante('success')
        setMsg("Se agregó la opción")
        setRespuestaEditAdd("")
    }

    const handleSelectPregunta = (values) =>{
        console.log(values)
        setNewPregunta(values.pregunta)
        setNewPreguntaId(values.idPregunta)
    }

    const handleSelectRespuesta = (values) =>{
        //setRespuesta(JSON.parse(JSON.parse(JSON.stringify(values.opciones))))
        setNewRespuestaBank(JSON.parse(JSON.parse(JSON.stringify(values.opciones))))
        setNewRespuestaId(values.id)
        if(values.id === 1){
            setTipoNewPregunta("Abierta")
            setNewRespuestaFormatted("{\"opciones\":[{\"respuesta\":\"\"}]}")
        }
        else{
            setTipoNewPregunta("Opción Múltiple")
        }
    }

    const handleAddRespuesta = () => {
        setNewRespuesta([...newRespuesta, { respuesta: "" }])
    }

    const handleRemoveRespuesta = (index) => {
        const opciones = [...newRespuesta];
        opciones.splice(index, 1);
        setNewRespuesta(opciones)
    }

    const handleChangeRespuesta = (e, index) => {
        const { name, value } = e.target;
        const list = [...newRespuesta];
        if(value === ""){
            const nullval = ""
            list[index][name] = nullval
            setNewRespuesta(list)
        }
        else if(!isNaN(value)){
            const ivalue = parseInt(value);
            list[index][name] = ivalue;
            setNewRespuesta(list)
        }
        else{
            list[index][name] = value;
            setNewRespuesta(list);
        }
    };

    const formatRespuesta = () => {
        const rep = "{\"opciones\":"+JSON.stringify(newRespuesta)+"}";
        setNewRespuestaFormatted(rep);
        setShowModalOpMul(false);
    }

    const handleValidaInputs = () => {
        const inputs = []
        for(let i = 0; i < newRespuesta.length; i++){
        inputs.push(newRespuesta[i].respuesta);
        }
        const findDuplicates = inputs => inputs.filter((item, index) => inputs.indexOf(item) !== index);
        const duplicates = findDuplicates(inputs);
        if(duplicates.length > 0){
            setShowAOpMul(true)
            setVariante('danger')
            setMsg("No puede haber registros duplicados, elimina o modifica el registro duplicado")
        }
        else{
            formatRespuesta()
        }
    }

    const handleCloseWithoutSave = () => {
        if(!showButtonSave){
            setShowModalRes(false)
            setShowOffAddR(false)
        }
        else{
            setShowModalCerrar(true)
            setShowOffAddR(false)
        }
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
        <div>
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
                <div className='text-center'>
                <h3>
                    {nombrec}
                    <Button
                    className="btnEditarCuestionario"
                    variant="outline-success"
                    onClick={() => setShowOffEditNC(true)}>
                        <AiOutlineEdit/>
                    </Button>
                </h3>
                </div>
                <div className='text-center'>
                <h4>
                    Materia:
                    <br/>
                    {materiac}
                    <Button
                    className="btnEditarCuestionario"
                    variant="outline-success"
                    onClick={getMateriasList}>
                        <AiOutlineEdit/>
                    </Button>
                </h4>
                </div>
            {/*TABLA PREGUNTAS*/}
            <Table className="tabla">
                <thead>
                    <th>
                        Editar
                    </th>
                    <th>
                        Borrar
                    </th>
                    <th>
                        Pregunta
                    </th>
                    <th>
                        Tipo
                    </th>
                    <th>
                        Set de Respuestas
                    </th>
                </thead>
                <tbody>
                    {cuestionariosInfo.map((values) => (
                        <tr key={values.idPregunta+values.idRespuesta}>
                            <td>
                                <Button
                                variant='outline-success'
                                onClick={() => {
                                    setIdPreguntaEdit(values.idPregunta)
                                    setPreguntaEdit(values.pregunta)
                                    setTipoPreguntaEdit(values.tipo)
                                    setIdRespuestaEdit(values.idRespuesta)
                                    setShowOffEditP(true)
                                }}>
                                    <AiOutlineEdit/>
                                </Button>
                            </td>
                            <td>
                                <Button
                                variant='outline-danger'
                                onClick={() => {
                                    setIdPreguntaDelete(values.idPregunta)
                                    setIdRespuestaDelete(values.idRespuesta)
                                    setShowMDeleteQA(true)
                                }}>
                                    <AiOutlineDelete/>
                                </Button>
                            </td>
                            <td>{values.pregunta}</td>
                            <td>{values.tipo}</td>
                            <td>
                            <Button
                            className='btnVisualizaRespuesta'
                            variant="success"
                            onClick={() => {
                                setIdPreguntaEdit(values.idPregunta)
                                setTipoPreguntaEdit(values.tipo)
                                setIdRespuestaEdit(values.idRespuesta)
                                handleSetRespuestas(values.idRespuesta)
                            }}>
                                Visualizar respuestas
                            </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* MODAL EDICION RESPUESTAS */}
            <Modal
            show={showModalRes}
            onHide={handleCloseWithoutSave}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Set de Respuestas
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
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
                        Esta pregunta es abierta, por lo que no tiene respuestas editables
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
                                                setShowModalRes(false)
                                                setShowOffEditR(true)}}>
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
                                                setShowOffAddR(true)}}>
                                                <BiMessageAltAdd/>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                        ))
                        }
                        {showOffAddR &&
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
                                setShowOffAddR(false)
                                setShowModalRes(true)
                                setRespuestaEditAdd('')}}>
                                Cerrar
                            </Button>
                        </div>
                        }
                        {showButtonSave === true &&
                        <div>
                            <Button
                            className='btnAct'
                            onClick={() => {
                                setShowModalResEdit(true)
                                setShowModalRes(false)}}>
                                Guardar Cambios
                                <AiOutlineSend/>
                            </Button>
                        </div> 
                        }
                    </div>}
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
                        setPreguntaEdit('')}}>
                            Cerrar
                        </Button>
                        <Button
                        size='sm'
                        variant="success"
                        onClick={() => {setShowModalPregEdit(true)}}>
                            Guardar
                        </Button>
                </Offcanvas.Body>
            </Offcanvas>
            {/*OFFCANVAS EDITAR NOMBRE CUESTIONARIO*/}
            <Offcanvas 
                show={showOffEditNC} 
                placement={'bottom'}
                onHide={() => setShowOffEditNC(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Editar nombre del cuestionario</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                        <Form>
                            <Form.Group
                            className="mb-3"
                            controlId="newNombreC">
                                <Form.Label>Nombre del cuestionario</Form.Label>
                                <Form.Control 
                                as="textarea" 
                                rows={1}
                                maxLength="250"
                                value={nombrec}
                                onChange={(e) => setNombreC(e.target.value)}>
                                    {nombrec}
                                </Form.Control>
                            </Form.Group>
                            <Button 
                            size='sm'
                            variant="danger"
                            onClick={() => {
                            setShowOffEditNC(false)
                            setNombreC(cuestionariosInfo[0]?.nombre)}}>
                                Cerrar
                            </Button>
                            <Button
                            size='sm'
                            variant="success"
                            onClick={editarNombreCuestionario}>
                                Guardar
                            </Button>
                        </Form>
                </Offcanvas.Body>
            </Offcanvas>
            {/*OFFCANVAS EDITAR MATERIA CUESTIONARIO*/}
            <Offcanvas 
                show={showOffEditMC} 
                placement={'bottom'}
                onHide={() => setShowOffEditMC(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Editar materia del cuestionario</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                        <Form>
                            <Form.Group
                            className="mb-3"
                            controlId="newMateriaC">
                                <Form.Label>Materia del cuestionario</Form.Label>
                                <Form.Control 
                                as="textarea" 
                                rows={1}
                                maxLength="250"
                                value={materiac}
                                onChange={(e) => setMateriaC(e.target.value)}/>
                            </Form.Group>
                            <Button 
                            size='sm'
                            variant="danger"
                            onClick={() => {
                            setShowOffEditMC(false)
                            setMateriaC(cuestionariosInfo[0]?.materia)}}>
                                Cerrar
                            </Button>
                            <Button
                            size='sm'
                            variant='warning'
                            onClick={() => {setShowModalBancoM(true)}}>
                                Listado de materias existentes
                            </Button>
                            <Button
                            size='sm'
                            variant="success"
                            onClick={editarMateriaCuestionario}>
                                Guardar
                            </Button>
                        </Form>
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
                            setShowModalRes(true)
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
             {/*MODAL BORRAR PREGUNTA RESPUESTA*/}
             <Modal 
            show={showMDeleteQA} 
            onHide={() => {setShowMDeleteQA(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar esta pregunta del cuestionario?</Modal.Title>
                </Modal.Header>
                <Modal.Body><h3>Una vez borrada del cuestionario no podrá recuperarse</h3></Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="success" 
                    onClick={() => {setShowMDelete(false)}}>
                        No, quiero conservar la pregunta en el cuestionario
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={handleDeleteQA}>
                        Sí, quiero borrar la pregunta del cuestionario
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*MODAL BORRAR CUESTIONARIO*/}
            <Modal 
            show={showMDelete} 
            size="lg"
            onHide={() => {setShowMDelete(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar este cuestionario?</Modal.Title>
                </Modal.Header>
                <Modal.Body><h3>Una vez borrado el cuestionario no podrá recuperarse<br/>Las respuestas de aquellos alumnos que respondieron este cuestionario serán borradas permanentemente</h3></Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="success" 
                    onClick={() => {setShowMDelete(false)}}>
                        No, quiero conservar el cuestionario
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={handleDeleteCuestionario}>
                        Sí, quiero borrar el cuestionario
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*SLIDING PANE AGREGAR PREGUNTA*/}
            <SlidingPane
            isOpen={detailsPane.isPaneOpen}
            title="Agregar pregunta al cuestionario"
            width={window.innerWidth < 600 ? "100%" : "750px"}
            onRequestClose={() => {setDetailsPane({isPaneOpen: false})}}>
                <Form
                className="form"
                onSubmit={handleSubmitNewPregunta}>
                    <h3>Agregar pregunta</h3>
                    <br/>
                    <Form.Group controlId="newquestiondetails">
                        <Form.Label><h3>Pregunta nueva</h3></Form.Label>
                        <br/>
                        <Button
                        className="btnBancoPreguntas"
                        size="sm"
                        onClick={() => {
                            getPreguntas()
                            setShowModalBancoP(true)
                            }}>
                                Banco de preguntas
                                <AiOutlineQuestionCircle size={20}/>
                        </Button>
                        <FormControl
                        as="textarea"
                        placeholder="Ingresa la pregunta"
                        maxLength={250}
                        value={newPregunta}
                        onChange={(e) => {
                            setNewPregunta(e.target.value)
                        }}/>
                        <br/>
                        <Form.Label>Tipo de respuesta</Form.Label>
                        <h3>{tipoNewPregunta}</h3>
                        <ButtonGroup>
                            <Button 
                            className="btnBancoPreguntas"
                            value="Opción múltiple" 
                            onClick={(e) => {
                                setNewRespuestaId(0)
                                setNewRespuestaBank([])
                                setTipoNewPregunta(e.target.value)
                                setShowModalOpMul(true)}}>
                                Opción múltiple
                            </Button>
                            <Button 
                            className="btnBancoPreguntas"
                            value="Abierta"
                            onClick={(e) => {
                                setNewRespuestaId(0)
                                setNewRespuestaBank([])
                                setNewRespuesta([{ respuesta: "" }])
                                setTipoNewPregunta(e.target.value)}}>
                                Abierta
                            </Button>
                            <Button
                            className="btnBancoPreguntas"
                            size="sm"
                            onClick={() => {
                                setNewRespuesta([{ respuesta: "" }])
                                getRespuestas()
                                setShowModalBancoR(true)}}>
                                Banco de respuestas
                            </Button>
                        </ButtonGroup>
                        <br/>
                        <br/>
                        <Form.Label><h3>Respuesta nueva</h3></Form.Label>
                        <br/>
                        {(newRespuestaId === 0)?
                        <FormControl
                        as="textarea"
                        disabled
                        value={JSON.stringify(newRespuesta)}
                        onChange={(e) => setNewRespuesta(e.target.value)}
                        />:
                        <FormControl
                        as="textarea"
                        disabled
                        value={JSON.stringify(newRespuestaBank)}
                        />}
                        <div>
                        {(newRespuestaId !== 0) ?
                            <div>
                                {console.log("Respuesta:"+newRespuestaBank.opciones)}
                                {newRespuestaBank.opciones.map(values => (
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
                                {newRespuesta.map(values => (
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
                        {(tipoNewPregunta === "Opción múltiple") && 
                        <div>
                        {/* <RegistroSetRespuestas changeSet={newrespuesta => setNewRespuesta(newrespuesta)}/> */}
                        <Button
                        className="btnRegistroRespuestas"
                        onClick={() => {setShowModalOpMul(true)}}>
                            Editar Opciones
                        </Button>
                        </div>
                        }
                        <Button 
                        className="btnAct"
                        onClick={handleSubmitNewPregunta}>
                            Registrar pregunta nueva
                            <AiOutlinePlus/>
                        </Button>
                    </Form.Group>
                </Form>
            </SlidingPane>
            {/*MODAL BANCO RESPUESTAS*/}
            <Modal 
            show={showModalBancoR}
            size="sm"
            scrollable
            onHide={() => setShowModalBancoR(false)}>
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
                                    setShowModalBancoR(false)
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
            {/*MODAL BANCO PREGUNTAS*/}
            <Modal 
            show={showModalBancoP}
            size="sm"
            scrollable
            onHide={() => setShowModalBancoP(false)}>
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
                                    setShowModalBancoP(false)
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
            {/*MODAL BANCO MATERIAS*/}
            <Modal
            show={showModalBancoM}
            size="sm"
            scrollable
            onHide={() => {setShowModalBancoM(false)}}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Elige una materia de las siguientes opciones:
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {materiasList.map(values => (
                        <div key={values.idMateria}>
                            <ListGroup>
                                <ListGroupItem>
                                    {values.idMateria}. {values.materia}
                                    <br/>
                                    <Button
                                    variant="success"
                                    onClick={() => {
                                        setShowModalBancoM(false)
                                        setMateriaC(values.materia)}}>
                                        <AiOutlineSelect/>
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                        ))
                    }
                </ModalBody>
            </Modal>
            {/*MODAL REGISTRO PREGUNTAS OPCIÓN MÚLTIPLE*/}
            <Modal
            show={showModalOpMul}
            scrollable
            onHide={() => setShowModalOpMul(false)}>
                <ModalHeader>
                    <ModalTitle>
                        Registra las respuestas:
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='alertas'>
                    <Alert 
                    show={showAOpMul}
                    variant={variante}
                    onClose={() => setShowAOpMul(false)}
                    dismissible>
                    <Alert.Heading>
                        {msg}
                    </Alert.Heading>
                    </Alert>
                    </div>
                    {newRespuesta?.map((opcion, index) => (
                        <div key={index} className="services">
                            <div className="first-division">
                            <input
                                name="respuesta"
                                type="text"
                                id="opcion"
                                value={opcion.respuesta}
                                onChange={(e) => handleChangeRespuesta(e, index)}
                            />
                            {newRespuesta.length-1 === index && 
                            (<Button 
                            size="sm"
                            variant="success"
                            onClick={handleAddRespuesta}>
                                <span>Nueva opción</span>
                                <AiOutlinePlus/>
                            </Button>)
                            }
                            <br/>
                            {newRespuesta.length-1 === index && newRespuesta.length > 1 && 
                            (<Button 
                            size="sm"
                            variant="success"
                            onClick={handleValidaInputs}>
                                <span>Guardar registros</span>
                                <AiOutlineSend/>
                            </Button>)
                            }
                            </div>
                            <div className="second-division">
                                {newRespuesta.length > 1 && 
                                (<Button 
                                size="sm"
                                className="remove-btn"
                                variant="danger"
                                onClick={() => handleRemoveRespuesta(index)}>
                                    <AiOutlineDelete/>
                                </Button>)}
                            </div>
                        </div>
                    ))}
                </ModalBody>
            </Modal>
            {/*MODAL CONFIRMACIÓN EDICION RESPUESTA*/}
            <Modal
            show={showModalResEdit}
            size="sm"
            onHide={() => {
                setShowModalRes(true)
                setShowModalResEdit(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificación detectada en el set de respuestas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    El set de respuestas ha sido modificado, deseas cambiar la respuesta en esta pregunta, o aplicar el cambio en todas las preguntas?
                    <Button
                    className='btnAct'
                    variant='success'
                    onClick={editarCrearRespuesta}>
                        Aplicar cambio en esta pregunta
                    </Button>
                    <Button
                    className='btnAct'
                    variant='success'
                    onClick={editarRespuesta}>
                        Aplicar cambio en todas las preguntas
                    </Button>
                </Modal.Body>
            </Modal>
            {/*MODAL CONFIRMACIÓN EDICION PREGUNTA*/}
            <Modal
            show={showModalPregEdit}
            size="sm"
            onHide={() => {setShowModalPregEdit(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificación de pregunta detectada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    La pregunta ha sido moidificada, deseas cambiar la pregunta solo en esta pregunta, o aplicar el cambio en todas las preguntas?
                    <Button
                    className='btnAct'
                    variant='success'
                    onClick={editarCrearPregunta}>
                        Aplicar cambio en esta pregunta
                    </Button>
                    <Button
                    className='btnAct'
                    variant='success'
                    onClick={editarPregunta}>
                        Aplicar cambio en todas las preguntas
                    </Button>
                </Modal.Body>
            </Modal>
            {/*MODAL CERRAR SIN CAMBIOS*/}
            <Modal
            show={showModalCerrar}
            size="sm"
            onHide={() => {setShowModalCerrar(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Cerrar sin cambios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hay cambios en la respuesta sin guardar, deseas cerrar la ventana sin guardar los cambios?
                    <Button
                    className='btnAct'
                    variant='danger'
                    onClick={() => 
                    {setShowModalRes(false)
                    setShowModalCerrar(false)
                    setShowButtonSave(false)}}>
                        Cerrar sin guardar
                    </Button>
                    <Button
                    className='btnAct'
                    variant='success'
                    onClick={() => 
                    {setShowModalCerrar(false)}}>
                        Continuar
                    </Button>
                </Modal.Body>
            </Modal>
            {/* BOTONES INFERIORES */}
            <Button
            className='btnAct'
            onClick={() => {setDetailsPane({isPaneOpen: true})}}>
                Agregar Pregunta<AiOutlinePlus/>
            </Button>
            <Link to={'/CuestionariosAdmin'}>
                <Button
                className='btnAct'>
                    Regresar<AiOutlineRollback/>
                </Button>
            </Link>
            <Button
            className='btnAct'
            variant='danger'
            onClick={() => {setShowMDelete(true)}}>
                Borrar cuestionario<AiOutlineDelete/>
            </Button>
        </div>
    )
}

export default CuestionariosEdicionAdmin;