import React, { useEffect, useState } from 'react'
import { Alert, Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from '../../axios/axios';
import Table from 'react-bootstrap/Table';
import "./perfil.css";
const PERFIL_ALUMNO_URL = '/profiles/getalumno';

function Perfil(){
    //crear para sacar los datos del perfil
    // sacar de fila
    const [alumno, setAlumno] = useState([]);
    const [show, setShow] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [semestre, setSemestre] = useState("");
    const [foto, setFoto] = useState();
    var idTutor= localStorage.getItem('idTutor');
    
    useEffect (() => {
        getAlumno()
    }, [])

    const getAlumno = () => {
        axios.get(PERFIL_ALUMNO_URL+"/"+idTutor).then((response) => {
            setAlumno(response.data)
            console.log(response.data)
    })
    
    return (
        <div>
            <h3>
                {idTutor}
            </h3>
        <Table bordered>
            <thead>
                <tr>
                <th>
                    Nombre
                </th>
                <th>
                    Apellido
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
                    1
                </th>
                <td>
                    Mark
                </td>
                <td>
                    Otto
                </td>
                <td>
                    @mdo
                </td>
                </tr>
            </tbody>
            </Table>
    </div>
    )}
}
export default Perfil;