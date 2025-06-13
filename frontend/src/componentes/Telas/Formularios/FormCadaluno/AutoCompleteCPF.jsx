
import { useState, useEffect} from "react";
const todosOsResponsaveis = [
  { cpf: "56912345678", nome: "João Silva", email: "joao@gmail.com" },
  { cpf: "56998765432", nome: "Maria Lima", email: "maria@gmail.com" },
  { cpf: "12345678900", nome: "Carlos Souza", email: "carlos@gmail.com" }
];


export default function AutoCompleteCPF({ onSelecionar, value , selecionado}) {
  const [input, setInput] = useState(value || ""); // inicia com o valor vindo de fora
  const [sugestoes, setSugestoes] = useState([]);
  

  useEffect(() => {
    setInput(value || ""); // atualiza input interno se o valor externo mudar
  }, [value]);

  const handleChange = (e) => {
    const valor = e.target.value;
    setInput(valor);

    if (valor.length >= 1) {
      const filtrados = todosOsResponsaveis.filter((r) =>
        r.cpf.startsWith(valor)
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const handleSelecionar = (resp) => {
    onSelecionar(resp);
    setInput(resp.cpf); // mostra o CPF no campo após seleção
    setSugestoes([]);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Buscar por CPF"
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
              {s.cpf} - {s.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}