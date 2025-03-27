import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';

export default function Menu(props){
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Navbar.Brand  as={Link} to="/" href="#home">SOS Home</Navbar.Brand>
                <Nav className="me-auto">
                        <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#" >Alunos</NavDropdown.Item>
                            <NavDropdown.Item href="#" >Funcionarios</NavDropdown.Item>
                            <NavDropdown.Item href="#" as={Link} to="/telaTurma">Turmas</NavDropdown.Item>
                            <NavDropdown.Item href="#" >Materias</NavDropdown.Item>
                            <NavDropdown.Item href="#" as={Link} to="/telaEscola">Escolas</NavDropdown.Item>
                        </NavDropdown>
                    
                        <NavDropdown title="Relatórios" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Alunos</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Funcionarios</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Turmas</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Materias</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Escolas</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#home">Sobre</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        </>
    )
}