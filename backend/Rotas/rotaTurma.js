//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import TurmaCtrl from "../Controle/turmaCtrl.js";

const turmCtrl = new TurmaCtrl();
const rotaTurma = Router();

rotaTurma.post("/", turmCtrl.gravar);
rotaTurma.put("/:codigo", turmCtrl.editar);
rotaTurma.patch("/:codigo", turmCtrl.editar);
rotaTurma.delete("/:codigo", turmCtrl.excluir);
rotaTurma.get("/:codigo", turmCtrl.consultar);
rotaTurma.get("/",turmCtrl.consultar);

export default rotaTurma;


