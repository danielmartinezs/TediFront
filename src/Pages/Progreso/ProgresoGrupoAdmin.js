import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Alert, Button, Card, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas } from'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSearch, AiOutlineSelect } from 'react-icons/ai';
import "./progreso.css"
const GET_GRUPOS_URL = '/profiles/getgrupos'
const GET_ALUMNOS_GRUPO_URL = '/profiles/getalumnosgrupo'

function ProgresoGrupoAdmin() {
  
    const [grupo, setGrupo] = useState("");
    const [grupoSearch, setGrupoSearch] = useState([]);
    const [grupoSelect, setGrupoSelect] = useState(0);
    const [gruposList, setGruposList] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [alumnosList, setAlumnosList] = useState([]);
    const [alumnoSelect, setAlumnoSelect] = useState(0);
    const [showModalAlumnos, setShowModalAlumnos] = useState(false);

    useEffect(() => {
      getGruposList()
    }, [])

    const getGruposList = async () => {
      axios.get(GET_GRUPOS_URL).then((response) => {
        setGruposList(response.data);
        setGrupoSearch(response.data);
      })
    }

    const getAlumnosGrupo = async (idg) => {
      axios.get(GET_ALUMNOS_GRUPO_URL+"/"+idg).then((response) => {
        setAlumnosList(response.data);
      })
      setGrupoSelect(idg)
      setShowModalAlumnos(true)
    }
        

    const filtrar = (terminoBusqueda) => {
      var resultadosBusqueda = gruposList.filter( (elemento) => {
          if(terminoBusqueda === ""){
              setGrupoSearch(gruposList)
              return elemento;
          }
          else if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()))
          {
              return elemento;
          }
      });
      setGrupoSearch(resultadosBusqueda);
    }
    
    const handleBuscar = (e) => {
      e.preventDefault()
      setBusqueda(e.target.value);
      filtrar(e.target.value);
    }

    return (
      <div className='text-center'>
          <h1>Progreso por grupo</h1>
              <div className="containerInput">
                <input
                  className="inputBuscar"
                  value={busqueda}
                  placeholder="Buscar Grupo"
                  maxLength="100"
                  onChange={(e) => handleBuscar(e)}/>
                <button className="btn">
                    <AiOutlineSearch/>
                </button>
              </div>
              {grupoSearch && grupoSearch.map(values => (
                <div className='admin' key={values.idGrupo}>
                  <div>
                    <Accordion flush>
                      <AccordionHeader>{values.nombre}</AccordionHeader>
                      <AccordionBody>
                        <Button 
                          className='btnBancoPreguntas'
                          onClick={() => {getAlumnosGrupo(values.idGrupo)}}>
                            Visualizar alumnos
                        </Button>
                        <Link to={`/ProgresoGraphAdmin/${values.idAlumno}`}>
                          <Button className='btnBancoPreguntas'>
                            Gráficas de grupo
                          </Button>
                        </Link>
                      </AccordionBody>
                    </Accordion>
                  </div>
                </div>
              )
            )}
          {/*MODAL VISUALIZAR ALUMNOS */}
          <Modal
          show={showModalAlumnos}
          scrollable={true}
          onHide={() => {setShowModalAlumnos(false)}}>
            <Modal.Header closeButton>
              <Modal.Title>
                Lista de alumnos de {gruposList[grupoSelect-1]?.nombre}
              </Modal.Title>
            </Modal.Header>
              <Modal.Body>
                <Card className='text-center'>
                  <Card.Header>
                    <Card.Title>
                      Alumnos del grupo
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <div>
                      {console.log(alumnosList)}
                      {alumnosList.map((alumnos) => {
                        return(
                          <div key={alumnos.idAlumno}>
                            <ListGroup>
                              <ListGroupItem>
                                <div className='vincularPregunta'>
                                  <div className='vincularPreguntaTexto'>
                                    {alumnos.nombre}
                                  </div>
                                  <div className='vincularPreguntaBotones'>
                                    <Button
                                    variant='success'
                                    onClick={() => {
                                      setAlumnoSelect(alumnos.idAlumno)
                                    }}>
                                        Vincular
                                        <AiOutlineSelect/>
                                    </Button>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </ListGroup>
                          </div>
                        )
                      })}
                    </div>
                  </Card.Body>
                </Card>
              </Modal.Body>
          </Modal>
      </div>
    )
}

export default ProgresoGrupoAdmin