//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import TurmaCtrl from "../Controle/turmaCtrl.js";

const turmCtrl = new TurmaCtrl();
const rotaTurma = Router();

rotaTurma.post("/", autenticarToken, autorizarNivel("1", "2"),turmCtrl.gravar);
rotaTurma.put("/:id", autenticarToken, autorizarNivel("1", "2"),turmCtrl.editar);
rotaTurma.patch("/:id",autenticarToken, autorizarNivel("1", "2"), turmCtrl.editar);
rotaTurma.delete("/:id",autenticarToken, autorizarNivel("1", "2"), turmCtrl.excluir);
rotaTurma.get("/:id",autenticarToken, autorizarNivel("1", "2"), turmCtrl.consultar);
rotaTurma.get("/",autenticarToken, autorizarNivel("1", "2"),turmCtrl.consultar);

export default rotaTurma;


