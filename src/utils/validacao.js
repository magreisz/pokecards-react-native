export const somenteDigitos = (valor) => valor.replace(/\D/g, "");

export function mascaraTelefone(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraCpf(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  const digito = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i += 1) {
      soma += Number(cpf[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

export function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor) && valor.length <= 120;
}

export function normalizarEmail(valor) {
  return valor.trim().toLowerCase();
}

export function validarCadastro(dados) {
  const erros = {};
  const nome = dados.nome.trim();

  if (nome.length < 3 || nome.length > 80) {
    erros.nome = "Informe o nome completo (3 a 80 caracteres).";
  }
  const telefone = somenteDigitos(dados.telefone);
  if (telefone.length < 10 || telefone.length > 11) {
    erros.telefone = "Telefone deve ter DDD e 8 ou 9 dígitos.";
  }
  if (!cpfValido(dados.cpf)) {
    erros.cpf = "CPF inválido.";
  }
  if (!emailValido(normalizarEmail(dados.email))) {
    erros.email = "E-mail inválido.";
  }
  const curso = dados.curso.trim();
  if (curso.length < 2 || curso.length > 60) {
    erros.curso = "Informe o curso.";
  }
  if (dados.senha.length < 8 || dados.senha.length > 64) {
    erros.senha = "A senha precisa ter de 8 a 64 caracteres.";
  }
  if (dados.confirmacao !== dados.senha) {
    erros.confirmacao = "As senhas não conferem.";
  }
  return erros;
}
