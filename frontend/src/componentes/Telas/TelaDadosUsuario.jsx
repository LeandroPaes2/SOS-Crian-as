import PaginaGeral from "../layouts/PaginaGeral";
import { useLogin } from "../../LoginContext";
import DadosUsuario from "./Formularios/DadosUsuario";

export default function TelaDadosUsuario(){

    return(
        <PaginaGeral>
            <DadosUsuario/>
        </PaginaGeral>
    );
}