//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import ListaEsperaCtrl from "../Controle/listaEsperaCtrl.js";

const listaEspCtrl = new ListaEsperaCtrl();
const rotaListaEspera = Router();

rotaListaEspera.post("/", autenticarToken, autorizarNivel("4","5", "3", "6"),listaEspCtrl.gravar);
rotaListaEspera.put("/:num", autenticarToken, autorizarNivel("4","5", "3", "6"),listaEspCtrl.alterar);
rotaListaEspera.patch("/:num",autenticarToken, autorizarNivel("4","5", "3", "6"),listaEspCtrl.alterar);
rotaListaEspera.delete("/:num", autenticarToken, autorizarNivel("4","5", "3", "6"),listaEspCtrl.excluir);
rotaListaEspera.get("/:id?",autenticarToken, autorizarNivel("4","5", "3", "6"), listaEspCtrl.consultar);
rotaListaEspera.get("/",autenticarToken, autorizarNivel("4","5", "3", "6"),listaEspCtrl.consultar);


export default rotaListaEspera;


