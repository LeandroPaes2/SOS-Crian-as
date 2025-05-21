

export default function AlterarSenha(){

    return(
        <div>
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Recuperar Senha</h2>
            </Alert>
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
            </Alert>} 
            <div className="divForm">
                <Form onSubmit={handleSubmit} id="formularioLogin"  className="formularioD">
                    <Form.Group className="campoEmail" controlId="email">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" as={Link} to="/">
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar">
                            Alterar Senha
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}