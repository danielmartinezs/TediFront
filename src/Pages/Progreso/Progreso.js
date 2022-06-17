import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Accordion, Button, Card, Container, Row } from'react-bootstrap'
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
    var idTutor= localStorage.getItem('id');

    useEffect (() => {
        getAlumno()
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            setAlumnSelect(response.data[0]?.idAlumno)
            console.log(response.data)
        })
    }

    const getHitosList = () => {
        axios.get(GET_HITOS_ALUMNO_URL+"/"+alumnSelect).then((response) => {
            setHitosList(response.data)

        })
    }

    return (
        <div className='text-center'>
            <h1>Progreso</h1>
            <Container>
                <Row>
                    <Card style={{ width: "50%", display: "flex" }}>
                        <Card.Header as="h5">
                            <Button 
                            className='btnVerHitos'
                            onClick={getHitosList}>
                                Visualizar hitos de {alumno[0]?.nombre}
                            </Button>
                        </Card.Header>
                    <Card.Body>
                        {hitosList.map((hito, idHito) => {
                            return (
                                <div key={idHito}>
                                    <Accordion>
                                        <Accordion.Header>{hito.descripcion}</Accordion.Header>
                                        <Accordion.Body eventKey={idHito}>
                                            <div>
                                            {format(parseISO(hito.fecha), 'PPPPp', { locale: es })}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion>
                                </div>
                            )
                        }
                        )}
                    </Card.Body>
                    </Card>
                    <Card style={{ width: "50%", display: "flex" }}>
                        <Card.Header as="h5">Visualizar gráficas de progreso de {alumno[0]?.nombre}</Card.Header>
                    <Card.Body>
                        <Link to={'/GraphChart'}>
                            <Button 
                            className='btnVerHitos'
                            onClick={getHitosList}>
                                Visualizar gráficas de progreso de {alumno[0]?.nombre}
                            </Button>
                        </Link>
                    </Card.Body>
                    </Card>
                </Row>
            </Container>
        </div>
    )
}
export default Progreso;