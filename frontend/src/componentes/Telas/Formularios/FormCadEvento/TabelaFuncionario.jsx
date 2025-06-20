import AutoCompleteCPF from "./AutoCompleteCPF";
import AutoCompleteNome from "./AutoCompleteNome";
import AutoCompleteCargo from "./AutoCompleteCargo";
import "../FormCadaluno/css/tabelaResponsavel.css";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TabelaFuncionario({ dadosFunc, objFunc, setObjsFunc }) {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("");

    function aoSelecionarFuncionario(funcionario) {
    setCpf(funcionario.cpf);
    setNome(funcionario.nome);
    setCargo(funcionario.cargo);
    }

    const adicionarLinha = () => {
        setObjsFunc([...objFunc, { disabled: false, status: -1, Funcionario: { nome: "",
        cpf: '',
        cargo: '',
        nivel: 0,
        email: '',
        senha: '' } }]);
    };

    const removerLinha = (index) => {
        const novasLinhas = objFunc.filter((_, i) => i !== index);
        setObjsFunc(novasLinhas);
    };

    const excluirLinha = (index) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                removerLinha(index);
                Swal.fire('Excluído!', 'O registro foi excluído.', 'success');
            }
        });
    };

    const preencherFunc = (index, f) => {
        const novasLinhas = [...objFunc];
        const jaExiste = novasLinhas.some(l => l.Funcionario.cpf === f.cpf);

        if (!jaExiste) {
            novasLinhas[index] = {
                ...novasLinhas[index],
                status: 1,
                disabled: true,
                Funcionario: f
            };
            setObjsFunc(novasLinhas);
        } else {
            removerLinha(index);
        }
    };

    return (
        <div>
            <div className="divTitulo">
                <h4>Organizadores</h4>
                <small style={{ color: 'gray', fontSize: '0.8rem' }}>Campo não obrigatório</small>
            </div>

                <div className="container-tabela">
                    <table className="tabela-nomes">
                        <thead>
                            <tr>
                                <th>n°</th>
                                <th>CPF</th>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Funções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objFunc.map((linha, index) => (
                                <tr
                                    key={index}
                                    className={
                                        linha.status === 1
                                            ? 'linha-success'
                                            : linha.status === 0
                                                ? 'linha-error'
                                                : ''
                                    }
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        
                                        <AutoCompleteCPF
                                            onSelecionar={(f) => preencherFunc(index, f)}
                                            value={linha.Funcionario.cpf}
                                            selecionado={linha.status === 1}
                                            dadosFunc={dadosFunc.filter(funcionario => {
                                                const idSelecionado = linha.Funcionario.cpf;
                                                const idsJaSelecionados = objFunc
                                                    .filter((_, i) => i !== index) // exclui a linha atual
                                                    .map(l => l.Funcionario.cpf);
                                                return !idsJaSelecionados.includes(funcionario.cpf) || funcionario.cpf === idSelecionado;
                                            })}
                                        />
                                        
                                    </td>
                                    <td>
                                        <AutoCompleteNome
                                            onSelecionar={(f) => preencherFunc(index, f)}
                                            value={linha.Funcionario.nome}
                                            selecionado={linha.status === 1}
                                            dadosFunc={dadosFunc.filter(funcionario => {
                                                const idSelecionado = linha.Funcionario.cpf;
                                                const idsJaSelecionados = objFunc
                                                    .filter((_, i) => i !== index) 
                                                    .map(l => l.Funcionario.cpf);
                                                return !idsJaSelecionados.includes(funcionario.cpf) || funcionario.cpf === idSelecionado;
                                            })}
                                        />

                                    </td>
                                    <td>
                                        <AutoCompleteCargo
                                            onSelecionar={(f) => preencherFunc(index, f)}
                                            value={linha.Funcionario.cargo}
                                            selecionado={linha.status === 1}
                                            dadosFunc={dadosFunc.filter(funcionario => {
                                                const idSelecionado = linha.Funcionario.cpf;
                                                const idsJaSelecionados = objFunc
                                                    .filter((_, i) => i !== index) // exclui a linha atual
                                                    .map(l => l.Funcionario.cpf);
                                                return !idsJaSelecionados.includes(funcionario.cpf) || funcionario.cpf === idSelecionado;
                                            })}
                                        />

                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="botao-remover"
                                            onClick={() => excluirLinha(index)}
                                            style={{ float: "right" }}
                                        >
                                            x
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5">
                                    <button className="botaoAdicionarLinha" type="button" onClick={adicionarLinha}>
                                        + Adicionar linha
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );
}
