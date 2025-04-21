//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import ListaEsperaCtrl from "../Controle/listaEsperaCtrl.js";

const listaEspCtrl = new ListaEsperaCtrl();
const rotaListaEspera = Router();

rotaListaEspera.post("/:numProtocolo", listaEspCtrl.gravar);
rotaListaEspera.delete("/:id", listaEspCtrl.excluir);
rotaListaEspera.get("/:nome?", listaEspCtrl.consultar);
rotaListaEspera.get("/",listaEspCtrl.consultar);

export default rotaListaEspera;


