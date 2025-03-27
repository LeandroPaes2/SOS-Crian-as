import { Alert } from "react-bootstrap";
export default function Cabecalho(props){
    
    //método render
    return (
        <Alert className={"text-center"} variant="light">
            <h1>
                {props.titulo || "Título não fornecido"}
            </h1>
        </Alert>

    );
}