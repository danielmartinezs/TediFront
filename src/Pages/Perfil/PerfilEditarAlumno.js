import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, ListGroup, ListGroupItem, Modal, Row, } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import SlidingPane from 'react-sliding-pane';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from "@material-ui/pickers";
import { es } from 'date-fns/locale'
import "./perfil.css"
const GET_ALUMNOS_URL = '/profiles/getalumnos'
const GET_GRUPOS_URL = '/profiles/getgrupos'
const GET_SEMESTRE_URL = 'reportes/getsemestre';
const EDIT_ALUMNO_URL = 'profiles/editaalumno'
const DELETE_TUTOR_URL = 'profiles/borratutor'

function PerfilEditarAlumno() {
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showA, setShowA] = useState(false);
    const [showModalBorrar, setShowModalBorrar] = useState(false);
    const [showModalGrupos, setShowModalGrupos] = useState(false);
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnosSearch, setAlumnosSearch] = useState([]);
    const [gruposList, setGruposList] = useState([]);
    const [busqueda, setBusqueda] = useState("")
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechanac, setFechaNac] = useState();
    const [semestre, setSemestre] = useState("");
    const [foto, setFoto] = useState();
    const [fotoPreview, setFotoPreview] = useState();
    const [grupo, setGrupo] = useState("");
    const [grupoSelect, setGrupoSelect] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [llave, setLlave] = useState(0);
    const [detailsPane, setDetailsPane] = useState({isPaneOpen: false});
    const alumnosPerPage = 9;
    const pageVisisted = pageNumber * alumnosPerPage;
    const pageCount = Math.ceil(alumnosList.length / alumnosPerPage);
    const [alumnosPag, setAlumnosPag] = useState([]);

    useEffect(() => {
        getGruposList();
        getSemestre();
    }, [])
    
    useEffect (() => {
        getAlumnos()
    }, [detailsPane])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
            setAlumnosPag((response.data).slice(pageVisisted, pageVisisted + alumnosPerPage))
        })
        setFechaNac(alumnosList[llave-1]?.fechaNacimiento)
        setGrupo(alumnosList[llave-1]?.nombregrupo)
    }

    const getGruposList = async () => {
        axios.get(GET_GRUPOS_URL).then((response) => {
          setGruposList(response.data);
        })
    }

    const getSemestre = () => {
        axios.get(GET_SEMESTRE_URL).then((response) => {
            setSemestre(response.data)
        })
    }

    const openPane = (values) => {
        console.log(values)
        setDetailsPane({isPaneOpen: true});
        setLlave(values.idAlumno);
        console.log(llave)
    }

    const closePane = () => {
        setDetailsPane({isPaneOpen: false});
        setNombre("");
        setApellido("");
        setFechaNac("");
        setSemestre("");
    }

    const handleSubmitEditAlumno = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(EDIT_ALUMNO_URL, {
                idal: alumnosList[llave-1]?.idAlumno,
                nombrealu: nombre,
                apellidoalu: apellido,
                nacimiento: fechanac,
                schoolmester: semestre,
                foto: foto,
                grupo: grupoSelect
            })
          if(response.status === 200){
              setShowA(true)
              setVariante('success')
              setMsg(response.data.message)
              setNombre("")
              setApellido("")
              setFechaNac("")
              setSemestre("")
              setFoto("")
              setFotoPreview("")
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
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                return;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        if(terminoBusqueda === ""){
            setAlumnosPag((alumnosList).slice(0, 0 + alumnosPerPage))
        }
        else{
            setAlumnosPag(resultadosBusqueda);
        }
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const onPageChange = ({ selected }) => {
        setPageNumber(selected);
        setAlumnosPag((alumnosList).slice(selected * alumnosPerPage, selected * alumnosPerPage + alumnosPerPage));
    }

    return (
        <div className='text-center'>
            <h1>Edición de perfiles alumnos</h1>
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
                    placeholder="Buscar Alumno"
                    maxLength="100"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
            </div>
            <div>
            <Container className='d-flow-root justify-content-center align-items-center'>
                <Row>
                    {alumnosPag && alumnosPag.map(values => (
                        <div 
                        className="col-md-4 col-sm-12"
                        key={values.idAlumno}>
                            <Col>
                            <Card
                            style={{ width: '90%' }}
                            border='warning'>
                                <Card.Header
                                className='text-center'>
                                    <Card.Title>{values.nombre}</Card.Title>
                                </Card.Header>
                                <Card.Body>
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
                        ))
                    }
                </Row>
            </Container>
            </div>
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
        {/*SLIDING PANE EDICIÓN ALUMNO */}
        <SlidingPane
            className='sliding-pane'
            isOpen={detailsPane.isPaneOpen}
            title={alumnosList[llave-1]?.nombre}
            width={window.innerWidth < 600 ? "100%" : "500px"}
            onRequestClose={closePane}>
            <div className='admin-details__info'>
                <div className='admin-details__box'>
                    <Form 
                        className="form"
                        onSubmit={handleSubmitEditAlumno}>
                        <h3>Editar información</h3>
                        <img 
                        className='admin-details__img'
                        src={fotoPreview ?? (alumnosList[llave-1]?.fotografia)}/>
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
                            />
                        </Form.Group>
                        <Form.Group controlId="nombre">
                                <Form.Label>Nombre del alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={alumnosList[llave-1]?.nombre}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId="apellido">
                                <Form.Label>Apellido del alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={alumnosList[llave-1]?.nombre}
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}/>
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
                            <br/>
                            <Form.Group controlId="grupo">
                                <Button
                                className="btnBancoPreguntas"
                                onClick={() => {setShowModalGrupos(true)}}>
                                Cambiar de grupo
                                </Button>
                                <br/>
                                <Form.Label>Grupo asignado:</Form.Label>
                                <h3>{grupo}</h3>
                            </Form.Group>
                            <Form.Group controlId="semestre">
                                <Form.Label>Semestre Escolar</Form.Label>
                                <h3>{semestre[0]?.periodo}</h3>
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
        {/*MODAL GRUPOS */}
        <Modal
          show={showModalGrupos}
          onHide={() => {setShowModalGrupos(false)}}>
            <Modal.Header
            closeButton>
              <Modal.Title><h3>Grupos</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card className="text-center">
                <Card.Body>
                  {gruposList.map((grupo, index) => {
                    return (
                      <ListGroup>
                        <ListGroupItem>
                          <div key={index}>
                            <h4>{grupo.nombre}</h4>
                            <Button
                            variant="success"
                            onClick={() => {
                              setGrupo(grupo.nombre)
                              setGrupoSelect(grupo.idGrupo)
                              setShowModalGrupos(false)
                            }}>
                              Seleccionar
                            </Button>
                          </div>
                        </ListGroupItem>
                      </ListGroup>
                    )
                  }
                  )}
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
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

export default PerfilEditarAlumno