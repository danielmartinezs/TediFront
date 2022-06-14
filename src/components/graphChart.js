import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
    
  export default function GraphChart({chartData}) {
        
      const [datos, setDatos] = useState({
        labels: chartData.map(item => format(parseISO(item.fecha), 'PPPp', { locale: es })),
        datasets: [
          {
            label: 'Puntaje',
            data: chartData.map(item => item.puntaje),
            backgroundColor: ["#FE9000"],
            minBarLength: '5',
          },
        ],
      });

      console.log(datos)

      const options = {
        responsive: true,
      };

      return <Bar data={datos} options={options} />;
  }