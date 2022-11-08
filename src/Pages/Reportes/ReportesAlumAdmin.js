import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Modal, Offcanvas, Row } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios'
const GET_ALUMNOS_URL = '/profiles/getalumnos'
const GET_REPORTES_ALUMNO_URL = '/reportes/getreportesalumno'
const NEW_RUTA_URL = '/reportes/newruta'
const PUBLISH_REPORTE_URL = '/reportes/publishreporte'

function ReportesAlumnosAdmin() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [reportesList, setReportesList] = useState([]);
    const [report, setReport] = useState([]);
    const [busqueda, setBusqueda] = useState("")
    const [btnValue, setBtnValue] = useState(0);
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [disponible, setDisponible] = useState(0);
    const [ruta, setRuta] = useState('');
    const [showA, setShowA] = useState(false);
    const [showMReport, setShowMReport] = useState(false);
    const [showMReportList, setShowMReportList] = useState(false);
    const [showOffRuta, setShowOffRuta] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const alumnosPerPage = 9;
    const pageVisisted = pageNumber * alumnosPerPage;
    const pageCount = Math.ceil(alumnosList.length / alumnosPerPage);
    const [alumnosPag, setAlumnosPag] = useState([]);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
            setAlumnosPag((response.data).slice(pageVisisted, pageVisisted + alumnosPerPage))
        })
    }

    const getReportesAlumno = (ida) => {
        axios.post(GET_REPORTES_ALUMNO_URL+"/"+ida).then((response) => {
            setReportesList(response.data)
            console.log(response.data[0])
            setShowMReportList(true)
            setDisponible(response.data[0]?.disponible)
        })
    }

    const introduceRuta = async () => {
        setShowOffRuta(false);
        try{
            const response = await axios.post(NEW_RUTA_URL, {
                idr: report.idReporte,
                ruta: ruta
            })
            if(response.status === 200){
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
              } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
              }
        }
    }

    const cambiaDisponibilidad = async (cambio) => {
        setShowMReport(false)
        console.log(report.idReporte)
        console.log(disponible)
        console.log(cambio)
        try{
            const response = await axios.post(PUBLISH_REPORTE_URL, {
                idr: report.idReporte,
                dispo: cambio
            })
            if(response.status === 200){
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
              } else if(error.response?.status === 404){
                setShowA(true)
                setVariante('danger')
                setMsg(error.response.data.message);
              }
        }
    }

    const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                return;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) || elemento.apellido.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
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

    const changeDisponibilidad = (ava) => {
        console.log(ava);
        console.log('disponible: '+disponible)
        if(ava == 0){
            console.log('cambia de 0 a 1')
            setDisponible(1);
            cambiaDisponibilidad(1)
        }
        else if(ava == 1){
            console.log('cambia de 1 a 0')
            setDisponible(0);
            cambiaDisponibilidad(`0`)
        }
    }

    return (
        <div className='text-center'>
            <h1>Reportes de Alumnos</h1>
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
                                    <Card.Title>{values.nombre} {values.apellido}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Button
                                    className='btnBancoPreguntas'
                                    onClick={() => {getReportesAlumno(values.idAlumno)}}>
                                        Reportes
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
        </div>
        {/* MODAL ELECCION REPORTE */}
        <Modal
        show={showMReportList}
        scrollable={true}
        onHide={() => {setShowMReportList(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>¿Con base a cuál registro deseas realizar el reporte?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {reportesList?.length > 0 ? 
                <div>
                    {reportesList.map(report => (
                    <div key={report.fechaCreacion}>
                        <Card
                        className="text-center"
                        border = "warning"
                        style={{ width: '100%' }}>
                            <Card.Body>
                            <div>
                                <h5>{report.nombre}</h5>
                                Fecha: {format(parseISO(report.fechaCreacion), 'PPPPp', { locale: es })}
                                <br/>
                                <Button
                                variant="success"
                                onClick={() => {
                                    setShowMReportList(false)
                                    setReport(report)
                                    setShowMReport(true)
                                    }}>
                                    <AiOutlineSelect/>
                                </Button>
                            </div>
                            </Card.Body>
                        </Card>
                    </div>
                    ))}
                </div>
                :
                <div>
                    Actualmente el alumno no tiene ningún reporte a su nombre
                </div>
                }
            </Modal.Body>
        </Modal>
        {/*MODAL PUBLICAR REPORTE*/}
        <Modal
        show={showMReport}
        onHide={() => {setShowMReport(false)}}>
            <Modal.Header closeButton>
                <Modal.Title> <h3>{report?.nombre}</h3> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className='text-center'>
                        <ListGroup>
                            {report.ruta === '' ?
                                <div>
                                    <ListGroupItem>
                                        <h5>Actualmente no hay una ruta definida para este reporte, pulsa click en el botón para introducir la ruta</h5>
                                        <Button
                                        variant='success'
                                        onClick={() => {
                                            setShowOffRuta(true)
                                            setShowMReport(false)}}>
                                            Introducir ruta
                                        </Button>
                                    </ListGroupItem>
                                </div>:
                                <ListGroupItem>
                                    <h5>{report?.ruta}</h5>
                                    <Button
                                    className="btnEditarCuestionario"
                                    variant='success'
                                    onClick={() => {
                                        setShowMReport(false)
                                        setShowOffRuta(true)
                                    }}>
                                        <AiOutlineEdit/>
                                    </Button>
                                </ListGroupItem>
                            }
                            {disponible == 0 ?
                            <ListGroupItem>
                                <h5>Disponible: ❌</h5>
                            </ListGroupItem>
                            :
                            <ListGroupItem>
                                <h5>Disponible: ✅</h5>
                            </ListGroupItem>
                            }
                            {disponible == 0 ?
                                <div>
                                    {report.ruta !== '' && 
                                    <Button
                                    className='btnEditarRespuesta'
                                    onClick={() => {changeDisponibilidad(disponible)}}>
                                        Habilitar visualización del reporte
                                    </Button>}
                                </div>:
                                <div>
                                <Button
                                className='btnEditarRespuesta'
                                onClick={() => {changeDisponibilidad(disponible)}}>
                                    Deshabilitar visualización del reporte
                                </Button>
                                </div>
                            }
                        </ListGroup>
                    </div>
            </Modal.Body>
        </Modal>
        {/*OFFCANVAS EDITAR NOMBRE CUESTIONARIO*/}
        <Offcanvas 
            show={showOffRuta} 
            placement={'bottom'}
            onHide={() => setShowOffRuta(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Ingresar ruta del reporte</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="newNombreC">
                        <Form.Label>Ruta del reporte</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={1}
                        maxLength="250"
                        value={ruta}
                        onChange={(e) => setRuta(e.target.value)}>
                            {ruta}
                        </Form.Control>
                    </Form.Group>
                    <Button 
                    size='sm'
                    variant="danger"
                    onClick={() => {
                    setShowOffRuta(false)
                    }}>
                        Cerrar
                    </Button>
                    <Button
                    size='sm'
                    variant="success"
                    onClick={introduceRuta}>
                        Guardar
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    </div>
    )
}

export default ReportesAlumnosAdmin