import { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineLink, AiOutlinePlus, AiOutlineRollback, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
import "./cuestionarios.css"
const GET_PREGUNTAS_URL = "/questionnaires/getquestions"
const GET_RESPUESTAS_URL = "/questionnaires/getanswers"

function CuestionariosAdmin() {
    const [preguntasList, setPreguntasList] = useState([]);
    const [respuestasList, setRespuestasList] = useState([]);

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

    return(
        <div>
            <Card>
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
                                            /* onClick={hola} */>
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
            <Card>
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
                                            /* onClick={hola} */>
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
        </div>
    )
}

export default CuestionariosAdmin;