import Escola from "../Modelo/escola.js";
import conectar from "./Conexao.js";

export default class EscolaDAO {


    async incluir(escola, conexao) {
        if (escola instanceof Escola) {
         
            const sql = `
                INSERT INTO escola(esc_nome, esc_endereco, esc_telefone, esc_tipo)
                VALUES (?, ?, ?, ?)
            `;
            let parametros = [
                escola.nome,
                escola.endereco,
                escola.telefone,
                escola.tipo
            ];
            await conexao.execute(sql, parametros);
            
        }
    }

    async alterar(escola, conexao) {
        if (escola instanceof Escola) {

            const sql = `
                UPDATE escola 
                SET esc_endereco = ?, esc_telefone = ?, esc_tipo = ?
                WHERE esc_nome = ?
            `;
            let parametros = [
                escola.endereco,
                escola.telefone,
                escola.tipo,
                escola.nome
            ];
            await conexao.execute(sql, parametros);
            
        }
    }

    async consultar(termo, conexao) {
        
        let sql = "";
        let parametros = [];

        if (!termo) {
            sql = `SELECT * FROM escola WHERE esc_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        } else {
            sql = `SELECT * FROM escola WHERE esc_nome = ?`;
            parametros = [termo];
        }

        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaEscola = [];
        for (const linha of linhas) {
            const escola = new Escola(
                linha['esc_nome'],
                linha['esc_endereco'],
                linha['esc_telefone'],
                linha['esc_tipo']
            );
            listaEscola.push(escola);
        }
        
        return listaEscola;
    }

    async excluir(escola, conexao) {
        if (escola instanceof Escola) {
           
            const sql = `DELETE FROM escola WHERE esc_nome = ?`;
            let parametros = [escola.nome];
            await conexao.execute(sql, parametros);
        
        }
    }
}
