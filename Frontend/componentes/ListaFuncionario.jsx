import FormCadFuncionarios from "./Telas/TelaCadastro/FormCadFuncionario";
import { useEffect, useState } from "react";
import TabelaFuncionarios from "./Tabelas/TabelaFuncionarios";
import { consultarFuncionario } from "../servicos/servicoFuncionario";

export default function TelaCadastroFuncionario(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState({
        codigo:0,
        nome:"",
        cpf:"",
        cargo:"",
        nivel:""
    });

    useEffect(()=>{
      consultarFuncionario().then((lista)=>{
            setListaDeFuncionarios(lista);
        });
    },[]); //listaVazia -> didMount
 
    return (
        <div>
                <div 
                style={{
                  backgroundColor: '#ff4d4d', 
                  color: 'white',
                  display: 'flex', 
                  justifyContent: 'center', // Centraliza horizontalmente
                  alignItems: 'center', // Centraliza verticalmente
                  textAlign: 'center',  // Centraliza o texto
                  padding: '20px', // Para garantir um espaço adequado
              }}
            >
                <h2>Lista de Funcionarios</h2>
            </div>
            
                {
                    exibirTabela ?
                        <TabelaFuncionarios listaDeFuncionarios={listaDeFuncionarios}
                                        setListaDeFuncionarios={setListaDeFuncionarios} 
                                        setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setFuncionarioSelecionado={setFuncionarioSelecionado} /> :
                        <FormCadFuncionarios listaDeFuncionarios={listaDeFuncionarios}
                                         setListaDeFuncionarios={setListaDeFuncionarios}
                                         setExibirTabela={setExibirTabela}
                                         funcionarioSelecionado={funcionarioSelecionado}
                                         setFuncionarioSelecionado={setFuncionarioSelecionado}
                                         modoEdicao={modoEdicao}
                                         setModoEdicao={setModoEdicao}

                                         />
                }
        </div>
    );

}
