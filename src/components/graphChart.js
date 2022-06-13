import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
const GRAFICA_ADMIN_URL = '/graphs/generagraphadmin';
    
    export default function GraphChart({chartData}) {
        
      const [datos, setDatos] = useState({
        labels: chartData.map(item => new Date(item.fecha)),
        datasets: [
          {
            label: 'Puntaje',
            data: chartData.map(item => item.puntaje),
          },
        ],
      });

      /* useEffect(() => {
      }, [chartData]); */

      const options = {
        responsive: true,
      };
      
      return <Bar data={datos} options={options} />;
    }