
let contador = 0;
export function paraMermaid(no, linhas) {
    const id = "n" + contador;
    contador = contador + 1;
    let rotulo = no.tipo;
    let filhos = [];
    if (no.tipo === "avancar") { rotulo = "avancar " + no.passos; }
    if (no.tipo === "girar") { rotulo = "girar " + no.graus; }
    if (no.tipo === "pintar") { rotulo = "pintar " + no.cor; }
    if (no.tipo === "repetir") { rotulo = "repetir " + no.vezes; filhos = no.corpo; }
    if (no.tipo === "programa") { filhos = no.comandos; }
    linhas.push("" + id + '["' + rotulo + '"]');
    for (const filho of filhos) {
        const idFilho = paraMermaid(filho, linhas);
        linhas.push("" + id + " -- > " + idFilho);
    }
    return id;
}