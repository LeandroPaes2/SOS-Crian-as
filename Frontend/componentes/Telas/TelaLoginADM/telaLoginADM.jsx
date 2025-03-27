import React, { useState } from 'react';

export default function TelaLoginADM(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar dados para o back-end
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    // Verifique se o status da resposta é 2xx (sucesso) e se o tipo de conteúdo é JSON
    if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
      const data = await response.json();
      if (data.success) {
        alert('Login realizado. Aguardando confirmação...');
      } else {
        alert('Credenciais inválidas ou problema no login.');
      }
    } else {
      const errorText = await response.text(); // Recebe a resposta como texto
      console.error('Erro ao fazer login:', errorText); // Aqui você pode verificar o erro específico
    }
    
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );

}
