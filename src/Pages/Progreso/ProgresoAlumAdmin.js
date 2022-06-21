import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas } from'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { format, parseISO } from 'date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import { DateTimePicker } from '@material-ui/pickers';
import "./progreso.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos';
const GET_HITOS_ALUMNO_URL = 'profiles/gethitosa';
const INGRESA_HITO_URL = '/profiles/newhito';
const EDIT_HITO_URL = '/profiles/editahito';
const DELETE_HITO_URL = '/profiles/borrahito';

function ProgresoAlumAdmin() {

    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [hitosList, setHitosList] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [timestamp, setTimestamp] = useState();
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [llave, setLlave] = useState(0);
    const [index, setIndex] = useState(0);
    const [showMHito, setShowMHito] = useState(false)
    const [showMDelete, setShowMDelete] = useState(false);
    const [showOffNew, setShowOffNew] = useState(false);
    const [showOffEdit, setShowOffEdit] = useState(false);
    const [showA, setShowA] = useState(false);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
            setAlumnSearch(response.data)
        })
    }

    const getHitosList = (ida) => {
        axios.get(GET_HITOS_ALUMNO_URL+"/"+ida).then((response) => {
            setHitosList(response.data)
        })
        setAlumnSelect(ida)
        setShowMHito(true)
    }

    const handleDeleteHito = async (llave) => {
        const response = await axios.post(DELETE_HITO_URL+"/"+llave)
        setVariante('success')
        setMsg(response.data.message)
        setShowA(true)
        setShowMDelete(false)
        setShowMHito(false)
    }

    const handleEditHito = async (e) => {
        e.preventDefault()
        setShowOffEdit(false)
        let newtimestamp = 0;
        if(new Date (timestamp).getTime() === new Date (hitosList[index].fecha).getTime()){
            newtimestamp = new Date((hitosList[index].fecha));
            newtimestamp.setHours(newtimestamp.getHours()-5);
            newtimestamp = newtimestamp.toISOString();
        }
        else{
            newtimestamp = new Date(timestamp.setHours(timestamp.getHours()-5)).toISOString();
        }
        try{
            const response = await axios.post(EDIT_HITO_URL, {
                idh: llave,
                timestamp: newtimestamp,
                desc: descripcion
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
                setTimestamp("")
                setDescripcion("")
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
            } else if(error.response?.status === 500){
                setMsg("Error interno");
                setVariante('danger');
            }
        }
    }

    const handleSubmitHito = async (e) => {
        e.preventDefault()
        setShowOffNew(false)
        try{
            const response = await axios.post(INGRESA_HITO_URL, {
                ida: alumnSelect,
                desc: descripcion
            })
            if(response.status === 200){
                setShowA(true)
                setVariante('success')
                setMsg(response.data.message)
                setDescripcion("")
            }
        }
        catch(error){
            setShowA(true)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
        }
    }

    const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                setAlumnSearch(alumnosList)
                return elemento;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        setAlumnSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    return (
        <div className='text-center'> 
            <h1>Progreso por Alumno</h1>
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
                <div className="containerInput">
                <input
                    className="inputBuscar"
                    value={busqueda}
                    placeholder="Buscar Alumno"
                    maxLength="100"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
                </div>
            {alumnSearch && alumnSearch.map(values => (
                    <div className='admin' key={values.idAlumno}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                        <Button
                                        className='btnBancoPreguntas'
                                        onClick={() => {getHitosList(values.idAlumno)}}>
                                            Hitos
                                        </Button>
                                        <Link to={`/ProgresoGraphAdmin/${values.idAlumno}`}>
                                            <Button className='btnBancoPreguntas'>
                                                Gráficas de progreso
                                            </Button>
                                        </Link>
                                    </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                )
            )}
            {/*MODAL LISTA HITOS*/}
            <Modal 
            show={showMHito}
            size="sm"
            scrollable
            onHide={() => setShowMHito(false)}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Hitos del alumno:
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {hitosList.map((values, index) => (
                        <div key={values.idHito}>
                        <ListGroup>
                            <ListGroupItem>
                                <h3>{values.descripcion}</h3>
                                {format(parseISO(values.fecha), 'PPPPp', { locale: es })}
                                <br/>
                                <Button
                                className='btnEditarP'
                                onClick={() => {
                                    setShowOffEdit(true)
                                    setShowMHito(false)
                                    setLlave(values.idHito)
                                    setIndex(index)
                                    setDescripcion(values.descripcion)
                                    setTimestamp(values.fecha)
                                }}
                                variant='success'>
                                    <AiOutlineEdit/>
                                </Button>
                                <Button
                                className='btnBorrarP'
                                onClick={() => {
                                    setShowMDelete(true)
                                    setLlave(values.idHito)
                                }}
                                variant='danger'>
                                    <AiOutlineDelete/>
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                        </div>
                    ))
                    }
                    <Button 
                    variant="success"
                    className='btnCrearP'
                    onClick={() => {
                        setShowOffNew(true)
                        setShowMHito(false)}}>
                        Agregar nuevo hito
                        <AiOutlinePlus/>
                    </Button>
                </ModalBody>
            </Modal>
            {/*MODAL BORRAR HITO*/}
            <Modal 
             show={showMDelete} 
             onHide={() => {setShowMDelete(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que quieres borrar este hito?</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Una vez borrado el hito no podrá recuperarse</Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="success" 
                    onClick={() => {setShowMDelete(false)}}>
                        No
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={() => {handleDeleteHito(llave)}}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*OFFCANVAS NUEVO HITO*/}
            <Offcanvas show={showOffNew} onHide={() => setShowOffNew(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Nuevo hito</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="form">
                        <Form.Group
                        className="mb-3"
                        controlId="newHito">
                            <Form.Label>Detalles</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={(e) => setDescripcion(e.target.value)}>
                                {descripcion}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Button 
                    variant="danger" 
                    className='btnBorrarP'
                    onClick={() => {
                        setShowOffNew(false)
                        setDescripcion('')
                    }}>
                        Cerrar
                    </Button>
                    <Button 
                    variant="success"
                    className='btnEditarP'
                    onClick={handleSubmitHito}>
                        Guardar
                    </Button>
                </Offcanvas.Body>
            </Offcanvas> 
            {/*OFFCANVAS EDITAR HITO*/}
            <Offcanvas 
            show={showOffEdit} 
            placement={'end'} 
            onHide={() => setShowOffEdit(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Editar hito</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="form">
                        <Form.Group
                        className="mb-3"
                        controlId="newHito">
                            <Form.Label>Detalles</Form.Label>
                            <Form.Control 
                            as="textarea" 
                            rows={4} 
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}>
                                {descripcion}
                            </Form.Control>
                        </Form.Group>
                        <Form.Label>Fecha de registro</Form.Label>
                        <br/>
                        <MuiPickersUtilsProvider 
                        locale={es}
                        utils={DateFnsUtils}>
                            <DateTimePicker
                            disableFuture
                            value={timestamp}
                            onChange={setTimestamp}/>
                        </MuiPickersUtilsProvider>
                    </Form>
                    <br/>
                    <Button 
                    variant="danger" 
                    className='btnBorrarP'
                    onClick={() => {
                        setShowOffEdit(false)
                        setDescripcion('')}}>
                        Cerrar
                    </Button>
                    <Button 
                    variant="success"
                    className='btnEditarP'
                    onClick={handleEditHito}>
                        Guardar
                    </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default ProgresoAlumAdmin