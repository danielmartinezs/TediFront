import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
const GRAFICA_URL = '/graphs/generareporte';

function GraphChart(){
    const [datos, setDatos] = useState([]);
    const [puntaje, setPuntaje] = useState("");
    const [datosLlenos, setDatosLlenos] = useState(false);
    var idTutor = localStorage.getItem('id');
    const[graph,setGraph]=useState([]);
    let [datosGraph,setDatosGraph] = useState([]);
    let [puntajeArray,setPuntajeArray] = useState([]);
    let [fechaDateArray,setFechaDateArray] = useState([]);
 
    useEffect(() => {
      graphDetails();
    }, []); 

     const graphDetails = () => {
      axios.post(GRAFICA_URL+"/"+idTutor).then((response) => {
        console.log(response);
        setDatosGraph(response.data);
    
    const graphData = response.data;
      let puntaje = [];
      let fecha = [];
      graphData.forEach(element => {
        puntaje.push(element.puntaje);
        fecha.push(element.fecha);
       });
        setPuntajeArray(puntaje);
        setFechaDateArray(fecha);
        setGraph({
            labels: puntaje,
            datasets: [
              {
                label: 'Progreso',
                backgroundColor:[
                    '#1D3F94',
                 ],
                borderWidth:0,
                data: fecha
              }
             ]
        }); 
       }); 
     }

    const getDatosGraph = async() => {
      axios.post(GRAFICA_URL+"/"+idTutor).then((response) => {
          console.log(response.data);
    const graphData = response.data;
      let puntaje = [];
      let fecha = [];
      graphData.forEach(element => {
        puntaje.push(element.puntaje);
        fecha.push(element.fecha);
       });
        setPuntajeArray(puntaje);
        setFechaDateArray(fecha);
        setGraph({
            labels: puntaje,
            datasets: [
              {
                label: 'Progreso',
                backgroundColor:[
                    '#1D3F94',
                 ],
                borderWidth:0,
                data: fecha
              }
             ]
        }); 
      });
      setDatosLlenos(true);
    }
    useEffect(() => {
         getDatosGraph()
      }, []);

      if(datosLlenos){
        return(
          <div className="container">
          {console.log("datosGraph"+datosGraph)}
            <h4 className="text-center text-primary mt-2 mb-3">Progreso Respuestas a Cuestionario</h4> 
            <div className="row mt-3">
            <div className="col-sm-3">
                
                <div className=""> 
                      { !datosLlenos?                 
                      <table className=" table-bordered graphTable ">
                <thead> 
                <tr>
                        <th>Puntaje</th>
                       {/*  <th>Fecha</th> */}
                    </tr> 
                </thead>
                <tbody>
                          {puntajeArray.map((name=>{
                          <tr>
                          <td>
                              {name.puntaje}
                          </td>
{/*                           <td>
                            {name.fecha}
                          </td> */}
                    </tr>}))}
                    </tbody> 
                   </table>  
                          :<div>no</div>
                      }   
                </div>
            </div>     
            <div className="col-sm-9">
            <Bar
                data={graph}
                    options={{
                        title:{
                        display:true,
                        text:'Reporte del alumno',
                        fontSize:20
                        },
                        legend:{
                        display: true,
                        position:'right'
                        }
                    }}
                    />
                </div>
                
            </div>     
        </div>    
        )
      }
    return(
        <div className="container">
          <button
          onClick={
            getDatosGraph
          }>
            Get datos</button>
          </div>
        )
}
export default GraphChart;