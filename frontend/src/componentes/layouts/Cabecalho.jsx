import { Alert } from "react-bootstrap";
import "../css/cabecalho.css";

export default function Cabecalho(props){
    
    //método render
    return (
        <div className="topoc">
            <Alert className="alert-custom text-center mb-4" variant="dark">
                    <h2 className=" titulo-alert">Sistema SOS Crianças</h2>
            </Alert>
        </div>
    );
}