const urlBase = 'https://localhost:3000/turmas';

export async function gravarTurma(turma){
    const resposta = await fetch(urlBase,{
        'method':"POST",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(turma)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function alterarTurma(turma){
    const resposta = await fetch(urlBase + "/" + turma.codigo,{
        'method':"PUT",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(turma)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirTurma(turma){
    const resposta = await fetch(urlBase + "/" + turma.codigo,{
        'method':"DELETE",
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarTurma() {
    const resposta = await fetch(urlBase,{
        'method':"GET"
    });
    const resultado = await resposta.json();
    return resultado;
}