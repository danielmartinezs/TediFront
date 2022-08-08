import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import { Button, Card, Modal } from "react-bootstrap";
import { AiOutlineCheck, AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import axios from 'axios'
import "./cuestionarios.css"
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'
const GET_ALUMNOS_URL = '/profiles/getalumnos';

function CuestionariosAdmin() {
    const [cuestionariosList, setCuestionariosList] = useState([]);
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnSearch, setAlumnSearch] = useState([]);
    const [alumnSelect, setAlumnSelect] = useState();
    const [busqueda, setBusqueda] = useState("");
    const [showM, setShowM] = useState(false);

    useEffect(() => {
        getCuestionarios();
    }, []);

    const getCuestionarios = () => {
        axios.get(GET_CUESTIONARIOS_URL).then(response => {
            setCuestionariosList(response.data);
        })
    }

    const getAlumnos = () => {
        axios.get(GET_ALUMNOS_URL).then(response => {
            setAlumnSearch(response.data);
            setAlumnosList(response.data);
        })
    }

    const findAlumno = (id) => {
        console.log(id)
        for(let i = 0; i < alumnosList.length; i++){
            if(alumnosList[i].idAlumno === id){
                return(alumnosList[i].nombre + ' ' + alumnosList[i].apellido);
            }
        }
    }

    const filtrar = (terminoBusqueda) => {
        console.log("El termino es "+terminoBusqueda)
        var resultadosBusqueda = alumnosList.filter( (elemento) => {
            if(terminoBusqueda === ""){
                setAlumnSearch(alumnosList)
                return elemento;
            }
            else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
            {
                return elemento;
            }
        });
        setAlumnSearch(resultadosBusqueda);
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const handleDisplayAlumnos = () => {
        getAlumnos();
        setShowM(true);
    }

    return(
        <div>
            {cuestionariosList.map(values => (
                <div key={values.idCuestionario}>
                    <Card 
                    className="text-center"
                    border = "warning"
                    style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Header>Cuestionario #{values.idCuestionario}</Card.Header>
                            <Card.Title><h1>{values.nombre}</h1></Card.Title>
                            <Link to={`/CuestionariosEdicionAdmin/${values.idCuestionario}`}>
                                <Button className="btnBancoPreguntas" >
                                    Modificar
                                    <AiOutlineEdit/>
                                </Button>
                            </Link>
                            <Button 
                            className="btnBancoPreguntas"
                            onClick={handleDisplayAlumnos}>
                                Contestar
                                <AiOutlineCheck/>
                            </Button>
                        </Card.Body>
                        <Card.Footer>
                                 Materia: {values.materia}
                        </Card.Footer>
                    </Card>
                </div>
            ))}
            <br/>
            <Link to={"/CuestionariosRegistrosAdmin"}>
                <Button className="btnAct">
                    Registro de preguntas y respuestas
                    <AiOutlineInfoCircle/>
                </Button>
            </Link>
            <Link to={"/CuestionariosCreacionAdmin"}>
                <Button className="btnAct">
                    Crear cuestionario
                    <AiOutlinePlus/>
                </Button>
            </Link>
            {/* MODAL CONTESTAR ALUMNO */}
            <Modal 
            show={showM}
            onHide={() => setShowM(false)}
            scrollable={true}
            dismissible>
                <Modal.Header closeButton>
                    <Modal.Title>¿A qué alumno se le aplicará el cuestionario?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="containerInput">
                <input
                    className="inputBuscar"
                    value={busqueda}
                    placeholder="Buscar Alumno"
                    maxLength="100"
                    onChange={(e) => handleBuscar(e)}
                />
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
                </div>
                {alumnSearch && alumnSearch.map(values => (
                    <div key={values.idAlumno}>
                        <Card
                        className="text-center"
                        border = "warning"
                        style={{ width: '100%' }}>
                            <Card.Body>
                            <div>
                                {values.nombre+' '+values.apellido}
                                <br/>
                                <Button
                                variant="success"
                                onClick={() => {setAlumnSelect(values.idAlumno)}}>
                                    <AiOutlineSelect/>
                                </Button>
                            </div>
                            </Card.Body>
                        </Card>
                    </div>
                    ))
                }
                </Modal.Body>
                <Modal.Footer>
                    {alumnSelect &&
                    <Link to={`/CuestionariosResponderAdmin/${alumnSelect}`}>
                        <Button className='btnAct'>
                            Aplicar cuestionario a {findAlumno(alumnSelect)}
                        </Button>
                    </Link>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CuestionariosAdmin;