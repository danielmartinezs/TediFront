import React, { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, Modal, Offcanvas } from 'react-bootstrap'
import axios from 'axios';
import { DatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { es } from 'date-fns/locale'
const GET_SEMESTRE_URL = 'reportes/getsemestre';

export const ConfigOptions = () => {

    const [show, setShow] = useState(true);
    const [showA, setShowA] = useState(false);
    const [showOffSemi, setShowOffSemi] = useState(false);
    const [semestre, setSemestre] = useState([]);
    const [periodo, setPeriodo] = useState("");
    const [anio, setAnio] = useState("");
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');

    useEffect(() => {
        getSemestre();
    }, [])

    const getSemestre = () => {
        axios.get(GET_SEMESTRE_URL).then((response) => {
            setSemestre(response.data)
        })
    }

    const handleFechaInicio = (date) => {
        setFechaInicio(date)
        console.log(date)
    }

    const handleFechaFin = (date) => {
        setFechaFin(date)
        console.log(date)
    }

    const handleSubmitNewSemestre = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post('reportes/newsemestre', {
                periodo: periodo,
                año: anio,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
            if(response.status === 200){
                setVariante('success')
                setMsg(response.data.message)
                setShowA(true)
                setShowOffSemi(false)
                setShow(true)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
            show={show}
            onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Opciones de configuración</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <div className="text-center">
                    Semestre actual: {semestre[0]?.periodo}
                    <Button
                    className='btnAct'
                    onClick={() => {
                        setShowOffSemi(true)
                        setShow(false)}}>
                        Cambiar de semestre
                    </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Offcanvas
            show={showOffSemi}
            location="left"
            onHide={() => {
                setShow(true)
                setShowOffSemi(false)}}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Nuevo Semestre</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Form className='form'>
                    <Form.Group
                    className="mb-3"
                    controlId="newHito">
                        <h3>Semestre actual:
                            <br/> 
                            {semestre[0]?.periodo}
                        </h3>
                        <Form.Label>Periodo</Form.Label>
                        <Form.Control 
                        type="text"
                        placeholder='Mes inicial - Mes final' 
                        maxLength="250"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}/>
                        <Form.Label>Año</Form.Label>
                        <Form.Control 
                        type="text"
                        placeholder='Año' 
                        maxLength="250"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Fecha de inicio de semestre</Form.Label>
                    <br/>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                <DatePicker
                                disablePast
                                variant="dialog"
                                format="yyyy/MM/dd"
                                views={["year", "month", "date"]}
                                value={fechaInicio}
                                onChange={handleFechaInicio}/>
                        </MuiPickersUtilsProvider>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                    <Form.Label>Fecha de fin de semestre</Form.Label>
                    <br/>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                <DatePicker
                                disablePast
                                variant="dialog"
                                format="yyyy/MM/dd"
                                views={["year", "month", "date"]}
                                value={fechaFin}
                                onChange={handleFechaFin}/>
                        </MuiPickersUtilsProvider>
                    </Form.Group>
                    <br/>
                </Form>
                <Button 
                size='sm'
                variant="danger"
                onClick={() => {setShowOffSemi(false)}}>
                    Cerrar
                </Button>
                <Button
                size='sm'
                variant="success"
                onClick={handleSubmitNewSemestre}>
                    Guardar
                </Button>
            </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default ConfigOptions;