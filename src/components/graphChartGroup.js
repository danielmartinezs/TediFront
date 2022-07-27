import React from 'react';
import { useEffect, useCallback, useState, useRef } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { alpha } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { AiOutlineCalendar, AiOutlineDownload } from 'react-icons/ai';
    
  export default function GraphChart({chartData}) {
      
    const [filterFechaStart, setFilterFechaStart] = useState(chartData[0].fecha);
    const [filterFechaEnd, setFilterFechaEnd] = useState(chartData[chartData.length-1].fecha);
    const [dataGraphP, setDataGraphP] = useState(chartData.map(item => item.puntaje));
    const [dataGraphA, setDataGraphA] = useState(chartData.map(item => item.nombre));
    const [dataGraph, setDataGraph] = useState([[dataGraphP], [dataGraphA]]);
    const [labelDateFormat, setLabelDateFormat] = useState(chartData.map(item => new Date(item.fecha).getTime()));
    const [labelGraph, setLabelGraph] = useState(chartData.map(item => format(parseISO(item.fecha), 'PPPp', { locale: es })));
    const [datos, setDatos] = useState({
      labels: labelGraph,
      datasets: [
        {
          label: 'Puntaje',
          data: dataGraphP,
          backgroundColor: ["#FE9000"],
          minBarLength: '5',
        },
      ],
    });

    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
      },
    };
    const [nombreArchivo, setNombreArchivo] = useState('');
    const ref = useRef(null);
    const graph = <Bar data={datos} options={options} ref={ref}/>;

    function filtroFecha () {
      const fechaStartHour = new Date(filterFechaStart).getTime();
      const fechaEndHour = new Date(filterFechaEnd).getTime();
      const filtroDate = labelDateFormat.filter(date => date >= fechaStartHour && date <= fechaEndHour);
      const filtroDateHour = filtroDate.map(date => new Date(date));
      const filtroDateHourString = filtroDateHour.map(date => format(date, 'PPPp', { locale: es }));
      const startArrayData = labelDateFormat.indexOf(filtroDate[0]);
      const endArrayData = labelDateFormat.indexOf(filtroDate[filtroDate.length-1]);
      const filtroData = [...dataGraphP];
      filtroData.splice(endArrayData +1, filtroDate.length);
      filtroData.splice(0, startArrayData);
      setDatos({
        labels: filtroDateHourString,
        datasets: [
          {
            label: 'Puntaje',
            data: filtroData,
            backgroundColor: ["#FE9000"],
            borderColor: ["#FE9099"],
            minBarLength: '5',
          },
        ],
      });
    }

    function resetFiltroFecha () {
      setFilterFechaStart(chartData[0].fecha);
      setFilterFechaEnd(chartData[chartData.length-1].fecha);
      setDatos({
        labels: labelGraph,
        datasets: [
          {
            label: 'Puntaje',
            data: dataGraphP,
            backgroundColor: ["#FE9000"],
            minBarLength: '5',
          },
        ],
      });
    }

    function visualizarAlumnos () {
        setLabelGraph(dataGraphA)
        setDatos({
            labels: labelGraph,
            datasets: [
              {
                label: 'Puntaje',
                data: dataGraphP,
                backgroundColor: ["#FE9000"],
                minBarLength: '5',
              },
            ],
        });
    }

    function visualizarFechas () {
        setLabelGraph(labelDateFormat.map(date => format(new Date(date), 'PPPp', { locale: es })))
        setDatos({
            labels: labelGraph,
            datasets: [
              {
                label: 'Puntaje',
                data: dataGraphP,
                backgroundColor: ["#FE9000"],
                minBarLength: '5',
              },
            ],
        });
    }

    function downloadGraph () {
      const canvas = ref.current.toBase64Image();
      const a = document.createElement('a');
      a.href = canvas;
      a.download = nombreArchivo+'.png';
      a.click();
      setNombreArchivo('');
    }

    return (
    <div>
      {graph}
        <Card>
        <Card.Header className='text-center'>
            <h5>Cambiar vista</h5>
            <ButtonGroup>
                <Button
                className='btnAct'
                onClick={visualizarFechas}>
                    Alumnos
                </Button>
                <Button
                className='btnAct'
                onClick={visualizarAlumnos}>
                    Fechas
                </Button>
            </ButtonGroup>
        </Card.Header>
        <Card.Header className='text-center'>
            <h5>Filtro de Fecha</h5>
            {console.log(dataGraph)}
        </Card.Header>
        <Card.Footer className='text-center'>
            <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
              <DateTimePicker
              disableFuture
              variant="dialog"
              label="Fecha de inicio"
              value={filterFechaStart}
              onChange={setFilterFechaStart}/>
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
              <DateTimePicker
              disableFuture
              variant="dialog"
              label="Fecha de fin"
              value={filterFechaEnd}
              onChange={setFilterFechaEnd}/>
            </MuiPickersUtilsProvider>
            <br/>
            <Button
            className="btnAct"
            onClick={filtroFecha}>
              Filtrar por fechas
              <AiOutlineCalendar/>
            </Button>
            <Button
            className="btnAct"
            onClick={resetFiltroFecha}>
              Reset
            </Button>
            <input
            placeholder='Nombre del archivo'
            value={nombreArchivo}
            onChange={e => setNombreArchivo(e.target.value)}
            />
            <br/>
            <Button
            className='btnAct'
            onClick={downloadGraph}>
              Descargar gráfico
              <AiOutlineDownload/>
            </Button>
          </Card.Footer>
        </Card>
      </div>
      );
  }