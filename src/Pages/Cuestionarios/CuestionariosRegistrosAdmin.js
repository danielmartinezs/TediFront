import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, ListGroup, ListGroupItem, Modal, Offcanvas, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineLink, AiOutlinePlus, AiOutlineRollback, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
import "./cuestionarios.css"
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const GET_RESPUESTA_URL = '/questionnaires/getanswer'
const EDIT_PREGUNTA_URL = '/questionnaires/editquestion'
const EDIT_RESPUESTA_URL = '/questionnaires/editanswer'
const CHECK_LINK_ANSWER = "/questionnaires/checklinkanswer"
const CHECK_LINK_QUESTION = "/questionnaires/checklinkquestion"

function CuestionariosRegistrosAdmin() {
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [preguntasLink, setPreguntasLink] = useState([]);
    const [respuestasLink, setRespuestasLink] = useState([]);
    const [respuestasEdit, setRespuestasEdit] = useState([]);
    const [idCheck, setIdCheck] = useState(0);
    const [idPreguntaEdit, setIdPreguntaEdit] = useState(0);
    const [idRespuestaEdit, setIdRespuestaEdit] = useState(0);
    const [cambioRespuesta, setCambioRespuesta] = useState(0);
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [respuestaEdit, setRespuestaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showButtonSave, setShowButtonSave] = useState(false);
    const [showModalCerrar, setShowModalCerrar] = useState(false);
    const [showModalRes, setShowModalRes] = useState(false);
    const [showModalResEdit, setShowModalResEdit] = useState(false);
    const [showModalLinkA, setShowModalLinkA] = useState(false);
    const [showModalLinkQ, setShowModalLinkQ] = useState(false);
    const [showOffEditP, setShowOffEditP] = useState(false);
    const [showOffEditR, setShowOffEditR] = useState(false);
    const [showA, setShowA] = useState(false);

    useEffect (() => {
        getPreguntas()
        getRespuestas()
    }, [])

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

    const deleteRespuesta = () => {

    }

    const checkLinkA = (ida) => {
        console.log("el idcheck es: "+ida)
        axios.get(CHECK_LINK_ANSWER+"/"+ida).then((response) => {
            setRespuestasLink(response.data)
        })
        setShowModalLinkA(true)
    }

    const checkLinkQ = (idq) => {
        console.log("el idcheck es: "+idq)
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
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntasList.map((question) => {
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
                                            /* onClick={hola} */>
                                            <AiOutlineDelete />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-info"
                                            onClick={() => {handleCheckLinks(question.idPregunta, 0)}}>
                                            <AiOutlineLink />
                                            </Button></td>
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
                                <th>Link</th>
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
                                            /* onClick={hola} */>
                                            <AiOutlineDelete />
                                            </Button></td>
                                        <td><Button
                                            variant="outline-info"
                                            onClick={() => {handleCheckLinks(0, answer.id)}}>
                                            <AiOutlineLink />
                                            </Button></td>
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
            {/* MODAL CHECK LINK ANSWER */}
            <Modal
            show={showModalLinkA}
            onHide={() => {setShowModalLinkA(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Check Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!respuestasLink.length ? 
                        <div>
                            <Alert
                            variant='danger'>
                                <Alert.Heading>La respuesta actualmente no se encuentra ligada a una pregunta, ¿deseas borrarala?</Alert.Heading>
                            </Alert>
                            <Button
                            variant='danger'
                            onClick={deleteRespuesta}>
                                Borrar respuesta
                                <AiOutlineDelete/>
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
            onHide={() => {setShowModalLinkQ(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Check Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!preguntasLink.length ?
                        <div>
                            <Alert
                            variant='danger'>
                                <Alert.Heading>La pregunta actualmente no se encuentra ligada a un cuestionario, ¿deseas borrarla?</Alert.Heading>
                            </Alert>
                            <Button
                            variant='danger'
                            onClick={deleteRespuesta}>
                                Borrar pregunta
                                <AiOutlineDelete/>
                            </Button>
                        </div>:
                        preguntasLink.map((question) => {
                            return(
                                <div key={question.id}>
                                    <ListGroup>
                                        <ListGroupItem>Ligada a la respuesta "{question.opciones}" en el cuestionario:<br/> {question.idCuestionario}. "{question.nombre}"</ListGroupItem>
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
            {/* OFFCANVASEDITAR RESPUESTA*/}
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
            <Link to={'/CuestionariosCreacionAdmin'}>
                    <Button
                    className='btnAct'>
                        Regresar<AiOutlineRollback/>
                    </Button>
             </Link>
        </div>
    )
}

export default CuestionariosRegistrosAdmin;