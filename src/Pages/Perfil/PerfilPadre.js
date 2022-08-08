import React, { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from 'axios'
import "./perfil.css";
const PERFIL_ALUMNO_URL = '/profiles/getalumno';

function PerfilPadre() {
    //crear para sacar los datos del perfil
    // sacar de fila
    const [show, setShow] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [semestre, setSemestre] = useState("");
    const [foto, setFoto] = useState();
    const [alumno, setAlumno] = useState([]);
    var idTutor = localStorage.getItem('id');
    
    useEffect (() => {
        getAlumno()
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            console.log(response.data)
    })}

    return (
        <div>
            <Card>
                <Card.Header as="h5">Perfil</Card.Header>
            <Card.Body>
            <Card.Title><h3>{alumno[0]?.nombre}</h3></Card.Title>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>
                                Foto
                            </th>
                            <th>
                                Nombre
                            </th>
                            <th>
                                Semestre
                            </th>
                            <th>
                                Fecha de Nacimiento
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                {alumno[0]?.foto}
                            </th>
                            <td>
                                {alumno[0]?.nombre}
                            </td>
                            <td>
                                {alumno[0]?.anioEscolar}
                            </td>
                            <td>
                                {alumno[0]?.fechaNacimiento}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
            </Card>
        </div>
    )
}

export default PerfilPadre