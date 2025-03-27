window.onload = () => {

    fetch('https://fakestoreapi.com/funcucts',{method:"GET"})
    .then((resposta)=>{
        return resposta.json();
    })
    .then((funcionarios)=>{
        for (const funcionario of funcionarios){
            document.write(`<img style="width:200px;" src='${funcionario.image}'></img>`);
            document.write(`<h1>${funcionario.title}</h1>`);
            document.write(`<h2>R$ ${funcionario.price}</h2><br/>`);
        }
    })
    .catch((erro) => {
        document.write(`<h1>Não foi possível obter a lista de funcionarios: ${erro.message}</h1>`);
    });
}; 