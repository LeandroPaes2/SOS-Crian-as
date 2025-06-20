
import { useState, useEffect } from "react";


export default function AutoCompleteCPF({ onSelecionar, value, selecionado, dadosFunc }) {
    // const todosOsResponsaveis = dadosResp;

    const [input, setInput] = useState(value || ""); // inicia com o valor vindo de fora
    const [sugestoes, setSugestoes] = useState([]);
    let setMostrarSugestoes = false;

    useEffect(() => {
        setInput(value || ""); // atualiza input interno se o valor externo mudar
    }, [value]);

    const removerAcentos = (str) => {

        if (str)
            return str
                .toLowerCase()
                .replace(/[áàãâä]/g, "a")
                .replace(/[éèêë]/g, "e")
                .replace(/[íìîï]/g, "i")
                .replace(/[óòõôö]/g, "o")
                .replace(/[úùûü]/g, "u")
                .replace(/[ç]/g, "c");
        else
            return "";
    };

    const handleChange = (e) => {
        const valor = e.target.value;
        // console.log("valor = " + valor);
        setInput(valor);
        let a = "", b = "";
        if (valor.length >= 0) {
            //console.log(dadosResp);

            const filtrados = dadosFunc.filter((f) => {


                a = removerAcentos(f.cpf);
                b = removerAcentos(valor);


                // console.log("r = " + r.Responsavel.nome);
                // console.log("a = " + a);
                // console.log("b = " + b);

                return a.startsWith(b);



                // console.log(r);
                // console.log("NOME =" + r.Responsavel.nome);
                // return true;
            }
            );
            setSugestoes(filtrados);
        } else {
            setSugestoes([]);
        }
    };

    const handleSelecionar = (func) => {
        onSelecionar(func);
        setInput(dadosFunc.cpf);
        setSugestoes([]);
    };



    return (
        <div style={{ position: "relative", width: "100%" }}>
            <input
                type="text"
                placeholder="Buscar pelo CPF"
                value={input}
                className= "inputAluno"
                onChange={handleChange}
                onFocus={() => setSugestoes(dadosFunc)}
                onBlur={() => setTimeout(() => setSugestoes([]), 150)} 
                disabled={selecionado}
                style={{ width: "100%", padding: "8px" }}
            />
            {sugestoes.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 999
                }}>
                    {sugestoes.map((s, i) => (
                        <li key={i} onClick={() => handleSelecionar(s)} style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee", display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ width: '30%' }}>{s.cpf}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}