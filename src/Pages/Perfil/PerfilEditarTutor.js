import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';
import "./perfil.css"
const GET_TUTORES_URL = '/profiles/gettutores'
const EDIT_TUTOR_URL = '/profiles/editatutor'
const DELETE_TUTOR_URL = 'profiles/borratutor'

function PerfilEditarTutor() {
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showModalBorrar, setShowModalBorrar] = useState(false);
    const [tutoresList, setTutoresList] = useState([]);
    const [tutoresSearch, setTutoresSearch] = useState([]);
    const [busqueda, setBusqueda] = useState("")
    const [nombre, setNombre] = useState("");
    const [llave, setLlave] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [contrasenia, setContrasenia] = useState("");
    const [confpassword, setConfPassword] = useState("");
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});
    const tutoresPerPage = 9;
    const pageVisisted = pageNumber * tutoresPerPage;
    const pageCount = Math.ceil(tutoresList.length / tutoresPerPage);
    const [tutoresPag, setTutoresPag] = useState([]);
    
    useEffect (() => {
        getTutores()
    }, [detailsPane])

    const getTutores = () => {
        axios.get(GET_TUTORES_URL).then((response) => {
            setTutoresList(response.data)
            setTutoresPag((response.data).slice(pageVisisted, pageVisisted + tutoresPerPage))
        })
    }

    const openPane = (values) => {
        console.log(values)
        setDetailsPane({isPaneOpen: true});
        setLlave(values.idTutor);
        console.log(llave)
    }

    const closePane = () => {
        setDetailsPane({isPaneOpen: false});
        setNombre("");
        setContrasenia("");
        setConfPassword("");
    }

    const handleSubmitEditTutor = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(EDIT_TUTOR_URL, {
                idtut: llave,
                nombretut: nombre,
                password: contrasenia,
                confpassword: confpassword
            })
          if(response.status === 200){
              console.log(response)
              setShowA(true)
              setVariante('success')
              setMsg(response.data.message)
              setNombre("")
              setContrasenia("")
              setConfPassword("")
              setDetailsPane({isPaneOpen: false});
          }
        }catch(error){
          setShowA(true)
          console.log(error)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          } else if(error.response?.status === 401){
            setMsg('Usuario sin autorización');
            setVariante('danger');
          } else if(error.response?.status === 403){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
          console.log(msg)
        }
    }

    const handleDelete = async (llave) => {
        console.log(llave)
        const response = await axios.post(DELETE_TUTOR_URL+"/"+llave)
        setShowA(true)
        setVariante('success')
        setMsg(response.data.message)
        setDetailsPane({isPaneOpen: false})
        setShowModalBorrar(false)
    }

    const filtrar = (terminoBusqueda) => {
        console.log("El termino es "+terminoBusqueda)
        var resultadosBusqueda = tutoresList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                return;
            }
            else if(elemento.usuario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        if(terminoBusqueda === ""){
            setTutoresPag((tutoresList).slice(0, 0 + tutoresPerPage))
        }
        else{
            setTutoresPag(resultadosBusqueda);
        }
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const onPageChange = ({ selected }) => {
        setPageNumber(selected);
        setTutoresPag((tutoresList).slice(selected * tutoresPerPage, selected * tutoresPerPage + tutoresPerPage));
    }

    return (
        <div className='text-center'>
            <h1>Edición de tutores</h1>
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
            <div>
                <div className="containerInput">
                <input
                    className="inputBuscar"
                    value={busqueda}
                    placeholder="Buscar Tutor"
                    maxLength="100"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
            <Container>
                <Row>
                    {tutoresPag && tutoresPag.map(values => (
                    <div
                    className='col-md-4 col-sm-12'
                    key={values.idTutor}>
                        <Col>
                            <Card
                            className='text-center'
                            border='warning'
                            style={{width: '100%'}}>
                                <Card.Header>
                                    <Card.Title>{values.usuario}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Tutor de: {values.nombre}
                                    </Card.Text>
                                    <Button
                                    className='btnBancoPreguntas'
                                    onClick={() => {openPane(values)}}>
                                        Editar información
                                        <AiOutlineEdit/>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                    )
                )}
                </Row>
            </Container>
            <br/>
            {busqueda === "" &&
            <ReactPaginate
            previousLabel={'Anterior'}
            nextLabel={'Siguiente'}
            pageCount={pageCount}
            onPageChange={onPageChange}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtns"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}/>
            }
            {/*SLIDING PANE EDITAR INFO TUTOR */}
            <SlidingPane
            className='sliding-pane'
            isOpen={detailsPane.isPaneOpen}
            title={tutoresList[llave-1]?.usuario}
            width={window.innerWidth < 600 ? "100%" : "500px"}
            onRequestClose={closePane}>
                <div className='admin-details__info'>
                    <div className='admin-details__box'>
                    <Form 
                        className="form"
                        onSubmit={handleSubmitEditTutor}>
                             <h3>Editar información</h3>
                        <Form.Group controlId="nombreadmin">
                            <Form.Label>Nombre del tutor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={tutoresList[llave-1]?.usuario}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Escriba la contraseña"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="confirmpassword">
                            <Form.Label>Repetir Contraseña</Form.Label>
                            <Form.Control
                            type="password"
                            placeholder="Escriba la contraseña"
                            value={confpassword}
                            onChange={(e) => setConfPassword(e.target.value)}/>
                        </Form.Group>
                        <br/>
                        <Button
                        className='button-edit'
                        type='submit'
                        onSubmit={handleSubmitEditTutor}>
                            Editar
                            <AiOutlineEdit size='2em'/>
                        </Button>
                    </Form>
                </div>
                <button 
                className='button-delete'
                onClick={() => {setShowModalBorrar(true)}}>
                    Borrar  <AiOutlineDelete size='2em' />
                </button>
            </div>
        </SlidingPane>
        {/*MODAL CONFIRMACIÓN BORRAR */}
        <Modal show={showModalBorrar} onHide={() => {setShowModalBorrar(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>¿Estás seguro que quieres borrar este registro?</Modal.Title>
            </Modal.Header>
                <Modal.Body>Una vez borrado el registro y sus relaciones serán borradas</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => {setShowModalBorrar(false)}}>
                    No
                </Button>
                <Button variant="danger" onClick={() => {handleDelete(llave)}}>
                    Sí
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
        </div>
    )
}

export default PerfilEditarTutor