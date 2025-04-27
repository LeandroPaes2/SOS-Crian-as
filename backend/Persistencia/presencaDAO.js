import Presenca from "../Modelo/presenca.js";
import conectar from "./Conexao.js";

export default class PresencaDAO{
    constructor()
    {
        this.init();
    }

    async init(){
        try{
            const conexao = await conectar();
            const sql=`
            CREATE TABLE IF NOT EXISTS presenca (
            pre_id INT AUTO_INCREMENT PRIMARY KEY,
            pre_data_hora DATETIME NOT NULL,
            mat_id INT NOT NULL,
            turm_id INT NOT NULL,
            FOREIGN KEY (mat_id) REFERENCES materia(mat_id),
            FOREIGN KEY (turm_id) REFERENCES turma(turm_id)
            );
        `;
            await conexao.execute(sql);
            const sql2=`
            CREATE TABLE IF NOT EXISTS presenca_aluno (
            pre_id INT,
            alu_num_protocolo INT,
            presente BOOLEAN,
            PRIMARY KEY (pre_id, alu_num_protocolo),
            FOREIGN KEY (pre_id) REFERENCES presenca(pre_id),
            FOREIGN KEY (alu_num_protocolo) REFERENCES aluno(alu_num_protocolo)
            );
        `;
            await conexao.execute(sql2);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(presenca, conexao){
        try{
            /*
            const [validacao] = await conexao.execute(
                `SELECT 1 FROM horario 
                 WHERE hora_mat_nome = ? AND hora_turm_cor = ?`,
                [presenca.materia.id, presenca.turma.id]
            );
    
            if (validacao.length === 0) {
                throw new Error('Matéria não oferecida para esta turma');
            }
            */
           
            const sqlPresenca = `INSERT INTO presenca (pre_data_hora, mat_id, turm_id) VALUES (?, ?, ?)`;
            const paramsPresenca = [
                presenca.dataHora,
                presenca.materia.id,
                presenca.turma.id
            ];
            const [result] = await conexao.execute(sqlPresenca, paramsPresenca);
            const presencaId = result.insertId;
            for (const ap of presenca.alunosPresentes) {
                const sql = `INSERT INTO presenca_aluno (pre_id, alu_num_protocolo, presente) VALUES (?, ?, ?)`;
                await conexao.execute(sql, [presencaId, ap.aluno.numProtocolo, ap.presente]);
            }
        }
        catch (e) {
            throw new Error("Erro ao inserir presença: " + e.message);
        }
    }

    async consultar(conexao){
        try{
            const sql = `SELECT * FROM presenca`;
            const [registros] = await conexao.execute(sql);
            return registros.map(reg => new Presenca(
                reg.pre_id,
                reg.pre_data_hora,
                new Materia(reg.mat_id),
                new Turma(reg.turm_id)
            ));
        }
        catch (e) {
            throw new Error("Erro ao consultar presenças: " + e.message);
        }
    }

    async excluir(presenca, conexao)
    {
        try{
            const deletedId = presenca.id;
            const sql = `DELETE FROM presenca WHERE pre_id = ?`;
            await conexao.execute(sql, [presenca.id]);
            await conexao.execute('UPDATE materia SET mat_id = mat_id - 1 WHERE mat_id > ?', [deletedId]);
                // Ajusta o AUTO_INCREMENT para continuar a sequência corretamente
            const [rows] = await conexao.execute('SELECT MAX(pre_id) AS maxId FROM presenca');
            const nextId = (rows[0].maxId || 0) + 1;
            await conexao.execute(`ALTER TABLE presenca AUTO_INCREMENT = ${nextId}`);
        }
        catch (e) {
            throw new Error("Erro ao excluir matéria: " + e.message);
        }
    }
}