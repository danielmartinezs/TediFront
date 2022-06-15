import React from 'react';
import { useEffect, useCallback, useState, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
    
  export default function GraphChart({chartData}) {
      
    const [filterFechaStart, setFilterFechaStart] = useState(chartData[0].fecha);
    const [filterFechaEnd, setFilterFechaEnd] = useState(chartData[chartData.length-1].fecha);
    const [dataGraph, setDataGraph] = useState(chartData.map(item => item.puntaje));
    const [labelDateFormat, setLabelDateFormat] = useState(chartData.map(item => new Date(item.fecha).getTime()));
    const [labelGraph, setLabelGraph] = useState(chartData.map(item => format(parseISO(item.fecha), 'PPPp', { locale: es })));
    const [datos, setDatos] = useState({
      labels: labelGraph,
      datasets: [
        {
          label: 'Puntaje',
          data: dataGraph,
          backgroundColor: ["#FE9000"],
          minBarLength: '5',
        },
      ],
    });

    const options = {
      responsive: true,
    };
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
      const filtroData = [...dataGraph];
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
            data: dataGraph,
            backgroundColor: ["#FE9000"],
            minBarLength: '5',
          },
        ],
      });
    }

    return (
    <div>
      {graph}
        <Card>
          <Card.Header className='text-center'>
            <h5>Filtro de Fecha</h5>
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
            </Button>
            <Button
            className="btnAct"
            onClick={resetFiltroFecha}>
              Reset
            </Button>
          </Card.Footer>
        </Card>
      </div>
      );
  }