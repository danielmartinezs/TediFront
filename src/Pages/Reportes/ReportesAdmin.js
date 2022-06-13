import React, { useState } from 'react'
import { Accordion, Alert, Button } from'react-bootstrap'
import axios from '../../axios/axios';
const GENERA_REPORTE_EVALUACION_ARTICULACION_URL = 'reportes/crearreporteea';
const GENERA_REPORTE_HABLIDADES_PREVERBALES_URL = 'reportes/crearreportehpv';
const GENERA_REPORTE_PRUEBA_URL = 'reportes/crearreporteprueba';
const PRUEBA = 'reportes/helloworld'

function ReportesAdmin() {
    const [datos, setDatos] = useState();

    const handleDescargaReporteEA = () => {
        axios.post(GENERA_REPORTE_EVALUACION_ARTICULACION_URL).then((response) => {
            window.open(response.data, '_blank');
            console.log(response);
            setDatos(response.data);
        })
    }

    const handleDescargaReporteHPV = () => {
        axios.post(GENERA_REPORTE_HABLIDADES_PREVERBALES_URL).then((response) => {
            window.open(response.data, '_blank');
            console.log(response);
            setDatos(response.data);
        })
    }

    const handleDescargaReportePrueba = () => {
        axios.post(GENERA_REPORTE_PRUEBA_URL).then((response) => {
            window.open(response.data, '_blank');
            console.log(response);
            setDatos(response.data);
        })
    }

    return (
        <div>
            <Alert>
                <h2>{datos}</h2>
            </Alert>
            <Button onClick={handleDescargaReporteEA}>
                descarga PDF Evaluación Articulación
            </Button>
            <Button onClick={handleDescargaReporteHPV}>
                descarga PDF Habilidades Preverbales
            </Button>
            <Button onClick={handleDescargaReportePrueba}>
                descarga PDF Prueba
            </Button>
        </div>
    )
}

export default ReportesAdmin