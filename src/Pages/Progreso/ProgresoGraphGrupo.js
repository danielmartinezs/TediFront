import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { Button, Card, Modal } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
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
              <h2>Progreso de Grupo</h2>
            </Card.Header>
            <Card.Body>
              <Button 
              className="btnAct"
              onClick={() => setShowNoN(false)}>
                Ocultar Gráfica
                <AiOutlineEyeInvisible/>
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
            <h2>Visualizar gráfica de puntajes grupal</h2>
          </Card.Header>
          <Card.Body>
            <Button
            className='btnBancoPreguntas'
            onClick={revealGraphNoN}>
              Ver
              <AiOutlineEye />
            </Button>
          </Card.Body>
          <Card.Footer>
            <Link to={`/ProgresoGrupoAdmin`}>
            <Button
            className='btnAct'>
              Regresar
            </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    )
  }

export default ProgresoGraphGrupo