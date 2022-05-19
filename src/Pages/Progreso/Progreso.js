import React from 'react'
import {Accordion} from'react-bootstrap'

function Progreso() {
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

export default Progreso