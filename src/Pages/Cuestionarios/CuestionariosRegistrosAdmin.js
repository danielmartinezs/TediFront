import { useEffect, useState } from 'react';
import { Alert, Button, Card, ListGroup, ListGroupItem, Modal, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineLink, AiOutlinePlus, AiOutlineRollback, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
import "./cuestionarios.css"
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"
const CHECK_LINK_ANSWER = "/questionnaires/checklinkanswer"
const CHECK_LINK_QUESTION = "/questionnaires/checklinkquestion"

function CuestionariosRegistrosAdmin() {
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);
    const [preguntasLink, setPreguntasLink] = useState([]);
    const [respuestasLink, setRespuestasLink] = useState([]);
    const [idCheck, setIdCheck] = useState(0);
    const [showModalLinkA, setShowModalLinkA] = useState(false);
    const [showModalLinkQ, setShowModalLinkQ] = useState(false);

    useEffect (() => {
        getPreguntas()
        getRespuestas()
    }, [])

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

    return(
        <div>
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
                                            /* onClick={hola} */>
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
                                            /* onClick={hola} */>
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
        </div>
    )
}

export default CuestionariosRegistrosAdmin;