//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import FuncionarioCtrl from "../Controle/funcionarioCtrl.js";

const funcCtrl = new FuncionarioCtrl();
const rotaFuncionario = Router();

rotaFuncionario.post("/", funcCtrl.gravar);
rotaFuncionario.put("/:nome", funcCtrl.editar);
rotaFuncionario.patch("/:nome", funcCtrl.editar);
rotaFuncionario.delete("/:nome", funcCtrl.excluir);
rotaFuncionario.get("/:nome", funcCtrl.consultar);
rotaFuncionario.get("/",funcCtrl.consultar);

export default rotaFuncionario;


