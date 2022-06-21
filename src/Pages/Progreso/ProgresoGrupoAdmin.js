import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Alert, Button, Form, ListGroup, ListGroupItem, Modal, ModalBody, ModalTitle, ModalHeader, Offcanvas } from'react-bootstrap'
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import axios from '../../axios/axios';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import "./progreso.css"
const GET_GRUPOS_URL = '/profiles/getgrupos'

function ProgresoGrupoAdmin() {

  const [grupo, setGrupo] = useState("");
  const [grupoSearch, setGrupoSearch] = useState([]);
  const [grupoSelect, setGrupoSelect] = useState(0);
  const [gruposList, setGruposList] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getGruposList()
  }, [])

  const getGruposList = async () => {
    axios.get(GET_GRUPOS_URL).then((response) => {
      setGruposList(response.data);
      setGrupoSearch(response.data);
    })
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
    </div>
  )
}

export default ProgresoGrupoAdmin