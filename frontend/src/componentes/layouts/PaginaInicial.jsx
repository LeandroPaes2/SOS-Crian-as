// src/pages/TelaGeral.jsx
import React from 'react';
import { Container } from "react-bootstrap";
import Menu from './Menu';
import MenuInicial from './MenuInicial';
import { useState, useEffect } from "react";
import MenuCadastro from './MenuCadastro';
import MenuRelatorio from './MenuRelatorio';
import "../css/aviso.css"


function dataNova(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export default function Pagina(props) {

    const [listaDeEventos, setListaDeEventos] = useState([]);
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('inicial');
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {  //é executado uma única vez quando o componente monta, ou seja, quando a página/carregamento do componente acontece pela primeira vez.
        //Ele serve pra carregar os elementos que você precisa assim que a página abrir, como buscar dados no backend
        const buscarEventos = async () => {
            console.log(token);
            try {
                const response = await fetch("http://localhost:3000/eventos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok)
                    throw new Error("Erro ao buscar eventos");

                const dados = await response.json();
                setListaDeEventos(dados); // Atualiza o estado com os dados do backend
                if (dados.length > 0) {
                    console.log("Formato da data no primeiro evento:", dados[0].data);
                    console.log("new Date(data):", new Date(dados[0].data));
                }
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);

            }
        };

        buscarEventos();
    }, []);


    const eventoProximo = [...listaDeEventos]
        .filter(e => new Date(e.data).getTime() >= new Date().getTime()) // Pega só os eventos futuros (ou de hoje)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0]; // Ordena e pega o mais próximo

        const handleChange = (e) => {
        setOpcaoSelecionada(e.target.value);
    };

    return (
        <>
            <Container fluid>
                <div className='top'>
                    <Menu titulo="Sistema SOS Crianças" />
                    <br />
                    {eventoProximo ? (
                        <div className='aviso-custom'>
                            <h5>Próximo Evento: {eventoProximo.nome}</h5>
                            <p><strong>Período:</strong> {eventoProximo.periodo}</p>
                            <p><strong>Data:</strong> {dataNova(eventoProximo.data)}</p>
                            <p><strong>Início:</strong> {eventoProximo.horaInicio}</p>
                            <p><strong>Fim:</strong> {eventoProximo.horaFim}</p>
                        </div>
                    ) : (
                        <h5 className='aviso-custom'>Nenhum evento futuro disponível.</h5>
                    )}

                    <div className="radio-input">
                        <label>
                            <input
                                type="radio"
                                name="value-radio"
                                value="cadastro"
                                onChange={handleChange}
                            />
                            <span style={{fontSize: '16px'}}>Cadastrar</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="value-radio"
                                value="relatorio"
                                onChange={handleChange}
                            />
                            <span style={{fontSize: '16px'}}>Relatório</span>
                        </label>
                        <span className="selection"></span>
                    </div>

                    {opcaoSelecionada === "inicial" && <MenuCadastro />}
                    {opcaoSelecionada === 'cadastro' && <MenuCadastro />}
                    {opcaoSelecionada === 'relatorio' && <MenuRelatorio />}

                    {
                        props.children
                    }
                </div>
            </Container>
        </>
    );
}