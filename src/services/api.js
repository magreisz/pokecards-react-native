import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 15000,
});

export const TOTAL_POKEMONS = 1025;

export function imagemOficial(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function idPelaUrl(url) {
  const partes = url.split("/").filter(Boolean);
  return Number(partes[partes.length - 1]);
}

function valorStat(stats, nome) {
  const stat = stats.find((item) => item.stat.name === nome);
  return stat ? stat.base_stat : 0;
}

export async function buscarPokemon(termo) {
  const chave = String(termo).trim().toLowerCase().replace(/^#/, "").replace(/^0+(?=\d)/, "");
  const { data } = await api.get(`/pokemon/${encodeURIComponent(chave)}`);

  return {
    id: data.id,
    nome: data.name,
    imagem:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      imagemOficial(data.id),
    tipos: data.types.map((item) => item.type.name),
    hp: valorStat(data.stats, "hp"),
    ataque: valorStat(data.stats, "attack"),
    defesa: valorStat(data.stats, "defense"),
    altura: data.height / 10,
    peso: data.weight / 10,
  };
}

function textoNoIdioma(lista, campo) {
  const idiomas = ["pt-br", "pt", "en"];
  for (const idioma of idiomas) {
    const item = lista.find((entrada) => entrada.language.name === idioma);
    if (item) {
      return item[campo].replace(/[\n\f\r]+/g, " ");
    }
  }
  return "";
}

function achatarEvolucoes(no, lista = []) {
  lista.push({ id: idPelaUrl(no.species.url), nome: no.species.name });
  no.evolves_to.forEach((filho) => achatarEvolucoes(filho, lista));
  return lista;
}

export async function buscarDetalhes(id) {
  const { data: pokemon } = await api.get(`/pokemon/${id}`);
  const { data: especie } = await api.get(`/pokemon-species/${idPelaUrl(pokemon.species.url)}`);

  let evolucoes = [];
  if (especie.evolution_chain?.url) {
    const { data: cadeia } = await axios.get(especie.evolution_chain.url, { timeout: 15000 });
    evolucoes = achatarEvolucoes(cadeia.chain);
  }

  return {
    id: pokemon.id,
    nome: pokemon.name,
    imagem:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ||
      pokemon.sprites?.front_default ||
      imagemOficial(pokemon.id),
    imagemShiny: pokemon.sprites?.other?.["official-artwork"]?.front_shiny || null,
    tipos: pokemon.types.map((item) => item.type.name),
    altura: pokemon.height / 10,
    peso: pokemon.weight / 10,
    experiencia: pokemon.base_experience,
    stats: pokemon.stats.map((item) => ({ nome: item.stat.name, valor: item.base_stat })),
    habilidades: pokemon.abilities.map((item) => ({
      nome: item.ability.name,
      oculta: item.is_hidden,
    })),
    golpes: pokemon.moves.slice(0, 8).map((item) => item.move.name),
    categoria: textoNoIdioma(especie.genera, "genus"),
    descricao: textoNoIdioma(especie.flavor_text_entries, "flavor_text"),
    habitat: especie.habitat?.name || null,
    geracao: especie.generation?.name || null,
    lendario: especie.is_legendary,
    mitico: especie.is_mythical,
    taxaCaptura: especie.capture_rate,
    evolucoes,
  };
}

export default api;
