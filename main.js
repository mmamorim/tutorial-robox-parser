import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";

const exemplo = `repetir 3 [
    avancar 10
    repetir 2 [
        girar 90
    ]
    pintar verde
]`;

document.getElementById("entrada").value = exemplo;

function analisar() {
    const texto = document.getElementById("entrada").value;
    const resultado = analisarLexico(texto);
    const tokens = resultado.tokens;
    const erros = resultado.erros;

    const linhas = [];

    for (const token of tokens) {
        const onde = "linha " + token.linha + "  ";
        const nome = token.tipo.padEnd(9);
        const lexema = '"' + token.lexema + '"';
        linhas.push(onde + nome + lexema);
    }

    linhas.push("");

    if (erros.length > 0) {
        for (const erro of erros) {
            linhas.push('Erro léxico na linha ' + erro.linha + ': "' + erro.lexema + '" não forma nenhum token');
        }
    } else {
        try {
            analisarSintatico(tokens);
            linhas.push("Análise sintática: programa válido");
        } catch (falha) {
            linhas.push(falha.message);
        }
    }

    document.getElementById("saida").textContent = linhas.join("\n");
}

document.getElementById("botao").addEventListener("click", analisar);