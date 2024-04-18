import './App.css'
import { Outlet } from 'react-router-dom';
import NavBar from './components/navBar';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function App() {

  return (
    <>
    <NavBar />
    <Outlet />  
    </>
  )
}


