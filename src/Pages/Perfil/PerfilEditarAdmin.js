import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Modal } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
import "./perfil.css"
const GET_ADMINS_URL = '/profiles/getadmins'
const EDIT_ADMINS_URL = 'profiles/editaadmin'
const DELETE_ADMINS_URL = 'profiles/borraadmin'

function PerfilEditarAdmin() {
    const [adminList, setAdminList] = useState([]);
    const [adminSearch, setAdminSearch] = useState([]);
    const [busqueda, setBusqueda] = useState("")
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showModalBorrar, setShowModalBorrar] = useState(false);
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
            setAdminSearch(response.data)
        })
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
        setShowA(true)
        setVariante('success')
        setMsg(response.data.message)
        setDetailsPane({isPaneOpen: false})
        setShowModalBorrar(false)
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
              setShowA(true)
              setVariante('success')
              setMsg(response.data.message)
              setNombre("")
              setContrasenia("")
              setConfPassword("")
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

    const filtrar = (terminoBusqueda) => {
        console.log("El termino es "+terminoBusqueda)
        var resultadosBusqueda = adminList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                setAdminSearch(adminList)
                return elemento;
            }
            else if(elemento.usuario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        setAdminSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    return (
        <div>
            <h1>Edición de perfiles admin</h1>
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
                    maxLength="75"
                    placeholder="Buscar Administrador"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
            {adminSearch && adminSearch.map(values => (
                    <div className='admin' key={values.idAdministrador}>
                        <div>
                            <Card
                            className='text-center'
                            border='warning'
                            style={{width: '100%'}}>
                                <Card.Body
                                onClick={() => openPane(values)}>
                                    <Card.Title className='fw-bold'>{values.usuario}</Card.Title>
                                    <Button className='button-icon'
                                        onClick={() => openPane(values)}>
                                            Editar información
                                            <AiOutlineEdit size='3em'/>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                )
            )}
            {/*SLIDING PANE EDICION DATOS */}
            <SlidingPane
                className='sliding-pane'
                isOpen={detailsPane.isPaneOpen}
                title={adminList[llave-1]?.usuario}
                width={window.innerWidth < 600 ? "100%" : "500px"}
                onRequestClose={closePane}>
                <div className='admin-details__info'>
                    <div className='admin-details__box'>
                        <Form
                        className="form" 
                        onSubmit={handleSubmitEdit}>
                            <h3>Editar información</h3>
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
                            <br/>
                            <Button
                            className='button-edit'
                            type='submit'
                            onSubmit={handleSubmitEdit}>
                                Editar
                                <AiOutlineEdit/>
                            </Button>
                        </Form>
                    </div>
                    <button 
                    className='button-delete'
                    onClick={() => {setShowModalBorrar(true)}}>
                        Borrar <AiOutlineDelete size='2em' />
                    </button>
                </div>
            </SlidingPane>
            {/*MODAL CONFIRMACIÓN BORRAR*/}
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

export default PerfilEditarAdmin