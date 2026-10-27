export function analisarSintatico(tokens) {
    let i = 0;      // ponteiro: posição do token atual na lista de tokens

    function esperar(tipo) {
        const token = tokens[i];                             // o token da vez

        if (token === undefined) {                           // acabaram os tokens
            throw new Error("Erro sintático: esperado " + tipo + ", mas o programa terminou");
        }

        if (token.tipo !== tipo) {                           // não é o tipo que a gramática pede
            throw new Error("Erro sintático na linha " + token.linha +
                            ": esperado " + tipo + ", encontrado " + token.tipo);
        }

        i = i + 1;                                           // era o certo: consome e avança
    }

    function comecaComando() {
        const token = tokens[i];

        if (token === undefined) {                           // sem token, não começa comando
            return false;
        }

        if (token.tipo === "AVANCAR" || token.tipo === "GIRAR" ||
            token.tipo === "PINTAR" || token.tipo === "REPETIR") {
            return true;
        }

        return false;
    }

    function lista() {                                       // lista → comando lista | comando
        comando();                                           // sempre há pelo menos um comando
        while (comecaComando()) {                            // enquanto vier outro comando...
            comando();                                       // ...analisa-o também
        }
    }

    function comando() {
        const token = tokens[i];

        if (token === undefined) {
            throw new Error("Erro sintático: esperado um comando, mas o programa terminou");
        }

        if (token.tipo === "AVANCAR") {                      // comando → AVANCAR NUM
            esperar("AVANCAR");
            esperar("NUM");
        } else if (token.tipo === "GIRAR") {                 // comando → GIRAR NUM
            esperar("GIRAR");
            esperar("NUM");
        } else if (token.tipo === "PINTAR") {                // comando → PINTAR COR
            esperar("PINTAR");
            esperar("COR");
        } else if (token.tipo === "REPETIR") {               // comando → REPETIR NUM ABRE lista FECHA
            esperar("REPETIR");
            esperar("NUM");
            esperar("ABRE");
            lista();                                         // variável: chama a função dela
            esperar("FECHA");
        } else {
            throw new Error("Erro sintático na linha " + token.linha +
                            ": esperado um comando, encontrado " + token.tipo);
        }
    }

    lista();                                                 // programa → lista

    if (i < tokens.length) {                                 // sobrou algum token?
        const token = tokens[i];
        throw new Error("Erro sintático na linha " + token.linha +
                        ": esperado o fim do programa, encontrado " + token.tipo);
    }
}