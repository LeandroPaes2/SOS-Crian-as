import React from 'react';
import { Container } from "react-bootstrap";
import Menu from './Menu';


export default function PaginaGeral(props) {
    return (
        <>
            <Container>
                <Menu />
                {
                    props.children
                }
            </Container>
        </>
    );
}