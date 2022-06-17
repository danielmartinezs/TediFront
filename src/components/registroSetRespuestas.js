import React from 'react';
import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'
import { AiOutlinePlus, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai'

function RegistroSetRespuestas(props) {
    
    const [respuesta, setRespuesta] = useState([{ "respuesta": "" }]);
    const [respuestaFormatted, setRespuestaFormatted] = useState("{\"opciones\":[{\"respuesta\":\"\"}]}");
    const [showModalO, setShowModalO] = useState(true);

    const handleAddRespuesta = () => {
        setRespuesta([...respuesta, { respuesta: "" }])
    }

    const handleRemoveRespuesta = (index) => {
        const opciones = [...respuesta];
        opciones.splice(index, 1);
        setRespuesta(opciones)
    }

    const handleChangeRespuesta = (e, index) => {
        const { name, value } = e.target;
        const list = [...respuesta];
        if(value === ""){
            const nullval = ""
            list[index][name] = nullval
            setRespuesta(list)
        }
        else if(!isNaN(value)){
            const ivalue = parseInt(value);
            list[index][name] = ivalue;
            setRespuesta(list)
        }
        else{
            list[index][name] = value;
            setRespuesta(list);
        }
    };

    const formatRespuesta = () => {
        const rep = "{\"opciones\":"+JSON.stringify(respuesta)+"}";
        props.changeSet(respuesta);
        setRespuestaFormatted(rep);
        setShowModalO(false);
    }

    return (
        <div>
        <Modal
        show={showModalO}
        onHide={() => setShowModalO(false)}
        scrollable>
            <ModalHeader closeButton>
                <ModalTitle>
                    Registra las respuestas:
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                {respuesta?.map((opcion, index) => (
                    <div key={index} className="services">
                        <div className="first-division">
                        <input
                        name="respuesta"
                        type="text"
                        id="opcion"
                        value={opcion.respuesta}
                        onChange={(e) => handleChangeRespuesta(e, index)}/>
                        {respuesta.length-1 === index && 
                        (<Button 
                        size="sm"
                        variant="success"
                        onClick={handleAddRespuesta}>
                                Nueva opción
                                <AiOutlinePlus/>
                        </Button>)
                        }
                        <br/>
                        {respuesta.length-1 === index && respuesta.length > 1 && 
                        (<Button 
                        size="sm"
                        variant="success"
                        onClick={formatRespuesta}>
                            <span>Guardar registros</span>
                            <AiOutlineSend/>
                        </Button>)
                        }
                        </div>
                        <div className="second-division">
                            {respuesta.length > 1 && 
                                (<Button 
                                size="sm"
                                variant="danger"
                                onClick={() => handleRemoveRespuesta(index)}>
                                    <AiOutlineDelete/>
                                </Button>)}
                        </div>
                    </div>
                ))}
            </ModalBody>
        </Modal>
        </div>
    )
}

export default RegistroSetRespuestas