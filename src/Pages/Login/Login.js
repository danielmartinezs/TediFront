import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthProvider";
import axios from '../../axios/axios';
import './login.css';
import  Logo from '../../assets/Logo.jpg';
import { Button, Dropdown, DropdownButton, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const LOGIN_URL = '/login'

export const Login = () =>{
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [msg, setMsg] = useState('');
  const [variante, setVariante] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setMsg('');
  }, [user, password])

  
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
        console.log(response)
        if(response.data.role === 'admin')
          navigate('/homeadmin');
        if(response.data.role === 'tutor')
          navigate('/home');
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

  const handleSelect=(e)=>{
    setRole(e)
  }

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
            <DropdownButton
            id="dropdown-item-button"
            title="Seleccione su rol"
            type='role'
            onSelect = {handleSelect}>
              <Dropdown.Item eventKey="admin">Administrador</Dropdown.Item>
              <Dropdown.Item eventKey="tutor">Tutor</Dropdown.Item>
            </DropdownButton>
            <h4>Bienvenido {role}</h4>
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
              <input 
                className='input'
                type='password'
                name='pwd'
                placeholder='Contraseña...'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}>
              </input>
            <Button type = "submit" className = "button" onSubmit ={handleSubmit}>Ingresar</Button>
            </form>
        </div>
    </div>
    )
}

export default Login;