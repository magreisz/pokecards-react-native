export const cores = {
  primaria: "#E3350D",
  primariaEscura: "#B32A0A",
  escuro: "#212121",
  texto: "#2B2B2B",
  textoSuave: "#6B6B6B",
  fundo: "#F4F5F7",
  branco: "#FFFFFF",
  borda: "#DDDDDD",
  perigo: "#C62828",
  sucesso: "#2E7D32",
};

export const tipos = {
  normal: { nome: "Normal", cor: "#A8A77A" },
  fire: { nome: "Fogo", cor: "#EE8130" },
  water: { nome: "Água", cor: "#6390F0" },
  electric: { nome: "Elétrico", cor: "#E0B400" },
  grass: { nome: "Planta", cor: "#5FAE3A" },
  ice: { nome: "Gelo", cor: "#61C7C1" },
  fighting: { nome: "Lutador", cor: "#C22E28" },
  poison: { nome: "Venenoso", cor: "#A33EA1" },
  ground: { nome: "Terrestre", cor: "#C9A845" },
  flying: { nome: "Voador", cor: "#8D78E8" },
  psychic: { nome: "Psíquico", cor: "#F95587" },
  bug: { nome: "Inseto", cor: "#94A31A" },
  rock: { nome: "Pedra", cor: "#B6A136" },
  ghost: { nome: "Fantasma", cor: "#735797" },
  dragon: { nome: "Dragão", cor: "#6F35FC" },
  dark: { nome: "Sombrio", cor: "#705746" },
  steel: { nome: "Aço", cor: "#8E8EA8" },
  fairy: { nome: "Fada", cor: "#D685AD" },
};

export const nomesStats = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidade",
};

export const habitats = {
  cave: "Caverna",
  forest: "Floresta",
  grassland: "Campo",
  mountain: "Montanha",
  rare: "Raro",
  "rough-terrain": "Terreno acidentado",
  sea: "Mar",
  urban: "Urbano",
  "waters-edge": "Beira d'água",
};

export function corDoTipo(tipo) {
  return tipos[tipo]?.cor || cores.textoSuave;
}

export function nomeDoTipo(tipo) {
  return tipos[tipo]?.nome || tipo;
}

export function formatarNome(nome) {
  return nome
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

export function formatarNumero(id) {
  return `#${String(id).padStart(4, "0")}`;
}
