import React, { useState } from 'react'
import { Alert, Button, Card } from'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from '../../axios/axios';
import ReportesNuevoAdmin from './ReportesNuevoAdmin';
const GENERA_REPORTE_EVALUACION_ARTICULACION_URL = 'reportes/crearreporteea';
const GENERA_REPORTE_HABLIDADES_PREVERBALES_URL = 'reportes/crearreportehpv';
const GENERA_REPORTE_PRUEBA_URL = 'reportes/crearreporteprueba';

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
            {/* <Card border='warning' className='text-center' style={{display: 'flex'}}>
                <Card.Header>
                    <h3>Edición de reportes</h3>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Edita la información de un reporte en particular
                    </Card.Text>
                    <Link to={'/ReportesEdicionAdmin'}>
                        <Button size='lg' className="btnCrear">
                            Edición de reportes
                        </Button>
                    </Link>
                </Card.Body>
            </Card> */}
            <Card border='warning' className='text-center' style={{display: 'flex'}}>
                <Card.Header>
                    <h3>Creación de reportes</h3>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Crea un nuevo reporte con la información que desees
                    </Card.Text>
                    <Link to={'/ReportesNuevoAdmin'}>
                        <Button size='lg' className="btnCrear">
                            Creación de reportes
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
            {/* <Button onClick={handleDescargaReporteEA}>
                descarga PDF Evaluación Articulación
            </Button>
            <Button onClick={handleDescargaReporteHPV}>
                descarga PDF Habilidades Preverbales
            </Button>
            <Button onClick={handleDescargaReportePrueba}>
                descarga PDF Prueba
            </Button>
            <Button onClick={ReportesNuevoAdmin}>
                descarga PDF Prueba FrontEnd
            </Button> */}
        </div>
    )
}

export default ReportesAdmin