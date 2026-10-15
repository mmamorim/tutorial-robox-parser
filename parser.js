export function analisarSintatico(tokens) {
    let i = 0;
    // ponteiro: posição do token atual na lista de tokens
    function esperar(tipo) {
        const token = tokens[i];
        // o token da vez
        if (token === undefined) {
            // acabaram os tokens
            throw new Error("Erro sintático: esperado " + tipo + ", mas o programa terminou");
        }
        if (token.tipo !== tipo) {
            // não é o tipo que a gramática pede
            throw new Error("Erro sintático na linha " + token.linha +
                ": esperado " + tipo + ", encontrado " + token.tipo);
        }
        i = i + 1;
        // era o certo: consome e avança
        return token;
    }
    function comecaComando() {
        const token = tokens[i];
        if (token === undefined) {
            return false;
        }
        // sem token, não começa comando
        if (token.tipo === "AVANCAR" || token.tipo === "GIRAR" ||
            token.tipo === "PINTAR" || token.tipo === "REPETIR") {
            return true;
        }

        return false;
    }
    function lista() {
        const comandos = [];
        comandos.push(comando());
        while (comecaComando()) {
            comandos.push(comando());
        }
        return comandos;
    }
    // lista → comando lista | comando
    // sempre há pelo menos um comando
    // enquanto vier outro comando...
    // ...analisa-o também
    function comando() {
        const token = tokens[i];
        if (token === undefined) {
            throw new Error("Erro sintático: esperado um comando, mas o programa terminou");
        }
        if (token.tipo === "AVANCAR") {
            // comando → AVANCAR NUM
            esperar("AVANCAR");
            const numero = esperar("NUM");
            return { tipo: "avancar", passos: Number(numero.lexema) };
        } else if (token.tipo === "GIRAR") {
            // comando → GIRAR NUM
            esperar("GIRAR");
            const numero = esperar("NUM");
            return { tipo: "girar", passos: Number(numero.lexema) };
        } else if (token.tipo === "PINTAR") {
            // comando → PINTAR COR
            esperar("PINTAR");
            const cor = esperar("COR");
            return { tipo: "pintar", cor: cor.lexema };
        } else if (token.tipo === "REPETIR") {
            // comando → REPETIR NUM ABRE lista FECHA
            esperar("REPETIR");
            const numero = esperar("NUM");
            esperar("ABRE");
            const corpo = lista();
            // variável: chama a função dela
            esperar("FECHA");
            return { tipo: "repetir", vezes: Number(numero.lexema), corpo: corpo };
        } else {
            throw new Error("Erro sintático na linha " + token.linha +
                ": esperado um comando, encontrado " + token.tipo);
        }
    }

    const comandos = lista();
    
    // programa → lista
    if (i < tokens.length) {
        // sobrou algum token?
        const token = tokens[i];
        throw new Error("Erro sintático na linha " + token.linha +
            ": esperado o fim do programa, encontrado " + token.tipo);
    }

    return { tipo: "programa", comandos: comandos };
}