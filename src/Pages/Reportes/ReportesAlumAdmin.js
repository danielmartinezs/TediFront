import React, { useEffect, useState } from 'react'
import { Alert, Accordion } from 'react-bootstrap';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import pdf from './ReporteSemestral.pdf'
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
const GET_ALUMNOS_URL = '/profiles/getalumnos'

function ReportesAlumnosAdmin() {
    const [alumnosList, setAlumnosList] = useState([]);
    const [btnValue, setBtnValue] = useState(0);
    const botones = [
        { name: 'Reportar Progreso', value: '1' },
        { name: 'Reportar Hito', value: '2' },
    ];
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showM, setShowM] = useState(false);

    useEffect (() => {
        getAlumnos()
    }, [])

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then((response) => {
            setAlumnosList(response.data)
        })
    }

    const handleShowM = () => {
        setShowM(true)
    }

    const handleCloseM = () => {
        setShowM(false)
    }

    return (
        <div>
            <h1>Reportes de Alumnos</h1>
            <Alert 
                show={show}
                variant={variante}
                onClose={() => setShow(false)}
                dismissible>
                <Alert.Heading>
                    {msg}
                </Alert.Heading>
            </Alert>
            {alumnosList.map(values => (
                    <div className='admin' key={values.idAdministrador}>
                        <div>
                            <Accordion flush>
                                <AccordionHeader>{values.nombre}</AccordionHeader>
                                    <AccordionBody>
                                        <Accordion.Body>
                                        <ul>
                                            <li>Reporte de nivel de lenguaje</li>
                                            <li>Reporte en la clase de Matematicas  </li>
                                    
                                        </ul>
                                        <ul>
                                        <a href={pdf} download >Reporte de nivel Motor </a>
                                            <li>Reporte en la clase de Español  </li>
                                        </ul>
                                        </Accordion.Body>
                                    </AccordionBody>
                            </Accordion>
                            <br/>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default ReportesAlumnosAdmin