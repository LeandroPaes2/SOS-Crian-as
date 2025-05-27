import { parse } from "dotenv";
import Escola from "../Modelo/escola.js";
import supabase from "./Conexao.js"
export default class EscolaDAO {


    async incluir(escola, supabase) {
         if(escola instanceof Escola)
         {
            const sql = `
                INSERT INTO escola(esc_nome, esc_endereco, esc_telefone, esc_tipo)
                VALUES ($1, $2, $3, $4)
            `;
            const parametros = [
                escola.nome,
                escola.endereco,
                escola.telefone,
                escola.tipo
            ];
            await supabase.query(sql, parametros);
         }
        
    }

    async alterar(escola, supabase) {
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
            const resultado = await supabase.query(sql, parametros);
            return resultado;
        }
        return null;
    }

    async consultar(termo, supabase) {
        let sql = "";
        let parametros = [];

        if (!termo) {
            sql = `SELECT * FROM escola`;
        }else if (!isNaN(parseInt(termo))) {
            sql = `SELECT * FROM escola WHERE esc_id = $1`;
            parametros = [parseInt(termo)];
        } else {
            sql = `SELECT * FROM escola WHERE esc_nome LIKE $1`;
            parametros = ['%' + termo + '%'];
        }

        const resultado = await supabase.query(sql, parametros);
        const linhas = resultado.rows;
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

    async excluir(escola, supabase) {
    if (escola instanceof Escola) {
        const sql = `DELETE FROM escola WHERE esc_id = $1`;
        const parametros = [escola.id];
        const resultado = await supabase.query(sql, parametros);
        return resultado.rowCount > 0;
    }
    return false;
}

}
