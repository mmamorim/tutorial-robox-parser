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
        return token;
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

    function lista() {
        const comandos = [];                           // lista → comando lista | comando
        let no = comando();
        //console.log(JSON.stringify(no));                                  // sempre há pelo menos um comando
        comandos.push(no)
        while (comecaComando()) {                            // enquanto vier outro comando...
            no = comando();                                       // ...analisa-o também
            //console.log(JSON.stringify(no));
            comandos.push(no)
        }
        //console.log(comandos);        
        return comandos;
    }

    function comando() {
        const token = tokens[i];

        if (token === undefined) {
            throw new Error("Erro sintático: esperado um comando, mas o programa terminou");
        }

        if (token.tipo === "AVANCAR") {                      // comando → AVANCAR NUM
            esperar("AVANCAR");
            const numero = esperar("NUM");
            if(Number(numero.lexema) == 1 ) { console.log("ERRO SEMANTICO: AVANÇAR NEGATIVO") }
            return { tipo: "avancar", passos: Number(numero.lexema) };
        } else if (token.tipo === "GIRAR") {                 // comando → GIRAR NUM
            esperar("GIRAR");
            const numero = esperar("NUM");
            return { tipo: "girar", graus: Number(numero.lexema) }
        } else if (token.tipo === "PINTAR") {                // comando → PINTAR COR
            esperar("PINTAR");
            const cor = esperar("COR");
            return { tipo: "pintar", cor: cor.lexema }
        } else if (token.tipo === "REPETIR") {               // comando → REPETIR NUM ABRE lista FECHA
            esperar("REPETIR");
            const numero = esperar("NUM");           
            esperar("ABRE");
            const vetor = lista();                                        // variável: chama a função dela
            esperar("FECHA");
            return { tipo: "repetir", vezes: Number(numero.lexema), corpo: vetor }
        } else {
            throw new Error("Erro sintático na linha " + token.linha +
                ": esperado um comando, encontrado " + token.tipo);
        }
    }

    const comandos = lista();

    if (i < tokens.length) {                                 // sobrou algum token?
        const token = tokens[i];
        throw new Error("Erro sintático na linha " + token.linha +
            ": esperado o fim do programa, encontrado " + token.tipo);
    }

    return { tipo: "programa", comandos: comandos }
}