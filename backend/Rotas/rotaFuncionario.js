//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import FuncionarioCtrl from "../Controle/funcionarioCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const funcCtrl = new FuncionarioCtrl();
const rotaFuncionario = Router();



rotaFuncionario.post("/", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.gravar);
rotaFuncionario.put("/:cpf", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.editar);
rotaFuncionario.patch("/:cpf", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.editar);
rotaFuncionario.delete("/:cpf", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.excluir);
rotaFuncionario.post("/login", autenticarToken, autorizarNivel("6", "5", "3", "4"),funcCtrl.autenticar);
rotaFuncionario.get("/:email", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.consultar);
rotaFuncionario.get("/", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.consultar);
rotaFuncionario.get("/:cpf", autenticarToken, autorizarNivel("6", "5", "3", "4"), funcCtrl.consultar);

/*
rotaFuncionario.post("/", funcCtrl.gravar);
rotaFuncionario.put("/:cpf", funcCtrl.editar);
rotaFuncionario.patch("/:cpf", funcCtrl.editar);
rotaFuncionario.delete("/:cpf", funcCtrl.excluir);
rotaFuncionario.post("/login", funcCtrl.autenticar);
rotaFuncionario.get("/:nome?", funcCtrl.consultar);
rotaFuncionario.get("/",funcCtrl.consultar);*/



export default rotaFuncionario;


