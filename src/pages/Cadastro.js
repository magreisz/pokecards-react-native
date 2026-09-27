import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

import Campo from "../components/Campo";
import Botao from "../components/Botao";
import { cores } from "../theme";
import { gerarHash } from "../services/senha";
import { listarUsuarios, salvarUsuario } from "../services/storage";
import {
  mascaraCpf,
  mascaraTelefone,
  normalizarEmail,
  somenteDigitos,
  validarCadastro,
} from "../utils/validacao";
import { avisar } from "../utils/mensagens";

const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 20px;
  background-color: ${cores.fundo};
`;

const Cartao = styled.View`
  width: 100%;
  max-width: 480px;
  background-color: ${cores.branco};
  border-radius: 16px;
  padding: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
`;

const Aviso = styled.Text`
  font-size: 13px;
  color: ${cores.textoSuave};
  margin-bottom: 16px;
`;

const inicial = {
  nome: "",
  telefone: "",
  cpf: "",
  email: "",
  curso: "",
  senha: "",
  confirmacao: "",
};

export default function Cadastro() {
  const navigation = useNavigation();
  const [dados, setDados] = useState(inicial);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const alterar = (campo) => (valor) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) {
      setErros((atual) => ({ ...atual, [campo]: undefined }));
    }
  };

  const handleSalvar = async () => {
    if (salvando) {
      return;
    }
    const encontrados = validarCadastro(dados);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      return;
    }

    setSalvando(true);
    try {
      const email = normalizarEmail(dados.email);
      const cpf = somenteDigitos(dados.cpf);
      const usuarios = await listarUsuarios();

      if (usuarios.some((u) => u.email === email)) {
        setErros({ email: "Este e-mail já está cadastrado." });
        return;
      }
      if (usuarios.some((u) => u.cpf === cpf)) {
        setErros({ cpf: "Este CPF já está cadastrado." });
        return;
      }

      const senhaHash = await gerarHash(dados.senha);

      await salvarUsuario({
        nome: dados.nome.trim(),
        telefone: somenteDigitos(dados.telefone),
        cpf,
        email,
        curso: dados.curso.trim(),
        senhaHash,
        criadoEm: new Date().toISOString(),
      });

      setDados(inicial);
      avisar("Cadastro realizado", "Agora é só entrar com seu e-mail e senha.");
      navigation.navigate("login");
    } catch {
      avisar("Erro", "Não foi possível salvar o cadastro. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Cartao>
            <Aviso>Os dados ficam salvos somente neste aparelho.</Aviso>

            <Campo
              rotulo="Nome"
              icone="badge"
              placeholder="Nome completo"
              value={dados.nome}
              onChangeText={alterar("nome")}
              erro={erros.nome}
              maxLength={80}
              autoCapitalize="words"
            />
            <Campo
              rotulo="Telefone"
              icone="phone"
              placeholder="(16) 99999-9999"
              value={dados.telefone}
              onChangeText={(v) => alterar("telefone")(mascaraTelefone(v))}
              erro={erros.telefone}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <Campo
              rotulo="CPF"
              icone="fingerprint"
              placeholder="000.000.000-00"
              value={dados.cpf}
              onChangeText={(v) => alterar("cpf")(mascaraCpf(v))}
              erro={erros.cpf}
              keyboardType="number-pad"
              maxLength={14}
            />
            <Campo
              rotulo="E-mail"
              icone="email"
              placeholder="voce@email.com"
              value={dados.email}
              onChangeText={alterar("email")}
              erro={erros.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={120}
            />
            <Campo
              rotulo="Curso"
              icone="school"
              placeholder="Ex.: Desenvolvimento de Software Multiplataforma"
              value={dados.curso}
              onChangeText={alterar("curso")}
              erro={erros.curso}
              maxLength={60}
            />
            <Campo
              rotulo="Senha"
              icone="lock"
              placeholder="Mínimo de 8 caracteres"
              value={dados.senha}
              onChangeText={alterar("senha")}
              erro={erros.senha}
              senha
              maxLength={64}
            />
            <Campo
              rotulo="Confirmar senha"
              icone="lock-outline"
              placeholder="Repita a senha"
              value={dados.confirmacao}
              onChangeText={alterar("confirmacao")}
              erro={erros.confirmacao}
              senha
              maxLength={64}
            />

            <Botao titulo="Salvar" icone="save" onPress={handleSalvar} carregando={salvando} />
          </Cartao>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
