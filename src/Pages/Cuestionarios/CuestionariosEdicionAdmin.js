import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Offcanvas, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSend } from 'react-icons/ai'
import axios from '../../axios/axios';
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'
const GET_RESPUESTA_URL = '/questionnaires/getanswer'
const EDIT_PREGUNTA_URL = '/questionnaires/editquestion'

function CuestionariosEdicionAdmin() {

    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [idRespuestaEdit, setIdRespuestaEdit] = useState(0);
    const [idPreguntaEdit, setIdPreguntaEdit] = useState(0);
    const [preguntaEdit, setPreguntaEdit] = useState("");
    const [tipoPreguntaEdit, setTipoPreguntaEdit] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showModalRes, setShowModalRes] = useState(false);
    const [showOffEdit, setShowOffEdit] = useState(false);
    const [showA, setShowA] = useState(false);
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

    const editarPregunta = async () => {
        showOffEdit(false)
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

    const handleSetRespuestas = (idres) => {
        getRespuesta(idres)
        setShowModalRes(true)
    }

    return(
        <div>
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
                                    className='open-question'
                                    variant='success'>
                                        Editar<AiOutlineEdit/>
                                    </Button>
                                    <Button
                                    className='open-question'
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
                                <td>{values.pregunta}
                                <Button
                                className='btnEditarPregunta'
                                variant='success'
                                onClick={() => {
                                    setIdPreguntaEdit(values.idPregunta)
                                    setPreguntaEdit(values.pregunta)
                                    setShowOffEdit(true)
                                }}
                                >
                                    Editar<AiOutlineEdit/>
                                </Button></td>
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
                <Offcanvas 
                    show={showOffEdit} 
                    placement={'bottom'} 
                    onHide={() => setShowOffEdit(false)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Nuevo hito</Offcanvas.Title>
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
                            setShowOffEdit(false)
                            setPreguntaEdit('')}}>
                            Cerrar
                        </Button>
                        <Button size='sm' variant="success" onClick={editarPregunta}>
                            Guardar
                        </Button>
                    </Offcanvas.Body>
                </Offcanvas>
                <Button
                className='btnEditarRespuesta'>
                    Agregar Pregunta<AiOutlinePlus/>
                </Button>
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