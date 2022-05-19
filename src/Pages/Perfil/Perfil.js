import React, { useState } from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function Perfil() {

  const[show, setShow] = useState();
  const[variante, setVariante] = useState();
  const[tipoRegistro, setTipoRegistro] = useState();
  const[msg, setMsg] = useState();

  return (
      <main className="registroForm">
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
        <ButtonGroup className="btnRegistroNuevo">
          <Button className="btnRegistroNuevo" value="Tutor" onClick={(e) => setTipoRegistro(e.target.value)}>Tutor y Alumno</Button>
          <Button className="btnRegistroNuevo" value="Admin" onClick={(e) => setTipoRegistro(e.target.value)}>Administrador</Button>
        </ButtonGroup>
      </div>
    </main>
  )
}

export default Perfil;