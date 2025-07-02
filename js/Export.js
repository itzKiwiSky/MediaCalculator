export default function exportFile(format, data)
{
    const formats = {
        csv: {
            allowedExtension: ".csv",
            action: () => {
                let result = "";

                function createField(fields)
                {
                    let header = "";
                    for (let f = 0; f < fields.length; f++) 
                    {
                        const field = fields[f];
                        header += f < fields.length - 1 ? field + "," : field;
                    }
                    return header;
                }

                // criar primeira linha como um Header //
                result += createField(["nome", "KM Inicial", "KM Final", "data", "litragem calculada", "media calculada"]) + "\n";

                for (let i = 0; i < data.length; i++) 
                {
                    const element = data[i];
                    const dataAtual = new Date(element.dataAtual);
                    
                    const datafields = [
                        element.nome, 
                        element.distInicial, 
                        element.distFinal, 
                        dataAtual.toLocaleDateString("pt-BR"), 
                        element.litragemCalculada, 
                        element.mediaCalculada,
                    ];

                    result += "\n" + createField(datafields);
                }

                return result;
            },
        },
    };

    if (formats[format] !== undefined)
    {
        if (data.length <= 0)
            return;

        const exportedTable = formats[format].action(data);
        console.log(exportedTable);

        let pom = document.createElement('a');
        pom.style.display = "none";
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportedTable));

        pom.setAttribute('download', "tabela de media exportada " + new Date().toLocaleString("pt-BR") + ".csv");
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
        pom = null;
    }
    else
        alert("Metodo de exportacao invalida")
}