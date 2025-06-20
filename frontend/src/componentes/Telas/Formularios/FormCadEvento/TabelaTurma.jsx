import AutoCompleteCor from "./AutoCompleteCor";
import "../FormCadaluno/css/tabelaResponsavel.css";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function TabelaTurma({ dadosTurma, objTurma, setObjsTurma, periodoSelecionado }) {
    const navigate = useNavigate();

    const adicionarLinha = () => {
        setObjsTurma([...objTurma, { disabled: false, status: -1, Turma: { id: 0, cor: '', periodo: '' } }]);
    };

    const removerLinha = (index) => {
        const novasLinhas = objTurma.filter((_, i) => i !== index);
        setObjsTurma(novasLinhas);
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

    const preencherTurma = (index, t) => {
        const novasLinhas = [...objTurma];
        const jaExiste = novasLinhas.some(l => l.Turma.id === t.id);

        if (!jaExiste) {
            novasLinhas[index] = {
                ...novasLinhas[index],
                status: 1,
                disabled: true,
                Turma: t
            };
            setObjsTurma(novasLinhas);
        } else {
            removerLinha(index);
        }
    };

    return (
        <div>
            <div className="divTitulo">
                <h4>Turmas Participantes</h4>
            </div>

            {periodoSelecionado && dadosTurma.length === 0 ? (
                <div style={{ marginTop: '20px' }}>
                    <p style={{ color: "red", fontWeight: "bold" }}>
                        Não há turmas cadastradas para o período <u>{periodoSelecionado}</u>.
                    </p>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/formCadTurma")}
                    >
                        Cadastrar nova turma
                    </button>
                </div>
            ) : (
                <div className="container-tabela">
                    <table className="tabela-nomes">
                        <thead>
                            <tr>
                                <th>n°</th>
                                <th>Cor</th>
                                <th>Periodo</th>
                                <th>Funções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objTurma.map((linha, index) => (
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
                                        <AutoCompleteCor
    onSelecionar={(t) => preencherTurma(index, t)}
    value={linha.Turma.cor}
    selecionado={linha.status === 1}
    dadosTurma={dadosTurma.filter(turma => {
        const idSelecionado = linha.Turma.id;
        const idsJaSelecionados = objTurma
            .filter((_, i) => i !== index) // exclui a linha atual para reedição
            .map(l => l.Turma.id);
        return !idsJaSelecionados.includes(turma.id) || turma.id === idSelecionado;
    })}
/>
                                    </td>
                                    <td>{linha.Turma.periodo}</td>
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
            )}
        </div>
    );
}
