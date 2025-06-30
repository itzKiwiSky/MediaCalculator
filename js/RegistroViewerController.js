import RegistroController from "./RegistroController.js";
import novoRegistroVazio from "./Registros.js";


const botaoAtualizar = document.getElementById("botao-atualizar");
botaoAtualizar.addEventListener("click", renderLista);
document.addEventListener("DOMContentLoaded", renderLista);
const registroWarn = document.getElementById("registro-warn");
const botaoApagar = document.getElementById("botao-limpar");
botaoApagar.onclick = () => {
    const db = RegistroController.getAll();
    db.then((d) => {
        for (let i = 0; i < d.length; i++) {
            const element = d[i];
            RegistroController.remove(element.id);
        }
        renderLista();
    });
}

function debugAddReg() 
{
    return;
    for (let index = 0; index < 15; index++) 
    {
        RegistroController.add(novoRegistroVazio());
    }
}

document.addEventListener("DOMContentLoaded", debugAddReg);

async function getDatabase() 
{
    return await RegistroController.getAll();
}

async function deleteIndex(index) 
{
    return await RegistroController.remove(index);
}

const listaDiv = document.getElementById("lista-media");

export function renderLista()
{
    const db = getDatabase();
    listaDiv.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Distancia Inicio</th>
            <th>Distancia Fim</th>
            <th>Litragem Total</th>
            <th>Media</th>
            <th>Editar</th>
            <th>Remover</th>
        </tr>
    `;
    db.then((d) => { 
        if (d.length > 0)
            registroWarn.classList.add("desativado");
        for (let i = 0; i < d.length; i++) 
        {
            const element = d[i];
            const trEl = document.createElement("tr");
            
            const dataAtual = new Date(element.dataAtual);

            const tdID = document.createElement("td");
            tdID.textContent = i;
            trEl.appendChild(tdID);

            const tdPosto = document.createElement("td");
            tdPosto.textContent = element.nome;
            trEl.appendChild(tdPosto);

            const tdData = document.createElement("td");
            const dataBR = dataAtual.toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });
            tdData.textContent = dataBR ;
            trEl.appendChild(tdData);

            const tdDistInicio = document.createElement("td");
            tdDistInicio.textContent = element.distInicial;
            trEl.appendChild(tdDistInicio);

            const tdDistFim = document.createElement("td");
            tdDistFim.textContent = element.distFinal;
            trEl.appendChild(tdDistFim);

            const tdLitragem = document.createElement("td");
            tdLitragem.textContent = element.litragemCalculada;
            trEl.appendChild(tdLitragem);

            const tdMediaFim = document.createElement("td");
            tdMediaFim.textContent = element.mediaCalculada;
            trEl.appendChild(tdMediaFim);

            const tdButtonEdit = document.createElement("td");
            const buttonEdit = document.createElement("button");
            buttonEdit.setAttribute("type", "button");
            buttonEdit.setAttribute("id", "botao-editar");
            buttonEdit.addEventListener("click", () => {
                
            });
            buttonEdit.textContent = "Editar";
            buttonEdit.classList.add("botao-lista", "editar");
            tdButtonEdit.appendChild(buttonEdit);
            trEl.appendChild(tdButtonEdit);

            const tdButtonRemove = document.createElement("td");
            const buttonRemove = document.createElement("button");
            buttonRemove.setAttribute("type", "button");
            buttonRemove.setAttribute("id", "botao-remover");
            buttonRemove.classList.add("botao-lista", "remover");
            buttonRemove.addEventListener("click", () => {
                const db = RegistroController.remove(element.id);
                db.then(() => {
                    listaDiv.removeChild(trEl);
                    renderLista();
                    //console.log(rej);
                }, (e) => {console.log(e)});
            });
            buttonRemove.textContent = "Remover";
            tdButtonRemove.appendChild(buttonRemove);
            trEl.appendChild(tdButtonRemove);

            listaDiv.appendChild(trEl);
        }
    });
}