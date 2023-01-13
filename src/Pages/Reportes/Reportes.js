import { useEffect, useState } from 'react'
import { Accordion, Alert, Button, Card, ListGroup, ListGroupItem, Modal } from 'react-bootstrap'
import { AiOutlineSelect } from 'react-icons/ai';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios'
const PERFIL_ALUMNO_URL = '/profiles/getalumno';
const GET_SEMESTRE_URL = '/reportes/getsemestre';
const GET_SEMESTRES_URL = '/reportes/getsemestres';
const GET_REPORTES_ALUMNO_D_URL = 'reportes/getreportesalumnodisp';

function Reportes() {
    
    const [alumnSelect, setAlumnSelect] = useState(0);
    const [alumno, setAlumno] = useState([]);
    const [reportesList, setReportesList] = useState([]);
    const [semestre, setSemestre] = useState("");
    const [semestres, setSemestres] = useState([]);
    const [semestreSelect, setSemestreSelect] = useState(0);
    const [rutaSelect, setRutaSelect] = useState("");
    const [showMReportes, setShowMReportes] = useState(false);
    var idTutor= localStorage.getItem('id');
    
    useEffect (() => {
        getAlumno();
        getSemestre();
        getSemestres();
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            setAlumnSelect(response.data[0]?.idAlumno)
            console.log(response.data)
        })
    }

    const getSemestre = () => {
        axios.get(GET_SEMESTRE_URL).then((response) => {
            setSemestre(response.data)
            console.log(response.data)
        })
    }

    const getSemestres = () => {
        axios.get(GET_SEMESTRES_URL).then((response) => {
            setSemestres(response.data)
            console.log(response.data)
        })
    }

    const selectSemestre = (semester) => {
        setSemestreSelect(semester)
        getReportesAvailable(semester)
    }

    const getReportesAvailable = (semestresel) => {
        console.log(alumnSelect)
        console.log(semestreSelect)
        axios.post(GET_REPORTES_ALUMNO_D_URL+"/"+alumnSelect+"/"+semestresel).then((response) => {
            setReportesList(response.data);
            console.log(response.data)
            setShowMReportes(true);
        });
    }

    return (
        <div className='text-center'>
            <h1>Reportes de {alumno[0]?.nombre+" "+alumno[0]?.apellido}</h1>
            {semestres?.length > 0 ? 
                <div>
                    {semestres.map(semester => (
                    <div key={semester.idSemestre}>
                    <Card
                    className="text-center"
                    border = "warning"
                    style={{ width: '100%' }}>
                        <Card.Body>
                        <div>
                            <h3>{semester.periodo}</h3>
                            <br/>
                            <Button
                            variant="success"
                            onClick={() => {selectSemestre(semester.idSemestre)}}>
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
                Actualmente el alumno no tiene ningún reporte a su nombre en dicho semestre
            </div>
            }
        {/* MODAL ELECCION REPORTE */}
        <Modal
        show={showMReportes}
        scrollable={true}
        onHide={() => {
            setShowMReportes(false)
            setRutaSelect("")}}>
            <Modal.Header closeButton>
                <Modal.Title>¿Qué reporte deseas visualizar?</Modal.Title>
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
                                onClick={() => {setRutaSelect(report.ruta)}}>
                                    <AiOutlineSelect/>
                                </Button>
                            </div>
                            </Card.Body>
                            <Card.Footer>
                                <h5>Ruta:</h5>
                                {rutaSelect &&
                                <a href={rutaSelect} target="_blank" rel="noopener noreferrer">{rutaSelect}</a>}
                            </Card.Footer>
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
        </div>
    )
}

export default Reportes