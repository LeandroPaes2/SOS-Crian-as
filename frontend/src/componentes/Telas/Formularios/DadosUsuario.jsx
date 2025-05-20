import { useLogin } from "../../../LoginContext.js";
import "../../css/dadosUsuario.css";

export default function DadosUsuario(){
    const { funcionario } = useLogin();
    
    function buscarDados(){
        const response = fetch("http://localhost:3000/funcionarios/"+funcionario.cpf);
        if(!response)
            console.log("Funcionario nao esta logado.");
    }

    return(
        <div>
            
            <div className="divGeral">
                <div  className="divOpcoes">
                </div>
                <div  className="divDados">
                    <strong>Dados Pessoais</strong>
                </div>
            </div>
        </div>
    );
}