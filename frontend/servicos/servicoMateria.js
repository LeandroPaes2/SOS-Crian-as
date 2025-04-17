const urlBase = 'https://localhost:3000/materias';

export async function gravarMateria(materia){
    const resposta = await fetch(urlBase,{
        'method':"POST",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(materia)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function alterarMateria(materia){
    const resposta = await fetch(urlBase + "/" + materia.nome,{
        'method':"PUT",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(materia)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirMateria(materia){
    const resposta = await fetch(urlBase + "/" + materia.nome,{
        'method':"DELETE",
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarMateria() {
    const resposta = await fetch(urlBase,{
        'method':"GET"
    });
    const resultado = await resposta.json();
    return resultado;
}