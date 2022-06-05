import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineRollback, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
import { Question } from 'survey-core';
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const GET_RESPUESTA_URL = '/questionnaires/getanswer'
const EDIT_PREGUNTA_URL = '/questionnaires/editquestion'
const EDIT_CREATE_PREGUNTA_URL = '/questionnaires/editcreatequestion'
const EDIT_RESPUESTA_URL = '/questionnaires/editanswer'
const EDIT_CREATE_RESPUESTA_URL = '/questionnaires/editcreateanswer'
const DELETE_PREGUNTA_URL = '/questionnaires/deletequestionnaire'
const NEW_PREGUNTA_URL = '/questionnaires/addquestion'

function CuestionariosEdicionAdmin() {

    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [newRespuesta, setNewRespuesta] = useState([{ "respuesta": "" }]);
    const [newRespuestaFormatted, setNewRespuestaFormatted] = useState("{\"opciones\":[{\"respuesta\":\"\"}]}");
    const [respuestaEdit, setRespuestaEdit] = useState();
    const [idRespuestaEdit, setIdRespuestaEdit] = useState(0);
    const [cambioRespuesta, setCambioRespuesta] = useState(0);
    const [idPreguntaEdit, setIdPreguntaEdit] = useState(0);
    const [newPregunta, setNewPregunta] = useState("");
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [tipoNewPregunta, setTipoNewPregunta] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showButtonSave, setShowButtonSave] = useState(false);
    const [showMDelete, setShowMDelete] = useState(false);
    const [showModalRes, setShowModalRes] = useState(false);
    const [showModalCerrar, setShowModalCerrar] = useState(false);
    const [showModalResEdit, setShowModalResEdit] = useState(false);
    const [showModalPregEdit, setShowModalPregEdit] = useState(false);
    const [showModalAddPreg, setShowModalAddPreg] = useState(false);
    const [showOffEditR, setShowOffEditR] = useState(false);
    const [showOffEditP, setShowOffEditP] = useState(false);
    const [showA, setShowA] = useState(false);
    const {idCuestionario} = useParams();

    useEffect (() => {
        getQuestionnaireDetails()
    }, [])

    /* useEffect (() => {
        console.log(newRespuesta)
    }, [newRespuesta]) */

    const getQuestionnaireDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+idCuestionario).then((response) => {
            setCuestionariosInfo(response.data)
        })
    }

    const getRespuesta = (idres) => {
        axios.get(GET_RESPUESTA_URL+"/"+idres).then((response) => {
            setRespuestas(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
            setRespuestasEdit(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
        })
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
            getQuestionnaireDetails()
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
        setShowModalAddPreg(false)
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
            getQuestionnaireDetails()
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
            getQuestionnaireDetails()
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
        setShowModalAddPreg(false)
        let newres = ""
        if(tipoNewPregunta === "Opción múltiple"){
            newres = JSON.stringify(newRespuesta)
        }
        else{
            newres = newRespuestaFormatted
        }
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
            //getQuestionnaireDetails()
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

    const handleDeleteCuestionario = async () => {
        const response = await axios.post(DELETE_PREGUNTA_URL+"/"+idCuestionario)
        setShowA(true)
        setVariante('success')
        setMsg(response.data.message)
        setShowMDelete(false)
        //navigate
    }

    const handleEditRespuesta = () => {
        respuestasEdit.opciones[cambioRespuesta].respuesta = respuestaEdit
        console.log(JSON.stringify(respuestasEdit))
        setShowButtonSave(true)
        setShowOffEditR(false)
        setShowModalRes(true)
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
        if(!isNaN(value)){
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
    }

    const handleCloseWithoutSave = () => {
        if(!showButtonSave){
            setShowModalRes(false)
        }
        else{
            setShowModalCerrar(true)
        }
    }

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
            <div className="text-center">
                <h3>{cuestionariosInfo[0]?.nombre}</h3>
            </div>
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
                                        <Button
                                        className='btnEdicion'
                                        variant='success'
                                        onClick={() => {
                                            setRespuestaEdit(values.respuesta)
                                            setCambioRespuesta(index)
                                            setShowModalRes(false)
                                            setShowOffEditR(true)
                                        }}>
                                            <AiOutlineEdit/>
                                        </Button>
                                        <Button
                                        className='btnEdicion'
                                        variant='danger'>
                                            <AiOutlineDelete/>
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    ))
                    }
                    {showButtonSave === true?
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
                    :<br/>}
                    </div>}
                </ModalBody>
            </Modal>
                <Table className="tabla">
                    <thead>
                        <th>
                        Pregunta
                        </th>
                        <th>
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
                                <td>{values.pregunta}</td>
                                <td>
                                <Button
                                className='btnEditarPregunta'
                                variant='success'
                                onClick={() => {
                                    setIdPreguntaEdit(values.idPregunta)
                                    setPreguntaEdit(values.pregunta)
                                    setTipoPreguntaEdit(values.tipo)
                                    setIdRespuestaEdit(values.idRespuesta)
                                    setShowOffEditP(true)
                                }}
                                >
                                    <AiOutlineEdit/>
                                </Button></td>
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
                {/*EDITAR PREGUNTA*/}
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
                                controlId="newHito"
                                >
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
                {/*EDITAR RESPUESTA*/}
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
                                controlId="newHito"
                                >
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
                {/*MODAL AGREGAR PREGUNTA*/}
                <Modal
                scrollable
                show={showModalAddPreg}
                onHide={() => {setShowModalAddPreg(false)}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Pregunta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form 
                        className='form'
                        onSubmit={handleSubmitNewPregunta}>
                            <Form.Group
                            className="mb-3"
                            controlId="newHito">
                                <Form.Label>Pregunta</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                as="textarea"
                                rows={3}
                                maxLength="250"
                                value={newPregunta}
                                onChange={(e) => setNewPregunta(e.target.value)}>
                                    {newPregunta}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo de pregunta</Form.Label>
                                <br/>
                                <Form.Label>{tipoNewPregunta}</Form.Label>
                                    <br/>
                                    <ButtonGroup>
                                        <Button 
                                        className="btnBancoPreguntas" 
                                        value="Opción múltiple" 
                                        onClick={(e) => setTipoNewPregunta(e.target.value)}>
                                            Opción múltiple
                                        </Button>
                                        <Button 
                                        className="btnBancoPreguntas" 
                                        value="Abierta" 
                                        onClick={(e) => setTipoNewPregunta(e.target.value)}>
                                            Abierta
                                        </Button>
                                    </ButtonGroup>
                            </Form.Group>
                            {tipoNewPregunta === 'Opción múltiple' ?
                            <Form.Group>
                                <Form.Label>Opciones</Form.Label>
                                <br/>
                                <Form.Control
                                disabled
                                placeholder='Escribe los registros de opción múltiple debajo'/>
                                {newRespuesta.map((opcion, index) => (
                                <div key={index} 
                                className="services">
                                    <div className="first-division">
                                    <input
                                        name="respuesta"
                                        type="text"
                                        id="opcion"
                                        value={opcion.opciones}
                                        onChange={(e) => handleChangeRespuesta(e, index)}
                                    />
                                    {newRespuesta.length-1 === index && 
                                    (<Button 
                                    size="sm"
                                    className="add-btn"
                                    variant="success"
                                    onClick={handleAddRespuesta}>
                                        <span>Nueva opción</span>
                                    </Button>)
                                    }
                                    <br/>
                                    {newRespuesta.length-1 === index && 
                                    (<Button 
                                    size="sm"
                                    className="add-btn"
                                    variant="success"
                                    onClick={formatRespuesta}>
                                        <span>Guardar registros</span>
                                    </Button>)
                                    }
                                    </div>
                                    <div className="second-division">
                                        {newRespuesta.length > 1 && 
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
                            </Form.Group>:<br/>}
                            <Button
                            className='button-edit'
                            type='submit'
                            onSubmit={handleSubmitNewPregunta}>
                                Registrar pregunta
                                <AiOutlineSend/>
                            </Button>
                        </Form>
                    </Modal.Body>
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
                onClick={() => {setShowModalAddPreg(true)}}>
                    Agregar Pregunta<AiOutlinePlus/>
                </Button>
                <Link to={'/CuestionariosCreacionAdmin'}>
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