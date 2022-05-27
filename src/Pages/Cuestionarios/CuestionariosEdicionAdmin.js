import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const GET_RESPUESTA_URL = '/questionnaires/getanswer'

function CuestionariosEdicionAdmin() {

    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [idRespuesta, setIdRespuesta] = useState(0);
    const [showModalRes, setShowModalRes] = useState(false);
    const {idCuestionario} = useParams();

    useEffect (() => {
        getQuestionnaireDetails()
    }, [])

    const getQuestionnaireDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+idCuestionario).then((response) => {
            setCuestionariosInfo(response.data)
        })
    }

    const getRespuesta = (idres) => {
        axios.get(GET_RESPUESTA_URL+"/"+idres).then((response) => {
            console.log(response.data[0].opciones)
            setRespuestas(JSON.parse(JSON.parse(JSON.stringify(response.data[0].opciones))))
        })
    }

    const handleSetRespuestas = (idres) => {
        getRespuesta(idres)
        setShowModalRes(true)
    }

    return(
        <div>
            <h3>{cuestionariosInfo[0]?.nombre}</h3>
            <Modal
            show={showModalRes}
            onHide={() => {setShowModalRes(false)}}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Set de Respuestas
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {console.log("setR"+(respuestas.opciones))}
                    {respuestas.opciones?.map(values => (
                        <div 
                        key={values}>
                            <ListGroup className='displaySetRespuestas'>
                                <ListGroupItem className='setRespuestas'>
                                    {(values.respuesta)}
                                    <Button
                                    className
                                    variant='success'>
                                        Editar<AiOutlineEdit/>
                                    </Button>
                                    <Button
                                    className
                                    variant='danger'>
                                        Borrar<AiOutlineDelete/>
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    ))
                    }
                </ModalBody>
            </Modal>
                <Table>
                    <thead>
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
                                <td>{values.pregunta}</td>
                                <td>{values.tipo}</td>
                                <td><Button
                                    onClick={() => {handleSetRespuestas(values.idRespuesta)}}
                                    variant='success'>
                                        Visualizar respuestas
                                    </Button></td>
                                {/* <td>{JSON.stringify(values.opciones)}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button
                className='btnEditarRespuesta'>
                    Guardar cambios<AiOutlineSend/>
                </Button>
                <Button
                className='btnEditarRespuesta'
                variant='danger'>
                    Borrar cuestionario<AiOutlineDelete/>
                </Button>
        </div>
    )
}

export default CuestionariosEdicionAdmin;