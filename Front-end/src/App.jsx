import './App.css'
import { Outlet } from 'react-router-dom';
import NavBar from './components/navBar';


export default function App() {

  return (
    <>
    <NavBar />
    <Outlet />  
    </>
  )
}


