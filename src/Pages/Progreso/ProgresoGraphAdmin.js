import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Card, Modal } from 'react-bootstrap';
import { VscGraph } from 'react-icons/vsc'
import GraphChart from '../../components/graphChart'
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker } from "@material-ui/pickers";
import { es } from 'date-fns/locale'
import axios from '../../axios/axios';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
const GRAFICA_ADMIN_NON_URL = '/graphs/generagraphadminnon';

function ProgresoGraphAdmin() {

  const [graphData, setGraphData] = useState([]);
  const [graphDataNoN, setGraphDataNoN] = useState([]);
  const [graphDataFilter, setGraphDataFilter] = useState([]);
  const [show, setShow] = useState(false);
  const [showNoN, setShowNoN] = useState(false);
  const {idAlumno} = useParams();

  useEffect (() => {
    getGraphData()
  }, [show])

  useEffect (() => {
    getGraphDataNoN()
  }, [showNoN])

  const getGraphData = () => {
      axios.post(GRAFICA_ADMIN_URL+"/"+idAlumno).then((response) => {
        setGraphData(response.data);
      });
  }

  const getGraphDataNoN = () => {
    axios.post(GRAFICA_ADMIN_NON_URL+"/"+idAlumno).then((response) => {
      setGraphDataNoN(response.data);
    });
  }

  const revealGraph = () => {
    setShow(true);
  }

  const revealGraphNoN = () => {
    setShowNoN(true);
  }

  if(show){
    return (
      <div>
        <Card style={{ display: 'flex'}}>
          <Card.Header className='text-center'>
            <h2>Progreso de Alumno</h2>
          </Card.Header>
          <Card.Body>
            <Button 
            className="btnAct"
            onClick={() => setShow(false)}>
              Ocultar Gráfica
            </Button>
            <GraphChart chartData={graphData} />
          </Card.Body>
        </Card>
      </div>
    )
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
          <h2>Visualizar Gráfica</h2>
        </Card.Header>
        <Card.Body>
          <Button
          className='btnBancoPreguntas'
          onClick={revealGraph}>
            Ver
            <VscGraph />
          </Button>
        </Card.Body>
      </Card>
      <Card
      className='text-center'
      style={{ width: "100%" }}>
        <Card.Header>
          <h2>Visualizar Gráfica de preguntas de opción múltiple</h2>
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