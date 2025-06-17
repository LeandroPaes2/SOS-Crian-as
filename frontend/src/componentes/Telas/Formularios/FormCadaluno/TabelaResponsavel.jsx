import { use } from "react";
import AutoCompleteCPF from "./AutoCompleteCPF";
import AutoCompleteNome from "./AutoCompleteNome";
import AutoCompleteEmail from "./AutocompleteEmail";
import "./css/tabelaResponsavel.css";
import { useEffect } from "react";
import Swal from 'sweetalert2';


export default function TabelaResponsavel(props) {

    const { dadosResp, objResp, setObjsResp } = props;

    const adicionarLinha = () => {
        setObjsResp([...objResp, { disabled: false, status: -1, Responsavel: { cpf: '', nome: '', email: '' } }]);
    };

    const removerLinha = (index) => {
        const novasLinhas = objResp.filter((_, i) => i !== index);
        setObjsResp(novasLinhas);
    };

    const excluirLinha = (id) => {
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
                // Aqui vocé chama sua API ou função que exclui o item
                removerLinha(id);
                Swal.fire(
                    'Excluído!',
                    'O registro foi excluído.',
                    'success'
                );
            }
        });
    };




    const preencherResponsavel = (index, r) => {
        const novasLinhas = [...objResp];
        let flag = false;
        let i;
        for (i = 0; i < novasLinhas.length; i++) {
            if (novasLinhas[i].Responsavel.cpf === r.cpf) {
                flag = true;
            }
        }

        if (!flag) {
            novasLinhas[index] = {
                ...novasLinhas[index],
                status: 1,
                disabled: true, // agora controlando o bloqueio pela tabela
                Responsavel: r
            };
            setObjsResp(novasLinhas);
        }
        else {
            removerLinha(index);
        }
    };



    return (
        <div>
            <div className="divTitulo">
                <h4>Responsaveis</h4>
            </div>

            <div className="container-tabela">
                <table className="tabela-nomes">
                    <thead>
                        <tr>
                            <th>n°</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>E-mail</th>
                            <th>Funções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {objResp.map((linha, index) => (
                            <tr
                                key={index}
                                className={
                                    linha.status == 1
                                        ? 'linha-success'
                                        : linha.status == 0
                                            ? 'linha-error'
                                            : ''
                                }
                            >
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    <AutoCompleteNome
                                        onSelecionar={(r) => preencherResponsavel(index, r)}
                                        value={linha.Responsavel.nome}
                                        selecionado={linha.status == 1}
                                        dadosResp={dadosResp}
                                    />
                                </td>
                                <td >
                                    <AutoCompleteCPF
                                        onSelecionar={(r) => preencherResponsavel(index, r)}
                                        value={linha.Responsavel.cpf}
                                        selecionado={linha.status == 1}
                                        dadosResp={dadosResp}
                                    />
                                </td>
                                <td>
                                    <AutoCompleteEmail
                                        onSelecionar={(r) => preencherResponsavel(index, r)}
                                        value={linha.Responsavel.email}
                                        selecionado={linha.status == 1}
                                        dadosResp={dadosResp}
                                    />
                                </td>

                                <td>
                                    <button style={{ float: "right" }}
                                        type="button"
                                        className="botao-remover"
                                        onClick={() => excluirLinha(index)}
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

