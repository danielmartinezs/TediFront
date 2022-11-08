import React, { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import axios from 'axios'
import "./perfil.css";
const PERFIL_ALUMNO_URL = '/profiles/getalumno';
const GET_SEMESTRE_URL = '/reportes/getsemestre';

function PerfilPadre() {
    const [show, setShow] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState();
    const [semestre, setSemestre] = useState([]);
    const [foto, setFoto] = useState();
    const [alumno, setAlumno] = useState([]);
    var idTutor = localStorage.getItem('id');
    
    useEffect (() => {
        getAlumno();
        getSemestre();
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            console.log(response.data)
            setFechaNacimiento(response.data[0].fechaNacimiento.split("T")[0])
    })}

    const getSemestre = () => {
        axios.get(GET_SEMESTRE_URL).then((response) => {
            setSemestre(response.data)
            console.log(response.data)
        })
    }

    return (
        <div>
            <Card>
            <Card.Body>
            <Card.Title><h3>{alumno[0]?.nombre+' '+alumno[0]?.apellido}</h3></Card.Title>
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
                                {alumno[0]?.nombre+' '+alumno[0]?.apellido}
                            </td>
                            <td>
                                {semestre[0]?.periodo}
                            </td>
                            <td>
                                {fechaNacimiento}
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