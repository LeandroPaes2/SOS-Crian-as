// src/pages/TelaGeral.jsx
import React from 'react';
import { Container } from "react-bootstrap";
import Cabecalho from './Cabecalho';
import MenuInicial from './MenuInicial';


export default function Pagina(props) {
    return (
        <>
            <Container>
                <Cabecalho titulo="Sistema SOS Crianças" />
                <MenuInicial />
                {
                    props.children
                }
            </Container>
        </>
    );
}