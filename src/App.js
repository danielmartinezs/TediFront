import React from 'react';
import './App.css';
import NavbarComp from "./components/Navbar/NavbarComp";
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Reportes from './Pages/Reportes/Reportes'
import Login from './Pages/Login/Login'
import Progreso from './Pages/Progreso/Progreso'
import Alumnos from './Pages/Alumnos/Alumnos'
import HomeAdmin from './Pages/Home/HomeAdmin'
import ReportesAdmin from './Pages/Reportes/ReportesAdmin'
import ReportesAlumAdmin from './Pages/Reportes/ReportesAlumAdmin.js'
import ReportesEdicionAdmin from './Pages/Reportes/ReportesEdicionAdmin'
import ReportesNuevoAdmin from './Pages/Reportes/ReportesNuevoAdmin'
import ProgresoAdmin from './Pages/Progreso/ProgresoAdmin'
import ProgresoAlumAdmin from './Pages/Progreso/ProgresoAlumAdmin'
import CuestionariosAdmin from './Pages/Cuestionarios/CuestionariosAdmin'
import CuestionariosCreacionAdmin from './Pages/Cuestionarios/CuestionariosCreacionAdmin'
import CuestionariosEdicionAdmin from './Pages/Cuestionarios/CuestionariosEdicionAdmin'
import CuestionariosResponderAdmin from './Pages/Cuestionarios/CuestionariosResponderAdmin'
import PerfilSeleccionAdmin from './Pages/Perfil/PerfilSeleccionAdmin'
import PerfilEditarAdmin from './Pages/Perfil/PerfilEditarAdmin'
import PerfilEditarTutor from './Pages/Perfil/PerfilEditarTutor'
import PerfilCrearPerfilNuevo from './Pages/Perfil/PerfilCrearPerfilNuevo'
import PerfilPadre from './Pages/Perfil/PerfilPadre'
import GraphChart from './Pages/Progreso/GraphChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import privateRoute from './components/privateRoute.js';


function App() {
  return (      
          <div className="App">
            <NavbarComp/>
            <div>
              <Routes>               
          
              <Route exact path="/Login" element={<Login/>}/>

              <Route exact path="/HomeAdmin" element={<privateRoute roles = {["admin"]}><HomeAdmin/></privateRoute>}/>
                  {/*Aqui abajo es la pagina principal del usuario administrador*/}

                  <Route exact path="/Alumnos" element={<privateRoute roles = {["admin"]}><Alumnos/></privateRoute>}/>

                  <Route exact path="/ReportesAdmin" element={<privateRoute roles = {["admin"]}><ReportesAdmin/></privateRoute>}/>
                  <Route exact path="/ReportesAlumAdmin" element={<privateRoute roles ={["admin"]}><ReportesAlumAdmin/></privateRoute>}/>
                  <Route exact path="/ReportesEdicionAdmin" element={<privateRoute roles ={["admin"]}><ReportesEdicionAdmin/></privateRoute>}/>
                  <Route exact path="/ReportesNuevoAdmin" element={<privateRoute roles = {["admin"]}><ReportesNuevoAdmin/></privateRoute>}/>

                  <Route exact path="/ProgresoAdmin" element={<privateRoute roles = {["admin"]}><ProgresoAdmin/></privateRoute>}/>
                  <Route exact path="/ProgresoAlumAdmin" element={<privateRoute roles = {["admin"]}><ProgresoAlumAdmin/></privateRoute>}/>

                  <Route exact path="/CuestionariosAdmin" element={<privateRoute roles = {["admin"]}><CuestionariosAdmin/></privateRoute>}/>
                  <Route exact path="/CuestionariosCreacionAdmin" element={<privateRoute roles = {["admin"]}><CuestionariosCreacionAdmin/></privateRoute>}/>
                  <Route exact path="/CuestionariosEdicionAdmin/:idCuestionario" element={<privateRoute roles = {["admin"]}><CuestionariosEdicionAdmin/></privateRoute>}/>
                  <Route exact path="/CuestionariosResponderAdmin/:idAlumno" element={<privateRoute roles = {["admin"]}><CuestionariosResponderAdmin/></privateRoute>}/>

                  <Route exact path="/PerfilSeleccionAdmin" element={<privateRoute roles = {["admin"]}><PerfilSeleccionAdmin/></privateRoute>}/>
                  <Route exact path="/PerfilCrearPerfilNuevo" element={<privateRoute roles = {["admin"]}><PerfilCrearPerfilNuevo/></privateRoute>}/>
                  <Route exact path="/PerfilEditarAdmin" element={<privateRoute roles = {["admin"]}><PerfilEditarAdmin/></privateRoute>}/>
                  <Route exact path="/PerfilEditarTutor" element={<privateRoute roles = {["admin"]}><PerfilEditarTutor/></privateRoute>}/>
                 
                  {/*Aqui abajo es la pagina principal del usuario padre*/}
                  <Route exact path="/Home" element={<privateRoute roles = {["tutor"]}><Home/></privateRoute>}/>
                  <Route exact path="/Reportes" element={<privateRoute roles = {["tutor"]}><Reportes/></privateRoute>}/>
                  <Route exact path="/Progreso" element={<privateRoute roles = {["tutor"]}><Progreso/></privateRoute>}/>
                  <Route exact path="/GraphChart" element={<privateRoute roles = {["tutor"]}><GraphChart/></privateRoute>}/>
                  <Route exact path="/PerfilPadre" element={<privateRoute roles = {["tutor"]}><PerfilPadre/></privateRoute>}/>
                  
              </Routes>
            </div> 
          </div>
  )
}
  
export default App;