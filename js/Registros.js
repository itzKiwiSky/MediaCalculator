export default function novoRegistroVazio()
{
    return {
        nome: "",
        distInicial: 0,
        distFinal: 0,
        dataAtual: new Date().getTime(),
        listLitros: [],
        mediaCalculada: 0,
        litragemCalculada: 0,
    };
}