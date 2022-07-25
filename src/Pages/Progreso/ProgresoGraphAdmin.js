import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Card, Modal } from 'react-bootstrap';
import { VscGraph } from 'react-icons/vsc'
import GraphChart from '../../components/graphChart'
import axios from '../../axios/axios';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
const GRAFICA_ADMIN_NON_URL = '/graphs/generagraphadminnon';

function ProgresoGraphAdmin() {

  const [graphData, setGraphData] = useState([]);
  const [graphDataNoN, setGraphDataNoN] = useState([]);
  const [showNoN, setShowNoN] = useState(false);
  const {idAlumno} = useParams();


  useEffect (() => {
    getGraphDataNoN()
  }, [showNoN])

  const getGraphDataNoN = () => {
    axios.post(GRAFICA_ADMIN_NON_URL+"/"+idAlumno).then((response) => {
      setGraphDataNoN(response.data);
    });
  }

  const revealGraphNoN = () => {
    if(graphDataNoN.length > 0){
    setShowNoN(true);
    }
    else{
      alert("No hay datos para mostrar");
    }
  }

  if(showNoN){
    return (
      <div>
        <Card style={{ display: 'flex' }}>
          <Card.Header className='text-center'>
            <h2>Progreso de Alumno</h2>
          </Card.Header>
          <Card.Body>
            <Button 
            className="btnAct"
            onClick={() => setShowNoN(false)}>
              Ocultar Gráfica
            </Button>
            <GraphChart chartData={graphDataNoN} />
          </Card.Body>
        </Card>
      </div>
    )
  }
  return (
    <div>
      <Card
      className='text-center'
      style={{ width: "100%" }}>
        <Card.Header>
          <h2>Visualizar Gráfica de puntajes</h2>
        </Card.Header>
        <Card.Body>
          <Button
          className='btnBancoPreguntas'
          onClick={revealGraphNoN}>
            Ver
            <VscGraph />
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ProgresoGraphAdmin