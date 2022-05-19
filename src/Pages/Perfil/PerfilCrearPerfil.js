import { useState } from "react";
import { Alert, Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from '../../axios/axios';
import "./perfil.css";
const CREAR_TUT_URL = '/profiles/newtutor';
const CREAR_ADMIN_URL = '/profiles/newadmin';

function CreatePerfil() {
    const [toggleState, setToggleState] = useState(1);
    const [tipo, setTipo] = useState("");
    const [nombreTutor, setNombreTutor] = useState("");
    const [apellidoTutor, setApellidoTutor] = useState("");
    const [nombreAlumno, setNombreAlumno] = useState("");
    const [apellidoAlumno, setApellidoAlumno] = useState("");
    const [nombreAdmin, setNombreAdmin] = useState("");
    const [apellidoAdmin, setApellidoAdmin] = useState("");
    const [pic, setPic] = useState();
    const [password, setPassword] = useState("");
    const [passwordTutor, setPasswordTutor] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTutor, setConfirmPasswordTutor] = useState("");
    const [fechanac, setFechaNac] = useState("");
    const [semestre, setSemestre] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    
    const toggleTab = (index) => {
        setToggleState(index);
        console.log(toggleState);
    };
    
    const handleSubmitA = async (e) => {
        e.preventDefault();
        console.log(nombreAdmin)
        console.log(apellidoAdmin)
        console.log(password)
        console.log(confirmPassword)
        try{
            const response = await axios.post(CREAR_ADMIN_URL, {
                nombread: nombreAdmin,
                apellidoad: apellidoAdmin,
                password: password,
                confpassword: confirmPassword
            })
          if(response.status === 200){
            setShow(true)
            setVariante('success')
            setMsg('Administrador creado con éxito!')
          }
        }catch(error){
          setShow(true)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          } else if(error.response?.status === 401){
            setMsg('Usuario sin autorización');
            setVariante('danger');
          } else if(error.response?.status === 403){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
        }
    }

    const handleSubmitT = async (e) => {
        e.preventDefault();
        try{
          const response = await axios.post(CREAR_TUT_URL, {
            nombretut: nombreTutor+" "+apellidoTutor,
            password: passwordTutor,
            confpassword: confirmPasswordTutor,
            nombrealu: nombreAlumno,
            apellidoalu: apellidoAlumno,
            nacimiento: fechanac,
            schoolmester: semestre,
            foto: pic
          })
          if(response.status === 200){
            setShow(true)
            setVariante('success')
            setMsg('Tutor y alumno creados con éxito!')
          }
        }catch(error){
          setShow(true)
          if(!error?.response){
            setMsg('No hay respuesta del servidor');
            setVariante('danger');
          } else if(error.response?.status === 400){
            setMsg(error.response.data.message);
            setVariante('danger');
          } else if(error.response?.status === 401){
            setMsg('Usuario sin autorización');
            setVariante('danger');
          } else if(error.response?.status === 403){
            setMsg(error.response.data.message);
            setVariante('danger');
          } else if(error.response?.status === 404){
            setMsg(error.response.data.message);
            setVariante('danger');
          }
        }
    }

  return (
    <div>
      <Alert 
        show={show}
        variant={variante}
        onClose={() => setShow(false)}
        dismissible>
          <Alert.Heading>
            {msg}
          </Alert.Heading>
      </Alert>
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Tutor
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Administrador
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content active-content" : "content"}
        >
          <Row className="tutorContainer">
          <Col>
            <Form>
            <Form.Group controlId="nombretut">
                <Form.Label>Nombre del tutor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del tutor"
                  value={nombreTutor}
                  maxLength= "50"
                  onChange={(e) => setNombreTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="apellidotut">
                <Form.Label>Apellido del tutor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apellido del tutor"
                  value={apellidoTutor}
                  maxLength= "50"
                  onChange={(e) => setApellidoTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nueva Contraseña"
                  value={passwordTutor}
                  maxLength= "250"
                  minLength={8}
                  onChange={(e) => setPasswordTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Repetir Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Repetir Contraseña"
                  value={confirmPasswordTutor}
                  maxLength= "250"
                  minLength={8}
                  onChange={(e) => setConfirmPasswordTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre del alumno</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del alumno"
                  value={nombreAlumno}
                  maxLength= "50"
                  onChange={(e) => setNombreAlumno(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="apellido">
                <Form.Label>Apellido del alumno</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apellido del alumno"
                  value={setApellidoAlumno}
                  maxLength= "50"
                  onChange={(e) => setApellidoAlumno(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="fechanac">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Seleccione la fecha de nacimiento"
                  value={semestre}
                  onChange={(e) => setFechaNac(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="semestre">
                <Form.Label>Semestre Escolar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Seleccione Semestre Escolar"
                  value={semestre}
                  maxLength= "20"
                  onChange={(e) => setSemestre(e.target.value)}
                ></Form.Control>
              </Form.Group>
            <Form.Group controlId="formFileSm" className="mb-3">
                  <Form.Label>Sube foto</Form.Label>
                  <Form.Control
                    type="file"
                    size="sm"
                    onChange={(e) => setPic(e.target.value)}
                  ></Form.Control>
            </Form.Group>
            <Button 
              type="submit"
              //variant="success"
              className = "btnCrear"
              onSubmit ={handleSubmitT}>
                Crear
            </Button>
          </Col>
        </Row>
        </div>

        <div
          className = {toggleState === 2 ? "content  active-content" : "content"}
        >
        <Row className="adminContainer">
            <Form onSubmit={handleSubmitA}>
                <Form.Group controlId="nombread">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del administrador"
                    value={nombreAdmin}
                    maxLength= "37"
                    onChange={(e) => setNombreAdmin(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="apellidoad">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido del administrador"
                    value={apellidoAdmin}
                    maxLength= "36"
                    onChange={(e) => setApellidoAdmin(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="passwordad">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nueva Contraseña"
                    value={password}
                    maxLength= "250"
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirmpasswordad">
                  <Form.Label>Repetir Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repetir Contraseña"
                    value={confirmPassword}
                    maxLength= "250"
                    minLength={8}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              <br/>
              <Button 
                type="submit"
                className = "btnCrear"
                onSubmit ={handleSubmitA}>
                  Crear
              </Button>
              </Form>
          </Row>
        </div>
      </div>
      </div>
  );
}

export default CreatePerfil;