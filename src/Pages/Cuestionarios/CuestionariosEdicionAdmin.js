import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'react-bootstrap';
import axios from '../../axios/axios';
const GET_QUESTIONNAIRES_DETAILS_URL = '/questionnaires/getquestionnairesdetails'

function CuestionariosEdicionAdmin() {

    const [cuestionariosInfo, setCuestionariosInfo] = useState([]);
    const {idCuestionario} = useParams();

    useEffect (() => {
        getQuestionnaireDetails()
    }, [])

    const getQuestionnaireDetails = () => {
        axios.get(GET_QUESTIONNAIRES_DETAILS_URL+"/"+idCuestionario).then((response) => {
            console.log("length"+response.data.length)
            for(let i = 0; i<response.data.length; i++){
                response.data[i].opciones = JSON.parse(response.data[i].opciones)
                console.log(response.data[i].opciones)
            }
            setCuestionariosInfo(response.data)
        })
    }

    return(
        <div>
            <h3>{idCuestionario}</h3>
        </div>
    )
}

export default CuestionariosEdicionAdmin;