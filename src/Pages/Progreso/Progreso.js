import { Accordion, Button } from'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from '../../axios/axios';
import "./progreso.css";
import { format, parseISO } from 'date-fns';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import { DateTimePicker } from '@material-ui/pickers';
const PERFIL_ALUMNO_URL = '/profiles/getalumno';
const GET_HITOS_ALUMNO_URL = 'profiles/gethitosa';

function Progreso () {

    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumno, setAlumno] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [hitosList, setHitosList] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [timestamp, setTimestamp] = useState();
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [llave, setLlave] = useState(0);
    const [showMHito, setShowMHito] = useState(false)
    const [showA, setShowA] = useState(false);
    var idTutor= localStorage.getItem('idTutor');

    useEffect (() => {
        getAlumno()
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            console.log(response.data)
    })

    const getHitosList = (ida) => {
        axios.get(GET_HITOS_ALUMNO_URL+"/"+ida).then((response) => {
            setHitosList(response.data)
        })
        setAlumnSelect(ida)
        setShowMHito(true)
    }
    return (
        <div>
            <h1>Progreso</h1>
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Enero</Accordion.Header>
                        <Accordion.Body>
                        
                        <ul>
                            <li>El alumno ha cumplido con su tarea     &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Nuevo nivel de lectura conseguido  &ensp; &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Puntaje superado en matematicas &emsp;   &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:24/04/22</li>
                        </ul>
                        </Accordion.Body>
                </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Febrero</Accordion.Header>
                        <Accordion.Body>
                        <ul>
                            <li>El alumno ha cumplido con su tarea    &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Nuevo nivel de lectura conseguido  &ensp; &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Puntaje superado en matematicas &emsp;   &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:24/04/22</li>
                        </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                    <Accordion.Header>Marzo</Accordion.Header>
                        <Accordion.Body>
                        
                        <ul>
                            <li>El alumno ha cumplido con su tarea     &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Nuevo nivel de lectura conseguido  &ensp; &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Puntaje superado en matematicas &emsp;   &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:24/04/22</li>
                        </ul>
                        </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Abril</Accordion.Header>
                        <Accordion.Body>
                        
                        <ul>
                            <li>El alumno ha cumplido con su tarea     &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Nuevo nivel de lectura conseguido  &ensp; &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:23/04/22</li>
                            <li>Puntaje superado en matematicas &emsp;   &emsp;    &emsp;     &emsp;   &emsp;    &emsp;  Fecha:24/04/22</li>
                        </ul>
                        </Accordion.Body>
                </Accordion.Item>
                </Accordion>
        </div>
    )
}
}
export default Progreso;