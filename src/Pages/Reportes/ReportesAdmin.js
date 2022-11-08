import React, { useState } from 'react'
import { Alert, Button, Card } from'react-bootstrap'
import { Link } from 'react-router-dom'
import { AiOutlineFilePdf, AiOutlineUpload } from 'react-icons/ai' 
import axios from 'axios'

function ReportesAdmin() {

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
                            Crear reporte
                            <AiOutlineFilePdf/>
                        </Button>
                    </Link>
                </Card.Body>
                <Card.Header>
                    <h3>Publicación de reportes</h3>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Decide si los reportes generados son aptos para publicarse
                    </Card.Text>
                    <Link to={'/ReportesAlumAdmin'}>
                        <Button size='lg' className="btnCrear">
                            Publicar reporte
                            <AiOutlineUpload/>
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ReportesAdmin