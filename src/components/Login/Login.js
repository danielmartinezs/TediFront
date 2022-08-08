import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthProvider";
import axios from 'axios'
import './login.css';
import  Logo from '../../assets/Logo.jpg';
import { Alert, Button, OverlayTrigger, ToggleButton, Tooltip } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const LOGIN_URL = '/login'

export const Login = () => {

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const valRef = useRef();
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [msg, setMsg] = useState('');
    const [variante, setVariante] = useState('');
    const [show, setShow] = useState(false);
    const [showt, setShowT] = useState(false);
    const [logged, setLogged] = useState(false);
    const botones = [
      { rol: 'admin', name: 'Administrador' },
      { rol: 'tutor', name: 'Tutor'}
    ];

    useEffect(() => {
      userRef.current.focus();
    }, [])
    
    //HANDLES
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const response = await axios.post(LOGIN_URL, {
          user: user,
          password: password,
          role: role
          });
        setShow(true)
        setUser('')
        setPassword('')
        setRole('')
        if(response.status === 200){
          setMsg("Login exitoso, BIENVENIDO!")
          setVariante('success');
          localStorage.setItem('id', response.data.id)
          localStorage.setItem('role', response.data.role)
          localStorage.setItem('token', response.data.token)
          if(response.data.role === 'admin')
            navigate('/homeadmin');
          if(response.data.role === 'tutor')
            navigate('/home');
          window.location.reload();
        }
      } catch (error) {
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
          errRef.current.focus();
      }
    }

    const handleSelect = (e) => {
      setRole(e)
    }

    const renderTooltipLogin = (props) => (
      <Tooltip id="button-tooltip" {...props}>
          La contraseña debe tener como mínimo 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial
      </Tooltip>
    );

    return(
      <div>
        <div className='alertas'>
              <Alert 
              show={show}
              variant={variante}
              onClose={() => setShow(false)}
              dismissible>
                <Alert.Heading>
                  {msg}
                </Alert.Heading>
              </Alert>
          </div>
          <div className='div-login'>
            <div >
              <img
              src={Logo}
              width="95%"
              height="95%"
              className="align-center"
              alt="React Bootstrap logo"                       
              />
              </div>
              {botones.map((botones, idx) => (
                <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-warning' : 'outline-warning'}
                checked={role === botones.rol}
                name="radio"
                value={botones.rol}
                onClick={() => handleSelect(botones.rol)}>
                  {botones.name}
                </ToggleButton>
              ))}
              <form onSubmit ={handleSubmit}>
                <input
                  className='input'
                  type='user'
                  name='user'
                  placeholder='Usuario...'
                  ref={userRef}
                  value={user}
                  required onChange={(e) => setUser(e.target.value)}>
                </input>
                <OverlayTrigger
                trigger='focus'
                placement="right"
                overlay={renderTooltipLogin}>
                  <input 
                    className='input'
                    type='password'
                    name='pwd'
                    placeholder='Contraseña...'
                    value={password}
                    ref={valRef}
                    required
                    onChange={(e) => {setPassword(e.target.value)}}>
                  </input>
                </OverlayTrigger>
                <Button
                type = "submit"
                className = "button"
                onSubmit ={handleSubmit}>
                  Ingresar
                </Button>
              </form>
          </div>
      </div>
      );
}

export default Login;