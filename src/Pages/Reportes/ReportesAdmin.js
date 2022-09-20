import React, { useState } from 'react'
import { Alert, Button, Card } from'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReportesNuevoAdmin from './ReportesNuevoAdmin';
const GENERA_REPORTE_EVALUACION_ARTICULACION_URL = 'reportes/crearreporteea';
const GENERA_REPORTE_HABLIDADES_PREVERBALES_URL = 'reportes/crearreportehpv';
const GENERA_REPORTE_PRUEBA_URL = 'reportes/crearreporteprueba';

function ReportesAdmin() {
    const [datos, setDatos] = useState();

    return (
        <div>
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
        </div>
    )
}

export default ReportesAdmin