import React, { useEffect, useState } from 'react'
import { Alert, Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
const GET_ADMINS_URL = '/profiles/getadmins'
const EDIT_ADMINS_URL = 'profiles/editaadmin'
const DELETE_ADMINS_URL = 'profiles/borraadmin'

function PerfilEditarAdmin() {
    const [adminList, setAdminList] = useState([]);
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showM, setShowM] = useState(false);
    const [nombre, setNombre] = useState("");
    const [llave, setLlave] = useState(0);
    const [contrasenia, setContrasenia] = useState("");
    const [confpassword, setConfPassword] = useState("");
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});

    useEffect (() => {
        getAdmins()
    }, [detailsPane])

    const getAdmins = () => {
        axios.get(GET_ADMINS_URL).then((response) => {
            setAdminList(response.data)
            console.log(adminList)
        })
    }

    const handleShowM = () => {
        setShowM(true)
    }

    const handleCloseM = () => {
        setShowM(false)
    }

    const openPane = (values) => {
        setDetailsPane({isPaneOpen: true});
        setLlave(values.idAdministrador);
    }

    const closePane = () => {
        setDetailsPane({isPaneOpen: false});
        setNombre("");
        setContrasenia("");
        setConfPassword("");
    }

    const handleDelete = async (llave) => {
        console.log(llave)
        const response = await axios.post(DELETE_ADMINS_URL+"/"+llave)
        setShow(true)
        setVariante('success')
        setMsg(response.data.message)
        setDetailsPane({isPaneOpen: false})
        setShowM(false)
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        console.log(llave)
        console.log(nombre)
        console.log(contrasenia)
        console.log(confpassword)
        try{
            const response = await axios.post(EDIT_ADMINS_URL, {
                idadmin: llave,
                nombread: nombre,
                password: contrasenia,
                confpassword: confpassword
            })
          if(response.status === 200){
              console.log(response)
              setShow(true)
              setVariante('success')
              setMsg(response.data.message)
              setNombre("")
              setContrasenia("")
              setConfPassword("")
          }
        }catch(error){
          setShow(true)
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

    return (
        <div>
            <h1>Página de perfil de edición admin</h1>
            <Alert 
                show={show}
                variant={variante}
                onClose={() => setShow(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
            {adminList.map(values => (
                    <div className='admin' key={values.idAdministrador}>
                        <div>
                            <ListGroup flush>
                                <ListGroupItem header="Head">
                                    <div className="fw-bold">
                                        {values.usuario}
                                    </div>
                                    <button className='button-icon'
                                        onClick={() => openPane(values)}>
                                            <AiOutlineEdit size='3em' color='blue'/>
                                    </button>
                                </ListGroupItem>
                            </ListGroup>
                            <br/>
                        </div>
                    </div>
                )
            )}
            <SlidingPane
                className='sliding-pane'
                isOpen={detailsPane.isPaneOpen}
                title={adminList[llave-1]?.usuario}
                width={window.innerWidth < 600 ? "100%" : "500px"}
                onRequestClose={closePane}
            >
                <div className='admin-details__info'>
                    <div className='admin-details__box'>
                        <div>Editar información</div>
                        <Form 
                        onSubmit={handleSubmitEdit}>
                            <Form.Group controlId="nombreadmin">
                                <Form.Label>Nombre del admin</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={adminList[llave-1]?.usuario}
                                    value={nombre}
                                    maxLength= "75"
                                    onChange={(e) => setNombre(e.target.value)}
                                    >
                                    </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Escriba la contraseña"
                                    value={contrasenia}
                                    onChange={(e) => setContrasenia(e.target.value)}
                                    ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="confirmpassword">
                                <Form.Label>Repetir Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Escriba la contraseña"
                                    value={confpassword}
                                    onChange={(e) => setConfPassword(e.target.value)}
                                    ></Form.Control>
                            </Form.Group>
                            <Button
                            className='button-edit'
                            type='submit'
                            onSubmit={handleSubmitEdit}>
                                Editar
                            </Button>
                        </Form>
                    </div>
                    <button 
                    className='button-delete'
                    onClick={handleShowM}>
                        Borrar <AiOutlineDelete size='2em' />
                    </button>
                </div>
            </SlidingPane>
            <Modal show={showM} onHide={handleCloseM}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar este registro?</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Una vez borrado el registro y sus relaciones serán borradas</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseM}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => {handleDelete(llave)}}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PerfilEditarAdmin