import React, { useEffect, useState }from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import PdfCreator from '../../services/PdfCreator'
const GET_RECENT_ENTRY_URL = 'questionnaires/getrecententry'

function ReportesNuevoRegistroAdmin() {
    const [datos, setDatos] = useState();
    const { timestamp } = useParams();
    const { idAlumno } = useParams();

    return (
        <div>
            <div className='text-center'>
                <h1>Creación de Reportes</h1>
                <h1>{timestamp}</h1>
            </div>
            <Button
            onClick={PdfCreator}>
                Crear Reporte
            </Button>
        </div>
    )
}

export default ReportesNuevoRegistroAdmin