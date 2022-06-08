import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import { Button, Card } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus } from 'react-icons/ai';
import axios from '../../axios/axios'
import "./cuestionarios.css"
const GET_CUESTIONARIOS_URL = '/questionnaires/getcuestionarios'

function CuestionariosAdmin() {
    const [cuestionariosList, setCuestionariosList] = useState([]);

    useEffect(() => {
        getCuestionarios();
    }, []);

    const getCuestionarios = () => {
        axios.get(GET_CUESTIONARIOS_URL).then(response => {
            setCuestionariosList(response.data);
        })
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
        </div>
    )
}

export default CuestionariosAdmin;