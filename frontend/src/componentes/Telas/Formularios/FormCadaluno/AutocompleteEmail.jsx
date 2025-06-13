
import { useState, useEffect } from "react";
const todosOsResponsaveis = [
    { cpf: "56912345678", nome: "João Silva", email: "joao@gmail.com" },
    { cpf: "56998765432", nome: "Maria Lima", email: "maria@gmail.com" },
    { cpf: "12345678900", nome: "Carlos Souza", email: "carlos@gmail.com" }
];


export default function AutoCompleteEmail({ onSelecionar, value, selecionado }) {
    const [input, setInput] = useState(value || ""); // inicia com o valor vindo de fora
    const [sugestoes, setSugestoes] = useState([]);


    useEffect(() => {
        setInput(value || ""); // atualiza input interno se o valor externo mudar
    }, [value]);



    const removerAcentos = (str) => {
        return str
            .toLowerCase()
            .replace(/[áàãâä]/g, "a")
            .replace(/[éèêë]/g, "e")
            .replace(/[íìîï]/g, "i")
            .replace(/[óòõôö]/g, "o")
            .replace(/[úùûü]/g, "u")
    };

    const handleChange = (e) => {
        const valor = e.target.value;
        setInput(valor);
        let a, b;
        if (valor.length >= 1) {
            const filtrados = todosOsResponsaveis.filter((r) => {
                a = removerAcentos(r.email);
                b = removerAcentos(valor);
                return a.startsWith(b);
            }
            );
            setSugestoes(filtrados);
        } else {
            setSugestoes([]);
        }
    };

    const handleSelecionar = (resp) => {
        onSelecionar(resp);
        setInput(resp.email); // mostra o CPF no campo após seleção
        setSugestoes([]);
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <input
                type="text"
                placeholder="Buscar por Email"
                value={input}
                onChange={handleChange}
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
                        <li key={i} onClick={() => handleSelecionar(s)}
                            style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                            {s.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}