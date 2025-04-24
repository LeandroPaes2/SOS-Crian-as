import { Alert, Form, Button } from "react-bootstrap";
import "../../css/login.css";
import { Link } from "react-router-dom";

export default function Login(props){

    const [ra, setRa] = useState("");
    const [senha, setSenha] = useState("");
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([])

    const formulario = document.getElementById("formularioLogin");

    async function verificarLogin(){
            formulario.onsubmit(()=>{
            try {
                const response = await fetch("http://localhost:3000/funcionarios");
                if (!response.ok) 
                    throw new Error("Erro ao buscar funcionarios");
                const dados = await response.json();
                setListaDeFuncionarios(dados);
                

            }catch(e){
                console.error("Erro ao buscar funcionarios:", error);
                setMensagem("Erro ao carregar os funcionarios.");
            }
        });
    }

    return (
        <div>
            <br />
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Sistema SOS Crianças</h2>
            </Alert>
            <br />
            <div className="divForm">
                <Form id="formularioLogin"  className="formularioD">
                    <Form.Group className="mb-4" controlId="ra">
                        <Form.Label>RA</Form.Label>
                        <Form.Control type="text" placeholder="Enter RA" 
                        value={ra}
                        onChange={(e) => setRa(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" placeholder="Senha" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Entrar
                    </Button>
                </Form>
            </div>
        </div>
    );
}