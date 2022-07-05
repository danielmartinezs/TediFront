import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Card, Modal } from 'react-bootstrap';
import { VscGraph } from 'react-icons/vsc'
import GraphChartGroup from '../../components/graphChartGroup'
import axios from '../../axios/axios';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
const GRAFICA_ADMIN_GRUPO_URL = '/graphs/generagraphgrupo';

function ProgresoGraphGrupo() {
    const [graphData, setGraphData] = useState([]);
    const [graphDataNoN, setGraphDataNoN] = useState([]);
    const [showNoN, setShowNoN] = useState(false);
    const {idGrupo} = useParams();
  
  
    useEffect (() => {
        getGraphDataGrupo()
    }, [showNoN])
  
    const getGraphDataGrupo = () => {
      axios.post(GRAFICA_ADMIN_GRUPO_URL+"/"+idGrupo).then((response) => {
        setGraphDataNoN(response.data);
      });
    }
  
    const revealGraphNoN = () => {
      setShowNoN(true);
    }
  
    if(showNoN){
      return (
        <div>
          <Card style={{ display: 'flex' }}>
            <Card.Header className='text-center'>
              <h2>Progreso de Grupo</h2>
            </Card.Header>
            <Card.Body>
              <Button 
              className="btnAct"
              onClick={() => setShowNoN(false)}>
                Ocultar Gráfica
              </Button>
              <GraphChartGroup chartData={graphDataNoN} />
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

export default ProgresoGraphGrupo