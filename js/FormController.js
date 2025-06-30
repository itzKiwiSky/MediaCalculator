import novoRegistroVazio from "./Registros.js";
import RegistroController from "./RegistroController.js";
import { renderLista } from "./RegistroViewerController.js";

let registroAtual = null;
let modoEditar = false;
const formDiv = document.getElementById("novo-registro-form");

// elementos do formulario //
const nomeReg = document.getElementById("nome-reg-input");
const distInicial = document.getElementById("dist-inicial-input");
const distFinal = document.getElementById("dist-final-input");

nomeReg.oninput = () => registroAtual.nome = nomeReg.value.toString();
distInicial.oninput = () => {
    const val = Number(distInicial.value);
    registroAtual.distInicial = !isNaN(val) ? val : 0;
};
distFinal.oninput = () => {
    const val = Number(distFinal.value);
    registroAtual.distFinal = !isNaN(val) ? val : 0;
};

function resetar()
{
    formDiv.classList.add("desativado");
    listaLitros.innerHTML = "";
    nomeReg.value = "";
    distInicial.value = 0;
    distFinal.value = 0;
    registroAtual = novoRegistroVazio();
}

const botaoNovoRegistro = document.getElementById("botao-novo-registro");
botaoNovoRegistro.onclick = () => {
    formDiv.classList.remove("desativado");
    registroAtual = novoRegistroVazio();
};

const botaoCancelar = document.getElementById("botao-cancelar");
botaoCancelar.onclick = () => {
    formDiv.classList.add("desativado");
    resetar();
};

// lista //
const listaLitros = document.getElementById('lista-litros');
listaLitros.onkeydown = (ev) => {
    if (formDiv.classList.contains("desativado") === true)
        return;

    if (e.key === "Enter")
        adicionarLinha();
};
const btnAdicionar = document.getElementById('adicionar-btn');

btnAdicionar.addEventListener("click", () => {
    adicionarLinha();
});

function adicionarLinha(valuedef = 0)
{
    if (formDiv.classList.contains("desativado") === true)
        return;

    const index = listaLitros.children.length;
    const linha = document.createElement("div");
    const text = document.createElement("label");
    text.setAttribute("for", "input");
    text.textContent = "litros: ";
    linha.appendChild(text);
    const inp = document.createElement("input");
    inp.value = valuedef
    inp.setAttribute("type", "number");
    inp.setAttribute("placeholder", valuedef);

    // Garante que o array tenha espaço para o novo valor
    registroAtual.listLitros[index] = Number(inp.value);

    inp.addEventListener("input", (e) => {
        // adiciona a linha no registro interno //
        registroAtual.listLitros[index] = Number(inp.value);
    });

    linha.appendChild(inp);

    const btnRemove = document.createElement("input");
    btnRemove.setAttribute("type", "button");
    btnRemove.setAttribute("id", "btn-delete-key");
    btnRemove.setAttribute("value", "[X]");
    btnRemove.addEventListener("click", () => {
        listaLitros.removeChild(linha);
        registroAtual.listLitros.splice(index, 1);
        console.log(registroAtual);
    });
    linha.appendChild(btnRemove);

    listaLitros.appendChild(linha);

    console.log(registroAtual);
}

const botaoSalvar = document.getElementById("botao-salvar");
botaoSalvar.addEventListener("click", () => {
    // validações
    if (!registroAtual.nome || registroAtual.nome.trim() === "") 
    {
        alert("O nome do posto não pode ser vazio!");
        return;
    }
    if (registroAtual.distInicial < 0 || registroAtual.distFinal <= 0) 
    {
        alert("A distancia inicial nao pode ser menor que 0");
        return;
    }
    // calcula a media //
    let result = 0;
    for(let i = 0; i < registroAtual.listLitros.length; i++)
    {
        const val = registroAtual.listLitros[i];
        if (!isNaN(val)) result += val;
    }

    const diffDistancia = Math.abs(registroAtual.distFinal - registroAtual.distInicial);

    const resultado = Math.floor((diffDistancia / result) * 100) / 100;
    console.log(diffDistancia);
    registroAtual.mediaCalculada = resultado;
    registroAtual.litragemCalculada = result;

    if (registroAtual.id === undefined)
        registrarDB(registroAtual);
    else
    {
        const dboperation = RegistroController.update(registroAtual.id, registroAtual);
        dboperation.then(
        () => {

        }, 
        () => {

        });
    }

    resetar();

    alert("O registro foi adicionado com sucesso!");

    renderLista();
});

async function registrarDB(data) {
    await RegistroController.add(data);
}

export function editarRegistro(index)
{
    const dbop = RegistroController.getById(index);
    dbop.then(
    (d) => {
        console.log(d)
        registroAtual = d;
        formDiv.classList.remove("desativado");
        nomeReg.value = d.nome;
        distInicial.value = d.distInicial;
        distFinal.value = d.distFinal;

        for (let i = 0; i < d.listLitros.length; i++) 
        {
            const element = d.listLitros[i];
            console.log(element);
            adicionarLinha(element);
        }
    },
    () => {

    });
}
