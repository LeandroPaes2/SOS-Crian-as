import AutoCompleteCPF from "./AutoCompleteCPF";
import AutoCompleteNome from "./AutoCompleteNome";
import AutoCompleteEmail from "./AutocompleteEmail";
import "./css/tabelaResponsavel.css";

export default function TabelaResponsavel(props) {

    const { objResp, setObjsResp } = props;

    const adicionarLinha = () => {
        setObjsResp([...objResp, { status: -1, Responsavel: { cpf: '', nome: '', email: '' } }]);
    };

    const removerLinha = (index) => {
        const novasLinhas = objResp.filter((_, i) => i !== index);
        setObjsResp(novasLinhas);
    };

    const atualizarCpf = (index, novoCpf) => {
        const novasLinhas = [...objResp];
        novasLinhas[index].Responsavel.cpf = novoCpf;
        novasLinhas[index].status = -1;
        setObjsResp(novasLinhas);
    };

    const validarCpf = (cpf) => {
        // Aqui você pode integrar com a API real depois
        // Simulando: CPF válido se tiver 11 dígitos e começar com "1"
        return /^\d{11}$/.test(cpf) && cpf.startsWith("1");
    };


    const verificarCpf = (index) => {
        const cpf = objResp[index].Responsavel.cpf;
        const valido = validarCpf(cpf);

        if (valido)
            objResp[index].status = 1;
        else
            objResp[index].status = 0;
        setObjsResp([...objResp]);
    };

    const preencherResponsavel = (index, responsavel) => {
        const novasLinhas = [...objResp];
        novasLinhas[index] = {
            ...novasLinhas[index],
            status: 1,
            disabled: true, // agora controlando o bloqueio pela tabela
            Responsavel: {
                cpf: responsavel.cpf,
                nome: responsavel.nome,
                email: responsavel.email
            }
        };
        setObjsResp(novasLinhas);
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
                                    />
                                </td>
                                 <td >
                                    <AutoCompleteCPF
                                        onSelecionar={(r) => preencherResponsavel(index, r)}
                                        value={linha.Responsavel.cpf}
                                        selecionado={linha.status == 1}
                                    />
                                </td>
                                <td>
                                    <AutoCompleteEmail
                                       onSelecionar={(r) => preencherResponsavel(index, r)}
                                        value={linha.Responsavel.email}
                                        selecionado={linha.status == 1}
                                    />
                                </td>

                                <td>
                                    <button style={{ float: "right" }}
                                        type="button"
                                        className="botao-remover"
                                        onClick={() => removerLinha(index)}
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

