import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Campo from "../components/Campo";
import Botao from "../components/Botao";
import { cores } from "../theme";
import { conferirSenha } from "../services/senha";
import {
  buscarUsuarioPorEmail,
  gravarTentativas,
  iniciarSessao,
  lerSessao,
  lerTentativas,
} from "../services/storage";
import { normalizarEmail } from "../utils/validacao";
import { avisar } from "../utils/mensagens";

const DURACAO_SESSAO = 8 * 60 * 60 * 1000;
const MAX_FALHAS = 5;
const TEMPO_BLOQUEIO = 60 * 1000;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: ${cores.fundo};
`;

const Cartao = styled.View`
  width: 100%;
  max-width: 420px;
  background-color: ${cores.branco};
  border-radius: 16px;
  padding: 24px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
`;

const Topo = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const Titulo = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: ${cores.escuro};
  margin-top: 8px;
`;

const Subtitulo = styled.Text`
  font-size: 14px;
  color: ${cores.textoSuave};
  margin-top: 4px;
  text-align: center;
`;

export default function Login() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      lerSessao().then((sessao) => {
        if (ativo && sessao && Date.now() - sessao.inicio < DURACAO_SESSAO) {
          navigation.reset({ index: 0, routes: [{ name: "cards" }] });
        }
      });
      return () => {
        ativo = false;
      };
    }, [navigation]),
  );

  const handleEntrar = async () => {
    const email = normalizarEmail(usuario);
    if (!email || !senha) {
      avisar("Atenção", "Preencha usuário e senha.");
      return;
    }

    setCarregando(true);
    try {
      const tentativas = await lerTentativas();
      if (tentativas.bloqueadoAte > Date.now()) {
        const segundos = Math.ceil((tentativas.bloqueadoAte - Date.now()) / 1000);
        avisar("Muitas tentativas", `Aguarde ${segundos} segundos para tentar novamente.`);
        return;
      }

      const cadastro = await buscarUsuarioPorEmail(email);
      const senhaOk = cadastro ? await conferirSenha(senha, cadastro.senhaHash) : false;

      if (!senhaOk) {
        const falhas = tentativas.falhas + 1;
        const bloquear = falhas >= MAX_FALHAS;
        await gravarTentativas({
          falhas: bloquear ? 0 : falhas,
          bloqueadoAte: bloquear ? Date.now() + TEMPO_BLOQUEIO : 0,
        });
        avisar("Não foi possível entrar", "Usuário ou senha inválidos.");
        return;
      }

      await gravarTentativas({ falhas: 0, bloqueadoAte: 0 });
      await iniciarSessao(cadastro.email);
      setSenha("");
      navigation.reset({ index: 0, routes: [{ name: "cards" }] });
    } catch {
      avisar("Erro", "Não foi possível entrar agora. Tente novamente.");
    } finally {
      setCarregando(false);
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
            <Topo>
              <MaterialCommunityIcons name="pokeball" size={72} color={cores.primaria} />
              <Titulo>PokéCards</Titulo>
              <Subtitulo>Monte sua coleção de cards com dados da PokéAPI</Subtitulo>
            </Topo>

            <Campo
              rotulo="Usuário"
              icone="person"
              placeholder="Seu e-mail cadastrado"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              maxLength={120}
            />
            <Campo
              rotulo="Senha"
              icone="lock"
              placeholder="Sua senha"
              value={senha}
              onChangeText={setSenha}
              senha
              maxLength={64}
              returnKeyType="go"
              onSubmitEditing={handleEntrar}
            />

            <Botao titulo="Entrar" icone="login" onPress={handleEntrar} carregando={carregando} />
            <Botao
              titulo="Cadastrar usuário"
              icone="person-add"
              variante="secundario"
              onPress={() => navigation.navigate("cadastro")}
              disabled={carregando}
            />
          </Cartao>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
