
import { useState, useEffect } from "react";

export default function AutoCompleteCPF({ onSelecionar, value, selecionado, dadosResp }) {
  const [input, setInput] = useState(value || ""); // inicia com o valor vindo de fora
  const [sugestoes, setSugestoes] = useState([]);


  useEffect(() => {
    setInput(value || ""); // atualiza input interno se o valor externo mudar
  }, [value]);





  const handleChange = (e) => {
    
    let valor = e.target.value;

    // Remove tudo que não for número
    let cpfLimpo = valor.replace(/\D/g, "");

    // Limita o tamanho: 11 dígitos
    cpfLimpo = cpfLimpo.slice(0, 11);

    // Aplica a formatação: 000.000.000-00
    let cpfFormatado = cpfLimpo;
    if (cpfLimpo.length > 3) {
      cpfFormatado = cpfFormatado.replace(/^(\d{3})(\d)/, "$1.$2");
    }
    if (cpfLimpo.length > 6) {
      cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (cpfLimpo.length > 9) {
      cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    }

    valor = cpfFormatado;

    setInput(valor);

    if (valor.length >= 1) {
      const filtrados = dadosResp.filter((r) =>
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
        className="inputAluno"
         onFocus={() => setSugestoes(dadosResp)}
                onBlur={() => setTimeout(() => setSugestoes([]), 150)} 
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
              {s.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}