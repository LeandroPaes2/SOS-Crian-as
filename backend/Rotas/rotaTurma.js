//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import TurmaCtrl from "../Controle/turmaCtrl.js";

const turmCtrl = new TurmaCtrl();
const rotaTurma = Router();

rotaTurma.post("/", turmCtrl.gravar);
rotaTurma.put("/:id", turmCtrl.editar);
rotaTurma.patch("/:id", turmCtrl.editar);
rotaTurma.delete("/:id", turmCtrl.excluir);
rotaTurma.get("/:id", turmCtrl.consultar);
rotaTurma.get("/",turmCtrl.consultar);

export default rotaTurma;


