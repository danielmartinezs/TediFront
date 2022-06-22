import React, { useEffect, useState }from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import PdfCreator from '../../services/PdfCreator'

function ReportesNuevoAdmin() {

    const [datos, setDatos] = useState();

    return (
        <div>
            <div className='text-center'>
                <h1>Creación de Reportes</h1>
            </div>
            <Button
            onClick={PdfCreator}>
                Crear Reporte
            </Button>
        </div>
    )
}

export default ReportesNuevoAdmin