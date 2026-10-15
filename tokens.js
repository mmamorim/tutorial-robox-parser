export const regras = [
    { tipo: "ESPACO", padrao: /\s+/y, ignorar: true },
    { tipo: "AVANCAR", padrao: /avancar/y },
    {
        tipo: "GIRAR",
        padrao: /girar/y
    },
    { tipo: "PINTAR", padrao: /pintar/y },
    { tipo: "REPETIR", padrao: /repetir/y },
    {
        tipo: "COR",
        padrao: /vermelho|azul|verde/y
    },
    {
        tipo: "NUM",
        padrao: /[1-9][0-9]*/y
    },
    {
        tipo: "ABRE",
        padrao: /\[/y
    },
    {
        tipo: "FECHA",
        padrao: /\]/y
    },
];