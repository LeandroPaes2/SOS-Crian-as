//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import TurmaCtrl from "../Controle/turmaCtrl.js";

const turmCtrl = new TurmaCtrl();
const rotaTurma = Router();

rotaTurma.post("/", turmCtrl.gravar);
rotaTurma.put("/:cor", turmCtrl.editar);
rotaTurma.patch("/:cor", turmCtrl.editar);
rotaTurma.delete("/:cor", turmCtrl.excluir);
rotaTurma.get("/:cor", turmCtrl.consultar);
rotaTurma.get("/",turmCtrl.consultar);

export default rotaTurma;


