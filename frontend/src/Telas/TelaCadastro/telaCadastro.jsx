import React from 'react';


export default function TelaCadastro() {
    const [email, setEmail] = useState('');
    const [senha, setsenha] = useState('');
    
    function login(email, senha) {
        fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Definindo que estamos enviando um JSON
          },
          body: JSON.stringify({ email, senha }),  // Enviando os dados no corpo da requisição
        })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(data.message);  // Exibe a resposta do backend
          }
        })
        .catch(error => {
          console.error('Erro ao fazer login:', error);
          alert('Ocorreu um erro ao tentar fazer login.');
        });
      }
      
    return (
        <div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <div>
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Senha</label>
              <input 
                type="senha" 
                value={senha} 
                onChange={(e) => setsenha(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    
}
