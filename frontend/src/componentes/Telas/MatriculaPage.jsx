import React, { useState } from "react";

export default function MatriculaPage() {
    const [alunoId, setAlunoId] = useState("");
    const [turmaId, setTurmaId] = useState("");
    const [dataMatricula, setDataMatricula] = useState("");
    const [consultaId, setConsultaId] = useState("");
    const [resultado, setResultado] = useState("");
    const [novaTurmaId, setNovaTurmaId] = useState("");
    const [matriculaIdAlterar, setMatriculaIdAlterar] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const urlBackend = "http://localhost:3000/matricula"; // coloque sua URL do backend aqui

    // 🔸 Função para gravar
    const gravarMatricula = async () => {
        try {

           



            const resposta = await fetch(urlBackend, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ` Bearer ${token}`
                },
                body: JSON.stringify({
                    aluno: { id: parseInt(alunoId) },
                    turma: { id: parseInt(turmaId) },
                    dataAtualMatricula: dataMatricula,
                }),
            });
            const dados = await resposta.json();
            setResultado(JSON.stringify(dados, null, 2));
        } catch (error) {
            setResultado("Erro: " + error.message);
        }
    };

    // 🔸 Função para consultar
    const consultarMatricula = async () => {
        try {
            const resposta = await fetch(`${urlBackend}/${consultaId}`);
            const dados = await resposta.json();
            setResultado(JSON.stringify(dados, null, 2));
        } catch (error) {
            setResultado("Erro: " + error.message);
        }
    };

    // 🔸 Função para consultar matrícula por aluno
    const consultarMatAluno = async () => {
        try {
            const resposta = await fetch(`${urlBackend}/aluno/${consultaId}`);
            const dados = await resposta.json();
            setResultado(JSON.stringify(dados, null, 2));
        } catch (error) {
            setResultado("Erro: " + error.message);
        }
    };

    // 🔸 Função para alterar matrícula (trocar turma)
    const alterarMatricula = async () => {
        try {
            const resposta = await fetch(urlBackend, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: parseInt(matriculaIdAlterar),
                    turma: { id: parseInt(novaTurmaId) },
                }),
            });
            const dados = await resposta.json();
            setResultado(JSON.stringify(dados, null, 2));
        } catch (error) {
            setResultado("Erro: " + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Gestão de Matrícula</h1>

            <div className="card">
                <h2>Gravar Matrícula</h2>
                <input
                    type="number"
                    placeholder="ID do Aluno"
                    value={alunoId}
                    onChange={(e) => setAlunoId(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="ID da Turma"
                    value={turmaId}
                    onChange={(e) => setTurmaId(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Data da Matrícula"
                    value={dataMatricula}
                    onChange={(e) => setDataMatricula(e.target.value)}
                />
                <button onClick={gravarMatricula}>Gravar</button>
            </div>

            <div className="card">
                <h2>Consultar Matrícula</h2>
                <input
                    type="number"
                    placeholder="ID da Matrícula ou Aluno"
                    value={consultaId}
                    onChange={(e) => setConsultaId(e.target.value)}
                />
                <button onClick={consultarMatricula}>Consultar Matrícula</button>
                <button onClick={consultarMatAluno}>Consultar por Aluno</button>
            </div>

            <div className="card">
                <h2>Alterar Matrícula (Trocar Turma)</h2>
                <input
                    type="number"
                    placeholder="ID da Matrícula"
                    value={matriculaIdAlterar}
                    onChange={(e) => setMatriculaIdAlterar(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Novo ID da Turma"
                    value={novaTurmaId}
                    onChange={(e) => setNovaTurmaId(e.target.value)}
                />
                <button onClick={alterarMatricula}>Alterar</button>
            </div>

            <div className="card">
                <h2>Resultado</h2>
                <pre>{resultado}</pre>
            </div>
        </div>
    );
}
