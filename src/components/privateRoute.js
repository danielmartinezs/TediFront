import { Navigate } from 'react-router-dom'

function PrivateRoute({ children, roles }) {

    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const isValidRole = roles.includes(role);
    if(id && isValidRole ){
        return children
    }
    if(id && !isValidRole ){
        return <Navigate to={'/Home'}/>
    }
    return <Navigate to={'/login'}/>;
}

export default PrivateRoute;
