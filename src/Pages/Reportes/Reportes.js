import React, { useState } from 'react'
import { Accordion, Alert, Button } from 'react-bootstrap'
import pdf from './ReporteSemestral.pdf'
import axios from 'axios'
const GENERA_REPORTE_URL = 'reportes/holamundo';

function Reportes() {
    const [datos, setDatos] = useState();
    
    const handleDescarga = ()  => {
        /* axios.get(GENERA_REPORTE_URL).then((response) => {
            console.log(response);
        }) */
        axios.get(GENERA_REPORTE_URL).then((response) => {
            window.open(response.data, '_blank');
            console.log(response);
            setDatos(response.data);
        })
    }

    return (
        <div>
            <Alert>
                <h2>{datos}</h2>
            </Alert>
            <h1>Reportes</h1>
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Enero</Accordion.Header>
                        <Accordion.Body>
                        <ul>
                            <li>Reporte de nivel de lenguaje</li>
                            <li>Reporte en la clase de Matematicas  </li>
                        </ul>
                        </Accordion.Body>
                </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Febrero</Accordion.Header>
                        <Accordion.Body>
                            <ul>
                            <a href={pdf} download >Reporte de nivel Motor </a>
                                <li>Reporte en la clase de Español  </li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion.Item>
                </Accordion>
        <Button
            onClick={handleDescarga}>
                descarga PDF
        </Button> 
        </div>
    )
}

export default Reportes