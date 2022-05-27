import react from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
const GRAFICA_URL = '/graphs/generareporte';

function GraphChart(){
    const [datos, setDatos] = useState([]);
    const [show, setShow] = useState(false);
    const [idAlumno,setIdAlumno] = useState("");
    const [idCuestionario,setIdCuestionario] = useState("");
    const [fecha, setFecha] = useState("");
    const [toggleState, setToggleState] = useState(1);
    const [nombreAlumno, setNombreAlumno] = useState("");
    const [apellidoAlumno, setApellidoAlumno] = useState("");
    const [puntaje, setPuntaje] = useState("");
    var idTutor = localStorage.getItem('id');
    const[graph,setGraph]=useState([]);
    const [datosGraph,setDatosGraph] = useState([]);
 
    const graphDetails = async () => {
      axios.get("http://localhost:3000/graphs/generareporte/3")
      
       .then(response => {
        setDatosGraph(response.data);
       });
       
     }

     useEffect(() => {
      graphDetails();
    }, []);

    const getDatosGraph = () => {
      axios.post(GRAFICA_URL+"/"+idTutor).then((response) => {
        setDatosGraph (response.data)
          console.log(response.data)
      const graphData = response.data;
      let puntaje = [];
      let fecha = [];
      graphData.forEach(element => {
        puntaje.push(element.puntaje);
        fecha.push(element.fecha);
       });
  
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
    useEffect (() => {
        getDatosGraph()
    }, []);
   
    return(
        <div className="container">
            <h4 className="text-center text-primary mt-2 mb-3">Progreso Respuestas a Cuestionario</h4> 
            <div className="row mt-3">
            <div className="col-sm-3">
                
                <div className=""> 
                <table class=" table-bordered graphTable ">
                    
                    <tr>
                        <th>Puntaje</th>
                        <th>Fecha</th>
                    </tr> 
                    { datosGraph.map((name)=>
                        <tr>
                        <td>{name.puntaje}</td>
                        <td>{name.fecha}</td>
                        </tr>                  
                    )}   
                </table>     
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
                        display:true,
                        position:'right'
                        }
                    }}
                    />
                </div>
                
            </div>     
        </div>    
        )
}
export default GraphChart;