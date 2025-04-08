const urlBase = 'https://localhost:3000/funcionarios';

export async function gravarFuncionario(funcionario){
    const resposta = await fetch(urlBase,{
        'method':"POST",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(funcionario)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function alterarFuncionario(funcionario){
    const resposta = await fetch(urlBase + "/" + funcionario.nome,{
        'method':"PUT",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(funcionario)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirFuncionario(funcionario){
    const resposta = await fetch(urlBase + "/" + funcionario.nome,{
        'method':"DELETE",
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarFuncionario() {
    const resposta = await fetch(urlBase,{
        'method':"GET"
    });
    const resultado = await resposta.json();
    return resultado;
}