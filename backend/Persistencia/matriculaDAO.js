import Matricula from '../Modelo/matricula.js';


export default class MatriculaDAO {

    constructor() {
    }

    async incluir(matricula, conexao) {
        if (matricula instanceof Matricula) {

            const sql = `INSERT INTO matricula(mat_alu_id, mat_turma_id, mat_data_inclusao_projeto, mat_data_matricula, mat_data_vencimento, mat_motivo_desligamento, mat_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`;




        }
        else {
            throw new Error("Objeto não é instância de MAtricula.");
        }
    }


}
