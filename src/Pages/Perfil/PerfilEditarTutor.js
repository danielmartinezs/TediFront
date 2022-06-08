import React, { useEffect, useState } from 'react'
import { Accordion, Alert, Button, ButtonGroup, Card, Modal, ToggleButton } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import Form from 'react-bootstrap/Form';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import { format } from 'date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from "@material-ui/pickers";
import { es } from 'date-fns/locale'
import "./perfil.css"
const GET_TUTORES_URL = '/profiles/gettutores'
const EDIT_TUTOR_URL = '/profiles/editatutor'
const EDIT_ALUMNO_URL = 'profiles/editaalumno'
const DELETE_TUTOR_URL = 'profiles/borratutor'

function PerfilEditarTutor() {
    const [btnValue, setBtnValue] = useState(0);
    const botones = [
        { name: 'Modificar Tutor', value: '1' },
        { name: 'Modificar Alumno', value: '2' },
    ];
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showModalBorrar, setShowModalBorrar] = useState(false);
    const [tutoresList, setTutoresList] = useState([]);
    const [tutoresSearch, setTutoresSearch] = useState([]);
    const [busqueda, setBusqueda] = useState("")
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechanac, setFechaNac] = useState();
    const [semestre, setSemestre] = useState("");
    const [foto, setFoto] = useState();
    const [fotoPreview, setFotoPreview] = useState();
    const [llave, setLlave] = useState(0);
    const [contrasenia, setContrasenia] = useState("");
    const [confpassword, setConfPassword] = useState("");
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});

    useEffect (() => {
        getTutores()
    }, [detailsPane])

    const getTutores = () => {
        axios.get(GET_TUTORES_URL).then((response) => {
            setTutoresList(response.data)
            setTutoresSearch(response.data)
        })
        setFechaNac(tutoresList[llave-1]?.fechaNacimiento)
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
        setApellido("");
        setFechaNac("");
        setSemestre("");
    }

    const handleSubmitEditAlumno = async (e) => {
        e.preventDefault();
        console.log(fechanac)
        console.log("foto"+foto)
        try{
            const response = await axios.post(EDIT_ALUMNO_URL, {
                idal: tutoresList[llave-1]?.idAlumno,
                nombrealu: nombre,
                apellidoalu: apellido,
                nacimiento: fechanac,
                schoolmester: semestre,
                foto: foto
            })
          if(response.status === 200){
              console.log(response)
              setShowA(true)
              setVariante('success')
              setMsg(response.data.message)
              setNombre("")
              setApellido("")
              setFechaNac("")
              setSemestre("")
              setFoto("")
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
        }
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
                setTutoresSearch(tutoresList)
                return elemento;
            }
            else if(elemento.usuario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        setTutoresSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    return (
        <div>
            <h1>Edición de tutores/alumnos</h1>
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
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
            {tutoresSearch && tutoresSearch.map(values => (
                    <div className='admin' key={values.idAdministrador}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.usuario} - {values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                    <ButtonGroup>
                                        {botones.map((botones, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={idx % 2 ? 'outline-warning' : 'outline-warning'}
                                            name="radio"
                                            value={botones.value}
                                            onChange={(e) => setBtnValue(e.currentTarget.value)}
                                            onClick={() => openPane(values, botones.value)}
                                        >
                                            {botones.name}
                                        </ToggleButton>
                                        ))}
                                    </ButtonGroup>
                                    </AccordionBody>
                            </Accordion>
                            <br/>
                        </div>
                    </div>
                )
            )}
            {btnValue === '1' ? 
            <SlidingPane
                className='sliding-pane'
                isOpen={detailsPane.isPaneOpen}
                title={tutoresList[llave-1]?.usuario}
                width={window.innerWidth < 600 ? "100%" : "500px"}
                onRequestClose={closePane}
            >
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
                                    onChange={(e) => setNombre(e.target.value)}
                                    ></Form.Control>
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
                            onSubmit={handleSubmitEditTutor}>
                                Editar
                                <AiOutlineEdit size='2em'/>
                            </Button>
                        </Form>
                    </div>
                    <button className='button-delete'>
                        Borrar  <AiOutlineDelete size='2em' />
                    </button>
                </div>
            </SlidingPane>
            : 
            <SlidingPane
            className='sliding-pane'
            isOpen={detailsPane.isPaneOpen}
            title={tutoresList[llave-1]?.nombre}
            width={window.innerWidth < 600 ? "100%" : "500px"}
            onRequestClose={closePane}
            >
            <div className='admin-details__info'>
                <div className='admin-details__box'>
                    <Form 
                        className="form"
                        onSubmit={handleSubmitEditAlumno}>
                             <h3>Editar información</h3>
                             <img 
                        className='admin-details__img'
                        src={fotoPreview ?? (tutoresList[llave-1]?.fotografia)}/>
                        <Form.Group 
                        controlId="formFileSm" 
                        className="custom-file-upload">
                            <Form.Control
                                type="file"
                                size="sm"
                                accept='image/*'
                                onChange={(e) => {
                                    setFoto(e.target.files[0])
                                    setFotoPreview(URL.createObjectURL(e.target.files[0]))
                                }}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="nombre">
                                <Form.Label>Nombre del alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={tutoresList[llave-1]?.nombre}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="apellido">
                                <Form.Label>Apellido del alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={tutoresList[llave-1]?.nombre}
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    ></Form.Control>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <br/>
                                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                        <DatePicker
                                        disableFuture
                                        openTo="year"
                                        variant="dialog"
                                        format="yyyy/MM/dd"
                                        label="Fecha de Nacimiento"
                                        views={["year", "month", "date"]}
                                        value={fechanac}
                                        onChange={setFechaNac}/>
                                </MuiPickersUtilsProvider>
                            </Form.Group>
                            <Form.Group controlId="semestre">
                                <Form.Label>Semestre Escolar</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={tutoresList[llave-1]?.anioEscolar}
                                    value={semestre}
                                    onChange={(e) => setSemestre(e.target.value)}
                                    ></Form.Control>
                            </Form.Group>
                            <br/>
                            <Button
                            className='button-edit'
                            type='submit'
                            onSubmit={handleSubmitEditAlumno}>
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
        }
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