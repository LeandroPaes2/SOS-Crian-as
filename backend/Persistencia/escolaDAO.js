import Escola from "../Modelo/escola.js";

export default class EscolaDAO {


    async incluir(escola, conexao) {
         if(escola instanceof Escola)
         {
            const sql = `
                INSERT INTO escola(esc_nome, esc_endereco, esc_telefone, esc_tipo)
                VALUES ($1, $2, $3, $4)
            `;
            let parametros = [
                escola.nome,
                escola.endereco,
                escola.telefone,
                escola.tipo
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
         }
        
    }

    async alterar(escola, conexao) {
        if (escola instanceof Escola) {
            const sql = `
                UPDATE escola 
                SET esc_nome = $1, esc_endereco = $2, esc_telefone = $3, esc_tipo = $4
                WHERE esc_id = $5
            `;
            let parametros = [
                escola.nome,
                escola.endereco,
                escola.telefone,
                escola.tipo,
                escola.id
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
        }
    }

    async consultar(termo, conexao) {
        let sql = "";
        let parametros = [];

        if (!termo) {
            sql = `SELECT * FROM escola`;
        } else {
            sql = `SELECT * FROM escola WHERE esc_id LIKE $1`;
            parametros = ['%' + termo + '%'];
        }

        const [linhas, campos] = await conexao.query(sql, parametros);
        let listaEscola = [];
        for (const linha of linhas) {
            const escola = new Escola(
                linha['esc_id'] ,
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
            const sql = `DELETE FROM escola WHERE esc_id = $1`;
            let parametros = [escola.id];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
        }
    }
}