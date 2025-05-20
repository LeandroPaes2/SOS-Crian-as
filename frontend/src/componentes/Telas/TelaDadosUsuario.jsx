import PaginaGeral from "../layouts/PaginaGeral";
import { useLogin } from "../../LoginContext";
import "../css/dadosUsuario.css";

export default function TelaDadosUsuario(){

    const { funcionario } = useLogin();

    function buscarDados(){
        const response = fetch("http://localhost:3000/funcionarios/"+funcionario.cpf);
        if(!response)
            console.log("Funcionario nao esta logado.");
    }

    return(
        <PaginaGeral>
            <div className="divGeral">
                <div  className="divOpcoes">

                </div>
                <div  className="divDados">
                    <strong>Dados Pessoais</strong>
                </div>
            </div>
        </PaginaGeral>
    );
}