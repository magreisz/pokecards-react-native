import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIOS = "@pokecards:usuarios";
const CHAVE_SESSAO = "@pokecards:sessao";
const CHAVE_TENTATIVAS = "@pokecards:tentativas";

const chaveCards = (email) => `@pokecards:cards:${email}`;

async function lerJson(chave, padrao) {
  const valor = await AsyncStorage.getItem(chave);
  if (!valor) {
    return padrao;
  }
  try {
    return JSON.parse(valor);
  } catch {
    return padrao;
  }
}

export async function listarUsuarios() {
  return lerJson(CHAVE_USUARIOS, []);
}

export async function buscarUsuarioPorEmail(email) {
  const usuarios = await listarUsuarios();
  return usuarios.find((usuario) => usuario.email === email) || null;
}

export async function salvarUsuario(usuario) {
  const usuarios = await listarUsuarios();
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([...usuarios, usuario]));
}

export async function iniciarSessao(email) {
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify({ email, inicio: Date.now() }));
}

export async function lerSessao() {
  return lerJson(CHAVE_SESSAO, null);
}

export async function encerrarSessao() {
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}

export async function lerTentativas() {
  return lerJson(CHAVE_TENTATIVAS, { falhas: 0, bloqueadoAte: 0 });
}

export async function gravarTentativas(tentativas) {
  await AsyncStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(tentativas));
}

export async function listarCards(email) {
  return lerJson(chaveCards(email), []);
}

export async function gravarCards(email, cards) {
  await AsyncStorage.setItem(chaveCards(email), JSON.stringify(cards));
}
