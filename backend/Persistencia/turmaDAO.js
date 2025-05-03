import Turma from "../Modelo/turma.js";
import supabase from "../Persistencia/Conexao.js";

export default class TurmaDAO {

    async incluir(turma) {
        if (turma instanceof Turma) {
            const { data, error } = await supabase
                .from('turma')
                .insert({
                    turm_cor: turma.cor,
                    turm_per: turma.periodo
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }

    async alterar(turma) {
        if (turma instanceof Turma) {
            const { data, error } = await supabase
                .from('turma')
                .update({
                    turm_cor: turma.cor,
                    turm_per: turma.periodo
                })
                .eq('turm_id', turma.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }

    async consultar(termo) {
        let query = supabase.from('turma').select('*');

        if (termo) {
            query = query.ilike('turm_id', `%${termo}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data.map(linha => new Turma(
            linha.turm_id,
            linha.turm_cor,
            linha.turm_per
        ));
    }

    async excluir(turma) {
        if (turma instanceof Turma) {
            const { data, error } = await supabase
                .from('turma')
                .delete()
                .eq('turm_id', turma.id);

            if (error) throw error;
            return data;
        }
    }
}