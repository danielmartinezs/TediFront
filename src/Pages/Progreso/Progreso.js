import { useEffect, useState } from 'react'
import { Button, Card, ListGroup, ListGroupItem, Modal } from'react-bootstrap'
import axios from 'axios'
import "./progreso.css";
import { format, parseISO } from 'date-fns';
import GraphChart from '../../components/graphChart'
import { es } from 'date-fns/locale';
import { VscGraph } from 'react-icons/vsc'
const PERFIL_ALUMNO_URL = '/profiles/getalumno';
const GET_HITOS_ALUMNO_URL = 'profiles/gethitosa';
const GRAFICA_ADMIN_NON_URL = '/graphs/generagraphadminnon';

function Progreso () {

    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumno, setAlumno] = useState([]);
    const [hitosList, setHitosList] = useState([]);
    const [graphDataNoN, setGraphDataNoN] = useState([]);
    const [showMHito, setShowMHito] = useState(false)
    const [showNoN, setShowNoN] = useState(false);
    var idTutor= localStorage.getItem('id');

    useEffect (() => {
        getAlumno()
    }, [])

    useEffect (() => {
        getGraphDataNoN()
    }, [alumnSelect])
    
    const getGraphDataNoN = () => {
        console.log(alumnSelect)
        axios.post(GRAFICA_ADMIN_NON_URL+"/"+alumnSelect).then((response) => {
          setGraphDataNoN(response.data);
        });
    }

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            setAlumnSelect(response.data[0]?.idAlumno)
            console.log(response.data)
        })
    }

    const getHitosList = () => {
        console.log(alumnSelect)
        axios.get(GET_HITOS_ALUMNO_URL+"/"+alumnSelect).then((response) => {
            setHitosList(response.data)
            setShowMHito(true)
        })
    }
    
    const revealGraphNoN = () => {
        console.log(graphDataNoN)
        if(graphDataNoN.length > 0){
        setShowNoN(true);
        }
        else{
          alert("No hay datos para mostrar");
        }
    }

      if(showNoN){
        return (
            <div className='text-center'>
            <h1>Progreso de {alumno[0]?.nombre+" "+alumno[0]?.apellido}</h1>
                <Card>
                    
                    <Card.Header as="h5">
                        <Button 
                        className="btnVerHitos"
                        onClick={() => setShowNoN(false)}>
                            Ocultar Gráfica
                        </Button>
                        <GraphChart chartData={graphDataNoN} />
                    </Card.Header>
                </Card>
            </div>
            )
      }

        return (
            <div className='text-center'>
                <h1>Progreso de {alumno[0]?.nombre+" "+alumno[0]?.apellido}</h1>
                    <Card>
                        <Card.Header as="h5">
                            <Button 
                            className='btnVerHitos'
                            onClick={getHitosList}>
                                Visualizar hitos de {alumno[0]?.nombre+" "+alumno[0]?.apellido}
                            </Button>
                        </Card.Header>
                        <Card.Header as="h5">
                            <Button
                            className='btnVerHitos'
                            onClick={revealGraphNoN}>
                                Visualizar gráfica de puntajes de {alumno[0]?.nombre+" "+alumno[0]?.apellido}
                                <VscGraph />
                            </Button>
                        </Card.Header>
                    </Card>
                {/*MODAL LISTA HITOS*/}
                <Modal 
                show={showMHito}
                scrollable
                onHide={() => setShowMHito(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Hitos del alumno:
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {hitosList.map((values, index) => (
                            <div key={values.idHito}>
                            <ListGroup>
                                <ListGroupItem>
                                    <h3>{values.descripcion}</h3>
                                    {format(parseISO(values.fecha), 'PPPPp', { locale: es })}
                                    <br/>
                                </ListGroupItem>
                            </ListGroup>
                            </div>
                        ))
                        }
                    </Modal.Body>
                </Modal>
        </div>
    )
}
export default Progreso;