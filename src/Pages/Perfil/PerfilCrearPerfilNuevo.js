import { useEffect, useState } from "react";
import { Alert, Button, Card, ListGroup, ListGroupItem, Modal, Offcanvas, Tab, Tabs } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from "@material-ui/pickers";
import { AiOutlineUserAdd } from 'react-icons/ai';
import { es } from 'date-fns/locale'
import "./perfil.css";
const GET_GRUPOS_URL = '/profiles/getgrupos';
const GET_SEMESTRE_URL = 'reportes/getsemestre';
const CREAR_TUT_URL = '/profiles/newtutor';
const CREAR_ADMIN_URL = '/profiles/newadmin';

function CreatePerfil() {
    const [nombreTutor, setNombreTutor] = useState("");
    const [apellidoTutor, setApellidoTutor] = useState("");
    const [nombreAlumno, setNombreAlumno] = useState("");
    const [apellidoAlumno, setApellidoAlumno] = useState("");
    const [nombreAdmin, setNombreAdmin] = useState("");
    const [apellidoAdmin, setApellidoAdmin] = useState("");
    const [pic, setPic] = useState("");
    const [picPreview, setPicPreview] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordTutor, setPasswordTutor] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTutor, setConfirmPasswordTutor] = useState("");
    const [fechanac, setFechaNac] = useState();
    const [grupo, setGrupo] = useState("");
    const [grupoSelect, setGrupoSelect] = useState(0);
    const [gruposList, setGruposList] = useState([]);
    const [semestre, setSemestre] = useState("");
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [showModalGrupos, setShowModalGrupos] = useState(false);
    const [showModalFoto, setShowModalFoto] = useState(false);
    const [showOffFoto, setShowOffFoto] = useState(false);
    const [showA, setShowA] = useState(false);
    
    useEffect(() => {
      getGruposList();
      getSemestre();
    }, []);

    const getGruposList = async () => {
      axios.get(GET_GRUPOS_URL).then((response) => {
        setGruposList(response.data);
      })
    }

    const getSemestre = () => {
      axios.get(GET_SEMESTRE_URL).then((response) => {
          setSemestre(response.data)
      })
    }

    const handleFechaNueva = (date) => {
      setFechaNac(date)
      console.log(date)
    }

    const scrollToTop = () => {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
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
            setShowA(true)
            setVariante('success')
            setMsg('Administrador creado con éxito!')
            setNombreAdmin("")
            setApellidoAdmin("")
            setPassword("")
            setConfirmPassword("")
          }
        }catch(error){
          setShowA(true)
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

    const handleSubmitTA = async (e) => {
      scrollToTop()  
      e.preventDefault();
        try{
          const response = await axios.post(CREAR_TUT_URL, {
            nombretut: nombreTutor+" "+apellidoTutor,
            password: passwordTutor,
            confpassword: confirmPasswordTutor,
            nombrealu: nombreAlumno,
            apellidoalu: apellidoAlumno,
            nacimiento: fechanac,
            schoolmester: semestre[0].idSemestre,
            foto: pic,
            grupo: grupoSelect
          })
          if(response.status === 200){
            setShowA(true)
            setVariante('success')
            setMsg('Tutor y alumno creados con éxito!')
            setNombreTutor("")
            setApellidoTutor("")
            setPasswordTutor("")
            setConfirmPasswordTutor("")
            setNombreAlumno("")
            setApellidoAlumno("")
            setFechaNac()
            setSemestre("")
            setPic()
            setPicPreview()
            setGrupoSelect(0)
            setGrupo("")
          }
        }catch(error){
          setShowA(true)
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
      <div className='alertas'>
        <Alert 
        show={showA}
        variant={variante}
        onClose={() => setShowA(false)}
        dismissible>
          <Alert.Heading>
            {msg}
          </Alert.Heading>
        </Alert>
      </div>
      <Tabs justify variant="pills" defaultActiveKey="tutor" id="crearperfilnuevo">
        <Tab eventKey="tutor" title="Tutor y Alumno" className="content">
          <Form 
          className="form"
          onSubmit={handleSubmitTA}>
            <h3>Información del Tutor</h3>
            <br/>
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
                  type="text"
                  placeholder="Contraseña debe tener un dígito, una letra minúscula, una letra mayúscula, un caracter especial, y una longitud de más de 8 caracteres"
                  value={passwordTutor}
                  maxLength= "250"
                  minLength={8}
                  onChange={(e) => setPasswordTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Repetir Contraseña</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Repetir contraseña"
                  value={confirmPasswordTutor}
                  maxLength= "250"
                  minLength={8}
                  onChange={(e) => setConfirmPasswordTutor(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <br/>
              <h3>Información del Alumno</h3>
              <br/>
                <Form.Group controlId="foto">
                    <Button
                    className="btnBancoPreguntas"
                    onClick={() => {setShowModalFoto(true)}}>
                      Foto del alumno
                    </Button>
                    <br/>
                </Form.Group>
                <br/>
                <Form.Label>Foto del alumno:</Form.Label>
                {pic !== '' ?
                <div>   
                <h3>{pic}</h3>
                </div> 
                :
                <div>   
                <h3>Alumno sin foto</h3>
                </div> 
                }
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
                    value={apellidoAlumno}
                    maxLength= "50"
                    onChange={(e) => setApellidoAlumno(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <br/>
                    <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                          <DatePicker
                          disableFuture
                          openTo="year"
                          variant="dialog"
                          format="yyyy/MM/dd"
                          label="Fecha de Nacimiento"
                          views={["year", "month", "date"]}
                          value={fechanac}
                          onChange={handleFechaNueva}/>
                    </MuiPickersUtilsProvider>
                </Form.Group>
                <br/>
                <Form.Group controlId="grupo">
                    <Button
                    className="btnBancoPreguntas"
                    onClick={() => {setShowModalGrupos(true)}}>
                      Grupos
                    </Button>
                    <br/>
                    <Form.Label>Grupo asignado:</Form.Label>
                    <br/>
                    <h3>{grupo}</h3>
                </Form.Group>
                <Form.Group controlId="semestre">
                    <Form.Label>Semestre Escolar</Form.Label>
                    <br/>
                    <h3>{semestre[0]?.periodo}</h3>
                </Form.Group>
                <br/>
                <Button 
                type="submit"
                className = "btnCrear"
                onSubmit ={handleSubmitTA}>
                    Crear
                    <AiOutlineUserAdd/>
                </Button>
          </Form>
          {/*MODAL GRUPOS */}
          <Modal
          show={showModalGrupos}
          scrollable
          onHide={() => {setShowModalGrupos(false)}}>
            <Modal.Header
            closeButton>
              <Modal.Title><h3>Grupos</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card className="text-center">
                <Card.Body>
                  {gruposList.map((grupo, index) => {
                    return (
                      <ListGroup>
                        <ListGroupItem>
                          <div key={index}>
                            <h4>{grupo.nombre}</h4>
                            <Button
                            variant="success"
                            onClick={() => {
                              setGrupo(grupo.nombre)
                              setGrupoSelect(grupo.idGrupo)
                              setShowModalGrupos(false)
                            }}>
                              Seleccionar
                            </Button>
                          </div>
                        </ListGroupItem>
                      </ListGroup>
                    )
                  }
                  )}
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
          {/*MODAL FOTO */}
          <Modal
          show={showModalFoto}
          scrollable
          onHide={() => {
            setShowModalFoto(false)
            setPicPreview(false)}}>
            <Modal.Header
            closeButton>
              <Modal.Title><h3>Foto del alumno</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card className="text-center">
                <Card.Body>
                {pic === '' ? 
                <div>
                  <h4>
                    Actualmente no se tiene una foto del alumno, da click en el botón para ingresar la foto del alumno
                  </h4>
                  <br/>
                  <Button
                  variant="success"
                  className="btnEditarRespuesta"
                  onClick={() => {
                    setShowOffFoto(true)
                    setShowModalFoto(false)
                  //setPicPreview(!picPreview)
                  }}>
                    Ingresar foto desde Google Drive
                  </Button>
                  <Button
                  variant="danger"
                  className="btnEditarRespuesta"
                  onClick={() => {
                  setPicPreview(false)
                  setShowModalFoto(false)
                  }}>
                    Saltar paso
                  </Button>
                </div>
                : 
                <div>
                <h3>
                  La foto se encuentra en:
                  <br/>
                  {pic}
                </h3>
                <Button
                variant="success"
                className="btnEditarRespuesta"
                onClick={() => {
                  setShowOffFoto(true)
                  setShowModalFoto(false)
                }}>
                  Editar registro
                </Button>
                </div>
                }
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
          {/*OFFCANVAS REGISTRO FOTO*/}
          <Offcanvas 
            show={showOffFoto} 
            placement={'bottom'}
            onHide={() => setShowOffFoto(false)}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Registro de foto del alumno</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="newNombreC">
                  <Form.Label>Ingresa el URL donde se encuentra la foto</Form.Label>
                    <Form.Control 
                    as="textarea"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}>
                      {pic}
                    </Form.Control>
                </Form.Group>
                <Button 
                  size='sm'
                  variant="danger"
                  onClick={() => {
                    setShowOffFoto(false)
                    setPic("")}}>
                    Cerrar
                  </Button>
                  <Button
                  size='sm'
                  variant="success"
                  onClick={() => {
                    setShowOffFoto(false)}}>
                    Guardar
                  </Button>
              </Form>
            </Offcanvas.Body>
          </Offcanvas>
      </Tab>
      <Tab 
        eventKey="admin" 
        title="Administrador" 
        className="content">
          <Form 
            className="form" 
            onSubmit={handleSubmitA}>
              <h3>Información del Administrador</h3>
              <br/>
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
                    type="text"
                    placeholder="Contraseña debe tener un dígito, una letra minúscula, una letra mayúscula, un caracter especial, y una longitud de más de 8 caracteres"
                    value={password}
                    maxLength= "250"
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirmpasswordad">
                  <Form.Label>Repetir Contraseña</Form.Label>
                  <Form.Control
                    type="text"
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
                  <AiOutlineUserAdd/>
              </Button>
          </Form>
      </Tab>
    </Tabs>
      </div>
  );
}

export default CreatePerfil;