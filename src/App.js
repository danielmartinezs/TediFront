import React from 'react';
import './App.css';
import NavbarAdmin from "./components/Navbar/NavbarAdmin";
import NavbarPadre from "./components/Navbar/NavbarPadre";
import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import ConfigOptions from './components/configOptions';
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Reportes from './Pages/Reportes/Reportes'
import Progreso from './Pages/Progreso/Progreso'
import Alumnos from './Pages/Alumnos/Alumnos'
import HomeAdmin from './Pages/Home/HomeAdmin'
import ReportesAdmin from './Pages/Reportes/ReportesAdmin'
import ReportesAlumAdmin from './Pages/Reportes/ReportesAlumAdmin.js'
import ReportesEdicionAdmin from './Pages/Reportes/ReportesEdicionAdmin'
import ReportesNuevoAdmin from './Pages/Reportes/ReportesNuevoAdmin'
import ReportesNuevoRegistroAdmin from './Pages/Reportes/ReportesNuevoRegistroAdmin'
import ProgresoAdmin from './Pages/Progreso/ProgresoAdmin'
import ProgresoAlumAdmin from './Pages/Progreso/ProgresoAlumAdmin'
import ProgresoGrupoAdmin from './Pages/Progreso/ProgresoGrupoAdmin'
import ProgresoGraphAdmin from './Pages/Progreso/ProgresoGraphAdmin'
import ProgresoGraphGrupo from './Pages/Progreso/ProgresoGraphGrupo'
import CuestionariosAdmin from './Pages/Cuestionarios/CuestionariosAdmin'
import CuestionariosRegistrosAdmin from './Pages/Cuestionarios/CuestionariosRegistrosAdmin'
import CuestionariosCreacionAdmin from './Pages/Cuestionarios/CuestionariosCreacionAdmin'
import CuestionariosEdicionAdmin from './Pages/Cuestionarios/CuestionariosEdicionAdmin'
import CuestionariosResponderAdmin from './Pages/Cuestionarios/CuestionariosResponderAdmin'
import PerfilSeleccionAdmin from './Pages/Perfil/PerfilSeleccionAdmin'
import PerfilEditarAdmin from './Pages/Perfil/PerfilEditarAdmin'
import PerfilEditarAlumno from './Pages/Perfil/PerfilEditarAlumno'
import PerfilEditarTutor from './Pages/Perfil/PerfilEditarTutor'
import PerfilCrearPerfilNuevo from './Pages/Perfil/PerfilCrearPerfilNuevo'
import PerfilPadre from './Pages/Perfil/PerfilPadre'
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/privateRoute.js';
import axios from "axios"

axios.defaults.baseURL ="https://backend.tediescolar.org/";
axios.defaults.headers.common["access-control-allow-origin"] = "*";

function App() {
  if(localStorage.getItem('token') === null){
    return <Login/>
  }
  else if(localStorage.getItem('role') === 'admin'){
  return (      
          <div className="App">
            <NavbarAdmin/>
            <div>
              <Routes>
                <Route exact path="/logout" element={<PrivateRoute roles = {["admin"]}><Logout/></PrivateRoute>} />
                <Route exact path="/configOptions" element={<PrivateRoute roles = {["admin"]}><ConfigOptions/></PrivateRoute>} />
                <Route exact path="/HomeAdmin" element={<PrivateRoute roles = {["admin"]}><HomeAdmin/></PrivateRoute>}/>
                  {/*Aqui abajo es la pagina principal del usuario administrador*/}

                  <Route exact path="/Alumnos" element={<PrivateRoute roles = {["admin"]}><Alumnos/></PrivateRoute>}/>

                  <Route exact path="/ReportesAdmin" element={<PrivateRoute roles = {["admin"]}><ReportesAdmin/></PrivateRoute>}/>
                  <Route exact path="/ReportesAlumAdmin" element={<PrivateRoute roles ={["admin"]}><ReportesAlumAdmin/></PrivateRoute>}/>
                  <Route exact path="/ReportesEdicionAdmin" element={<PrivateRoute roles ={["admin"]}><ReportesEdicionAdmin/></PrivateRoute>}/>
                  <Route exact path="/ReportesNuevoAdmin" element={<PrivateRoute roles = {["admin"]}><ReportesNuevoAdmin/></PrivateRoute>}/>
                  <Route exact path="/ReportesNuevoRegistroAdmin/:timestamp" element={<PrivateRoute roles = {["admin"]}><ReportesNuevoRegistroAdmin/></PrivateRoute>}/>

                  <Route exact path="/ProgresoAdmin" element={<PrivateRoute roles = {["admin"]}><ProgresoAdmin/></PrivateRoute>}/>
                  <Route exact path="/ProgresoAlumAdmin" element={<PrivateRoute roles = {["admin"]}><ProgresoAlumAdmin/></PrivateRoute>}/>
                  <Route exact path="/ProgresoGrupoAdmin" element={<PrivateRoute roles = {["admin"]}><ProgresoGrupoAdmin/></PrivateRoute>}/>
                  <Route exact path="/ProgresoGraphAdmin/:idAlumno" element={<PrivateRoute roles = {["admin"]}><ProgresoGraphAdmin/></PrivateRoute>}/>
                  <Route exact path="/ProgresoGraphGrupo/:idGrupo" element={<PrivateRoute roles = {["admin"]}><ProgresoGraphGrupo/></PrivateRoute>}/>

                  <Route exact path='/CuestionariosAdmin' element={<PrivateRoute roles = {["admin"]}><CuestionariosAdmin/></PrivateRoute>}/>
                  <Route exact path="/CuestionariosRegistrosAdmin" element={<PrivateRoute roles = {["admin"]}><CuestionariosRegistrosAdmin/></PrivateRoute>}/>
                  <Route exact path="/CuestionariosCreacionAdmin" element={<PrivateRoute roles = {["admin"]}><CuestionariosCreacionAdmin/></PrivateRoute>}/>
                  <Route exact path="/CuestionariosEdicionAdmin/:idCuestionario" element={<PrivateRoute roles = {["admin"]}><CuestionariosEdicionAdmin/></PrivateRoute>}/>
                  <Route exact path="/CuestionariosResponderAdmin/:idAlumno" element={<PrivateRoute roles = {["admin"]}><CuestionariosResponderAdmin/></PrivateRoute>}/>

                  <Route exact path="/PerfilSeleccionAdmin" element={<PrivateRoute roles = {["admin"]}><PerfilSeleccionAdmin/></PrivateRoute>}/>
                  <Route exact path="/PerfilCrearPerfilNuevo" element={<PrivateRoute roles = {["admin"]}><PerfilCrearPerfilNuevo/></PrivateRoute>}/>
                  <Route exact path="/PerfilEditarAdmin" element={<PrivateRoute roles = {["admin"]}><PerfilEditarAdmin/></PrivateRoute>}/>
                  <Route exact path="/PerfilEditarAlumno" element={<PrivateRoute roles = {["admin"]}><PerfilEditarAlumno/></PrivateRoute>}/>
                  <Route exact path="/PerfilEditarTutor" element={<PrivateRoute roles = {["admin"]}><PerfilEditarTutor/></PrivateRoute>}/>
              </Routes>
            </div>
          </div>
  );
  }
  else if(localStorage.getItem('role') === 'tutor'){
    return (
      <div className="app">
        <NavbarPadre/>
        <div>
          <Routes>
            <Route exact path="/logout" element={<PrivateRoute roles = {["tutor"]}><Logout/></PrivateRoute>} />
            {/*Aqui abajo es la pagina principal del usuario padre*/}
            <Route exact path="/Home" element={<PrivateRoute roles = {["tutor"]}><Home/></PrivateRoute>}/>
            <Route exact path="/Reportes" element={<PrivateRoute roles = {["tutor"]}><Reportes/></PrivateRoute>}/>
            <Route exact path="/Progreso" element={<PrivateRoute roles = {["tutor"]}><Progreso/></PrivateRoute>}/>
            <Route exact path="/PerfilPadre" element={<PrivateRoute roles = {["tutor"]}><PerfilPadre/></PrivateRoute>}/>
          </Routes>
        </div>
      </div> 
  );
  }
}
  
export default App;