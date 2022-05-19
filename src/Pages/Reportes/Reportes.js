import React from 'react'
import {Accordion} from'react-bootstrap'
import pdf from './ReporteSemestral.pdf'

function Reportes() {
    return (
        <div>
            <h1>Pagina de reportes</h1>
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
        </div>
    )
}

export default Reportes