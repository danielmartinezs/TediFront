import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import GraphChart from '../../components/graphChart'
import axios from '../../axios/axios';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';

function ProgresoGraphAdmin() {

  const [graphData, setGraphData] = useState([]);
  const [datos, setDatos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [show, setShow] = useState(false);
  const {idAlumno} = useParams();

  useEffect (() => {
    getGraphData()
  }, [])

  const getGraphData = () => {
      axios.post(GRAFICA_ADMIN_URL+"/"+idAlumno).then((response) => {
        setGraphData(response.data);
        setDatos(response.data.puntaje);
        setLabels(response.data.fecha);
      });
  }

  const revealGraph = () => {
    setShow(true);
  }


  if(show){
    return (
      <div style={ {width: 800} }>
        <GraphChart chartData={graphData} />
        <Button 
        className="btnBancoPreguntas"
        onClick={() => setShow(false)}>
          Ocultar Gráfica
        </Button>
      </div>
    )
  }
  return (
    <div>
      <Button
      className='btnBancoPreguntas'
      onClick={revealGraph}>
        Visualizar Gráfica
      </Button>
    </div>
  )
}

export default ProgresoGraphAdmin