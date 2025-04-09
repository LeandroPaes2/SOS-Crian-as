import { Alert } from "react-bootstrap";
import "../css/cabecalho.css";

export default function Cabecalho(props){
    
    //método render
    return (
        <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Sistema SOS Crianças</h2>
        </Alert>
    );
}