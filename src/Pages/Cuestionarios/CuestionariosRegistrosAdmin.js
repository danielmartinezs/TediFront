import { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, Offcanvas, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiOutlineClose, AiOutlineDelete, AiOutlineEdit, AiOutlineLink, AiOutlinePlus, AiOutlineRollback, AiOutlineSend, AiOutlineVerticalAlignBottom, AiOutlineVerticalAlignTop } from 'react-icons/ai'
import { BiMessageAltAdd } from 'react-icons/bi'
import axios from '../../axios/axios';
import "./cuestionarios.css"
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const GET_RESPUESTA_URL = '/questionnaires/getanswer'
const GET_LINK_ANSWERS_URL = '/questionnaires/checklinkanswers'
const GET_LINK_QUESTIONS_URL = '/questionnaires/checklinkquestions'
const EDIT_PREGUNTA_URL = '/questionnaires/editquestion'
const EDIT_RESPUESTA_URL = '/questionnaires/editanswer'
const DELETE_PREGUNTA_URL = '/questionnaires/borraquestion'
const DELETE_RESPUESTA_URL = '/questionnaires/borraanswer'
const CHECK_LINK_ANSWER = "/questionnaires/checklinkanswer"
const CHECK_LINK_QUESTION = "/questionnaires/checklinkquestion"

function CuestionariosRegistrosAdmin() {
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [preguntasLink, setPreguntasLink] = useState([]);
    const [respuestasLink, setRespuestasLink] = useState([]);
    const [preguntasEnUso, setPreguntasEnUso] = useState([]);
    const [respuestasEnUso, setRespuestasEnUso] = useState([]);
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [respuestaEditAdd, setRespuestaEditAdd] = useState();
    const [recentlyRemovedRes, setRecentlyRemovedRes] = useState();
    const [idCheck, setIdCheck] = useState(0);
    const [idPreguntaEdit, setIdPreguntaEdit] = useState(0);
    const [idRespuestaEdit, setIdRespuestaEdit] = useState(0);
    const [cambioRespuesta, setCambioRespuesta] = useState(0);
    const [idDeletePregunta, setIdDeletePregunta] = useState(0);
    const [idDeleteRespuesta, setIdDeleteRespuesta] = useState(0);
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [respuestaEdit, setRespuestaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showButtonSave, setShowButtonSave] = useState(false);
    const [showButtonUndo, setShowButtonUndo] = useState(false);
    const [showModalCerrar, setShowModalCerrar] = useState(false);
    const [showModalBorrarP, setShowModalBorrarP] = useState(false);
    const [showModalBorrarR, setShowModalBorrarR] = useState(false);
    const [showModalRes, setShowModalRes] = useState(false);
    const [showModalResEdit, setShowModalResEdit] = useState(false);
    const [showModalLinkA, setShowModalLinkA] = useState(false);
    const [showModalLinkQ, setShowModalLinkQ] = useState(false);
    const [showOffEditP, setShowOffEditP] = useState(false);
    const [showOffEditR, setShowOffEditR] = useState(false);
    const [showOffAddR, setShowOffAddR] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showADelResp, setShowADelResp] = useState(false);

    useLayoutEffect (() => {
        getPreguntas()
        getRespuestas()
        getQuestionsLink()
        getAnswersLink()
    }, [])

    useEffect (() => {
        getPreguntas()
        getRespuestas()
    }, [showA])

    const scrollToTop = () => {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
    };

    const handleCloseWithoutSave = () => {
        if(!showButtonSave){
            setShowModalRes(false)
        }
        else{
            setShowModalCerrar(true)
        }
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

    const getQuestionsLink = () => {
        axios.get(GET_LINK_QUESTIONS_URL).then((response) => {
            console.log(response.data)
            setPreguntasEnUso(response.data)
        })
    }
    
    const getAnswersLink = () => {
        axios.get(GET_LINK_ANSWERS_URL).then((response) => {
            setRespuestasEnUso(response.data)
        })
    }

    const getRespuesta = (idres) => {
        axios.get(GET_RESPUESTA_URL+"/"+idres).then((response) => {
            setRespuestasEdit(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
        })
    }

    const editarRespuesta = async () => {
        setShowOffEditR(false)
        setShowModalRes(false)
        setShowModalResEdit(false)
        console.log(JSON.stringify(respuestasEdit))
        try{
        const response = await axios.post(EDIT_RESPUESTA_URL, {
            idr: idRespuestaEdit,
            opciones: JSON.stringify(respuestasEdit)
        })
        if(response.status === 200){
            console.log(response)
            scrollToTop()
            getRespuestas()
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

    const editarPregunta = async () => {
        setShowOffEditP(false)
        try{
        const response = await axios.post(EDIT_PREGUNTA_URL, {
            idp: idPreguntaEdit,
            pregunta: preguntaEdit
        })
        if(response.status === 200){
            scrollToTop()
            getPreguntas()
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

    const deleteRespuesta = async () => {
        setShowModalBorrarR(false)
        setShowModalLinkA(false)
        console.log("ID RESPUESTA A BORRAR: "+idDeleteRespuesta)
        const response = await axios.post(DELETE_RESPUESTA_URL+"/"+idDeleteRespuesta)
        setShowA(true)
        setVariante('danger')
        setMsg(response.data.message)
        setIdDeleteRespuesta(0)
        scrollToTop()
        getRespuestas()
    }

    const deletePregunta = async () => {
        setShowModalBorrarP(false)
        setShowModalLinkQ(false)
        console.log("ID PREGUNTA A BORRAR: "+idDeletePregunta)
        const response = await axios.post(DELETE_PREGUNTA_URL+"/"+idDeletePregunta)
        setShowA(true)
        setVariante('danger')
        setMsg(response.data.message)
        setIdDeletePregunta(0)
        scrollToTop()
        getPreguntas()
    }

    const checkLinkA = (ida) => {
        //console.log("el idcheck es: "+ida)
        axios.get(CHECK_LINK_ANSWER+"/"+ida).then((response) => {
            setRespuestasLink(response.data)
        })
        setShowModalLinkA(true)
    }

    const checkLinkQ = (idq) => {
        //console.log("el idcheck es: "+idq)
        axios.get(CHECK_LINK_QUESTION+"/"+idq).then((response) => {
            setPreguntasLink(response.data)
        })
        setShowModalLinkQ(true)
    }

    const handleCheckLinks = (idq, ida) => {
        console.log("idq-"+idq+" ida- "+ida)
        if(idq === 0 && ida !== 0){
            checkLinkA(ida)
        }
        else{
            checkLinkQ(idq)
        }
    }

    const handleCheckUsoQ = (id) => {
        let usado = false;
        const idpreguntas = [];
        for(let i = 0; i < preguntasEnUso.length; i++){
            idpreguntas.push(preguntasEnUso[i].idPregunta)
        }
        console.log(idpreguntas)
        for(let i = 0; i < preguntasEnUso.length; i++){
            if(idpreguntas[i] === id){
                console.log("esta en uso")
                usado = true;
                break;
            }
        }
        return usado;
    }

    const handleCheckUsoA = (id) => {
        let usado = false;
        const idrespuestas = [];
        for(let i = 0; i < respuestasEnUso.length; i++){
            idrespuestas.push(respuestasEnUso[i].idRespuesta)
        }
        console.log(idrespuestas)
        for(let i = 0; i < respuestasEnUso.length; i++){
            if(idrespuestas[i] === id){
                console.log("esta en uso")
                usado = true;
                break;
            }
        }
        return usado;
    }

    const handleSetRespuestas = (idres) => {
        getRespuesta(idres)
        console.log("El id de la respuesta es"+idres)
        setShowModalRes(true)
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
        setVariante('success')
        setMsg("Se agregó la opción")
        setRespuestaEditAdd("")
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
            {/*TABLA PREGUNTAS*/}
            <Card className="text-center" style={{ display:'flex'}}>
                <Card.Header>
                    <Card.Title>Preguntas</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div>
                        <Table 
                        className='tabla'
                        striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pregunta</th>
                                <th>Tipo</th>
                                <th>Editar</th>
                                <th>Borrar</th>
                                <th>Vincular</th>
                                <th>En uso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntasList.map((question, index) => {
                                return(
                                    <tr key={question.id}>
                                        <td>{question.idPregunta}</td>
                                        <td>{question.pregunta}</td>
                                        <td>{question.tipo}</td>
                                        <td><Button
                                            variant="outline-success"
                                            onClick={() => {
                                                setIdPreguntaEdit(question.idPregunta)
                                                setPreguntaEdit(question.pregunta)
                                                setShowOffEditP(true)
                                            }}>
                                            <AiOutlineEdit />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                setIdDeletePregunta(question.idPregunta)
                                                setShowModalBorrarP(true)}}>
                                            <AiOutlineDelete />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setIdDeletePregunta(question.idPregunta)
                                                handleCheckLinks(question.idPregunta, 0)}}>
                                            <AiOutlineLink />
                                            </Button>
                                        </td>
                                        <td>
                                            {handleCheckUsoQ(question.idPregunta) ? <AiOutlineCheck size='2em' color='green'/> : <AiOutlineClose size='2em' color='red'/>}
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            {/*TABLA RESPUESTAS*/}
            <Card className="text-center" style={{ display:'flex'}}>
                <Card.Header>
                    <Card.Title>Respuestas</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div>
                    <Table 
                    className='tabla'
                    striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Respuesta</th>
                                <th>Editar</th>
                                <th>Borrar</th>
                                <th>Vincular</th>
                                <th>En uso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {respuestasList.map((answer) => {
                                return(
                                    <tr key={answer.id}>
                                        <td>{answer.id}</td>
                                        <td>{answer.opciones}</td>
                                        <td><Button
                                            variant="outline-success"
                                            onClick={() => {
                                                setIdRespuestaEdit(answer.id)
                                                handleSetRespuestas(answer.id)
                                            }}>
                                            <AiOutlineEdit />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                setIdDeleteRespuesta(answer.id)
                                                setShowModalBorrarR(true)}}>
                                            <AiOutlineDelete />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setIdDeleteRespuesta(answer.id)
                                                handleCheckLinks(0, answer.id)}}>
                                            <AiOutlineLink />
                                            </Button>
                                        </td>
                                        <td>
                                            {handleCheckUsoA(answer.id) ? <AiOutlineCheck size='2em' color='green'/> : <AiOutlineClose size='2em' color='red'/>}
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </Table>
                    </div>
                </Card.Body>
            </Card>
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
            {/*MODAL CONFIRMACIÓN BORRAR PREGUNTA*/}
            <Modal 
            show={showModalBorrarP} 
            onHide={() => {setShowModalBorrarP(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar esta pregunta?</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Una vez borrado el registro y sus relaciones serán borradas</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {setShowModalBorrarP(false)}}>
                        No
                    </Button>
                    <Button variant="danger" onClick={deletePregunta}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*MODAL CONFIRMACIÓN BORRAR RESPUESTA*/}
            <Modal
            show={showModalBorrarR}
            onHide={() => {setShowModalBorrarR(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar esta respuesta?</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Una vez borrada la respuesta, no se mostrará los cuestionario en las que forma parte</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {setShowModalBorrarR(false)}}>
                        No
                    </Button>
                    <Button variant="danger" onClick={deleteRespuesta}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* MODAL CHECK LINK ANSWER */}
            <Modal
            show={showModalLinkA}
            onHide={() => {
                setIdDeleteRespuesta(0)
                setShowModalLinkA(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Check Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {console.log("El idDelRes es"+idDeleteRespuesta)}
                    {!respuestasLink.length ? 
                        <div>
                            <Alert
                            variant='danger'>
                                <Alert.Heading>La respuesta actualmente no se encuentra ligada a un cuestionario, ¿deseas borrarala  o vnicularla a un cuestionario?</Alert.Heading>
                            </Alert>
                            <Button
                            variant='danger'
                            onClick={deleteRespuesta}>
                                Borrar respuesta
                                <AiOutlineDelete/>
                            </Button>
                            <Button
                            variant='success'
                            onClick={() => {setShowModalLinkA(false)}}>
                                Vincular respuesta con pregunta
                                <AiOutlineLink/>
                            </Button>
                        </div>:
                        respuestasLink.map((answer) => {
                            return(
                                <div key={answer.id}>
                                    <ListGroup>
                                        <ListGroup.Item>Ligada a la pregunta "{answer.pregunta}" en el cuestionario:<br/> {answer.idCuestionario}. "{answer.nombre}"</ListGroup.Item>
                                    </ListGroup>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
            {/* MODAL CHECK LINK QUESTION */}
            <Modal
            show={showModalLinkQ}
            onHide={() => {
                setIdDeletePregunta(0)
                setShowModalLinkQ(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Check Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {console.log("El id DelPre es"+idDeletePregunta)}
                    {!preguntasLink.length ?
                        <div>
                            <Alert
                            variant='danger'>
                                <Alert.Heading>La pregunta actualmente no se encuentra ligada a un cuestionario, ¿deseas borrarla?</Alert.Heading>
                            </Alert>
                            <Button
                            variant='danger'
                            onClick={deletePregunta}>
                                Borrar pregunta
                                <AiOutlineDelete/>
                            </Button>
                            <Button
                            variant='success'
                            onClick={() => {setShowModalLinkA(false)}}>
                                Vincular pregunta con respuesta
                                <AiOutlineLink/>
                            </Button>
                        </div>:
                        preguntasLink.map((question) => {
                            return(
                                <div key={question.id}>
                                    <ListGroup>
                                        <ListGroupItem>Ligada a la respuesta del cuestionario:<br/> {question.idCuestionario}. "{question.nombre}"</ListGroupItem>
                                    </ListGroup>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
            {/* OFFCANVAS EDIT QUESTION */}
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
                            <Form.Label>La edición de la pregunta se verá reflejada en todos los cuestionarios a los que se encuentra ligada</Form.Label>
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
                    onClick={editarPregunta}>
                        Guardar
                    </Button>
                </Offcanvas.Body>
            </Offcanvas>
            {/* MODAL EDICION RESPUESTAS */}
            <Modal
            show={showModalRes}
            onHide={handleCloseWithoutSave}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Set de Respuestas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='alertas'>
                        <Alert 
                        show={showADelResp}
                        variant={variante}
                        onClose={() => setShowADelResp(false)}
                        dismissible>
                        <Alert.Heading>
                            {msg}
                            {showButtonUndo?
                            <Button
                            variant="outline-warning"
                            className='btnEditarPregunta'
                            onClick={handleUndoRemove}>
                                Cancelar
                            </Button>:<div/>}
                        </Alert.Heading>
                        </Alert>
                    </div>
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
                                        variant='danger'
                                        onClick={() => {handleEditRemove(index)}}>
                                            <AiOutlineDelete/>
                                        </Button>
                                        <Button
                                        className='btnEdicion'
                                        variant='warning'
                                        onClick={() => {
                                            setCambioRespuesta(index)
                                            setShowModalRes(false)
                                            setShowOffAddR(true)}}>
                                            <BiMessageAltAdd/>
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                        ))}
                        {showButtonSave === true?
                        <div>
                            <Button
                            className='btnAct'
                            onClick={editarRespuesta}>
                                Guardar Cambios
                                <AiOutlineSend/>
                            </Button>
                        </div> 
                        :<br/>}
                    </div>
                </Modal.Body>
            </Modal>
            {/* OFFCANVAS EDITAR RESPUESTA*/}
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
            {/*OFFCANVAS AÑADIR RESPUESTA*/}
            <Offcanvas 
                show={showOffAddR} 
                placement={'end'} 
                onHide={() => setShowOffAddR(false)}>
                <Offcanvas.Header closeButton>
                     <Offcanvas.Title>Añadir Respuesta</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
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
                            onChange={(e) => setRespuestaEditAdd(e.target.value)}>
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
                </Offcanvas.Body>
            </Offcanvas>
            <Link to={'/CuestionariosAdmin'}>
                    <Button
                    className='btnAct'>
                        Regresar<AiOutlineRollback/>
                    </Button>
             </Link>
        </div>
    )
}

export default CuestionariosRegistrosAdmin;