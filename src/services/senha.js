import bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";

const CUSTO = 10;

bcrypt.setRandomFallback((tamanho) => Array.from(Crypto.getRandomBytes(tamanho)));

export function gerarHash(senha) {
  return bcrypt.hash(senha, CUSTO);
}

export function conferirSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}
