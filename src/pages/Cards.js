import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Botao from "../components/Botao";
import TipoBadge from "../components/TipoBadge";
import { cores, corDoTipo, formatarNome, formatarNumero } from "../theme";
import { buscarPokemon, TOTAL_POKEMONS } from "../services/api";
import {
  buscarUsuarioPorEmail,
  encerrarSessao,
  gravarCards,
  lerSessao,
  listarCards,
} from "../services/storage";
import { avisar, confirmar } from "../utils/mensagens";

const Container = styled.View`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Cabecalho = styled.View`
  padding: 16px 16px 12px;
  background-color: ${cores.branco};
  border-bottom-width: 1px;
  border-bottom-color: ${cores.borda};
`;

const Saudacao = styled.Text`
  font-size: 15px;
  color: ${cores.textoSuave};
  margin-bottom: 10px;
`;

const Formulario = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Entrada = styled.TextInput.attrs({
  placeholderTextColor: "#9A9A9A",
})`
  flex: 1;
  height: 46px;
  background-color: ${cores.fundo};
  border-width: 1.5px;
  border-color: ${cores.borda};
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  color: ${cores.texto};
`;

const BotaoQuadrado = styled.TouchableOpacity`
  width: 46px;
  height: 46px;
  border-radius: 10px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.$cor};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const BotaoAdd = styled.TouchableOpacity`
  height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  margin-left: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${cores.primaria};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const TextoAdd = styled.Text`
  color: ${cores.branco};
  font-weight: bold;
  font-size: 15px;
  margin-left: 4px;
`;

const Contador = styled.Text`
  font-size: 12px;
  color: ${cores.textoSuave};
  margin-top: 8px;
`;

const Card = styled.View`
  background-color: ${cores.branco};
  border-radius: 16px;
  margin: 8px 16px;
  overflow: hidden;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
`;

const Faixa = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${(p) => p.$cor};
`;

const Imagem = styled.Image`
  width: 110px;
  height: 110px;
`;

const Info = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const Numero = styled.Text`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: bold;
`;

const Nome = styled.Text`
  color: ${cores.branco};
  font-size: 22px;
  font-weight: bold;
`;

const LinhaTipos = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Corpo = styled.View`
  padding: 12px 14px 8px;
`;

const LinhaStatus = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Status = styled.View`
  align-items: center;
  flex: 1;
`;

const ValorStatus = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${cores.escuro};
`;

const RotuloStatus = styled.Text`
  font-size: 11px;
  color: ${cores.textoSuave};
  text-transform: uppercase;
`;

const Vazio = styled.View`
  align-items: center;
  padding: 48px 32px;
`;

const TextoVazio = styled.Text`
  text-align: center;
  color: ${cores.textoSuave};
  font-size: 15px;
  margin-top: 12px;
`;

function StatusItem({ rotulo, valor }) {
  return (
    <Status>
      <ValorStatus>{valor}</ValorStatus>
      <RotuloStatus>{rotulo}</RotuloStatus>
    </Status>
  );
}

export default function Cards() {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [cards, setCards] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pronto, setPronto] = useState(false);

  const sair = useCallback(async () => {
    const ok = await confirmar("Sair", "Deseja encerrar a sessão?", "Sair");
    if (!ok) {
      return;
    }
    await encerrarSessao();
    navigation.reset({ index: 0, routes: [{ name: "login" }] });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="logout"
          size={24}
          color={cores.branco}
          style={{ marginRight: 16 }}
          onPress={sair}
          accessibilityLabel="Sair"
        />
      ),
    });
  }, [navigation, sair]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        const sessao = await lerSessao();
        if (!sessao) {
          navigation.reset({ index: 0, routes: [{ name: "login" }] });
          return;
        }
        const [usuario, salvos] = await Promise.all([
          buscarUsuarioPorEmail(sessao.email),
          listarCards(sessao.email),
        ]);
        if (!ativo) {
          return;
        }
        setEmail(sessao.email);
        setNomeUsuario(usuario ? usuario.nome.split(" ")[0] : "");
        setCards(salvos);
        setPronto(true);
      })();
      return () => {
        ativo = false;
      };
    }, [navigation]),
  );

  const atualizarCards = async (novos) => {
    setCards(novos);
    if (email) {
      await gravarCards(email, novos);
    }
  };

  const adicionar = async (termo) => {
    if (carregando) {
      return;
    }
    const valor = String(termo).trim();
    if (!valor) {
      avisar("Atenção", "Digite o nome ou número de um Pokémon, ou use o botão aleatório.");
      return;
    }
    if (valor.length > 40 || !/^#?[a-zA-Z0-9-]+$/.test(valor)) {
      avisar("Atenção", "Use apenas letras, números e hífen.");
      return;
    }

    setCarregando(true);
    try {
      const pokemon = await buscarPokemon(valor);
      if (cards.some((card) => card.id === pokemon.id)) {
        avisar("Card repetido", `${formatarNome(pokemon.nome)} já está na sua coleção.`);
        return;
      }
      await atualizarCards([pokemon, ...cards]);
      setBusca("");
      Keyboard.dismiss();
    } catch (erro) {
      if (erro.response?.status === 404) {
        avisar("Não encontrado", "Nenhum Pokémon com esse nome ou número.");
      } else {
        avisar("Sem conexão", "Não foi possível consultar a PokéAPI. Verifique a internet.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const adicionarAleatorio = () => {
    const livres = TOTAL_POKEMONS - cards.length;
    if (livres <= 0) {
      return;
    }
    let id;
    do {
      id = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
    } while (cards.some((card) => card.id === id));
    adicionar(String(id));
  };

  const excluir = async (card) => {
    const ok = await confirmar(
      "Excluir card",
      `Remover ${formatarNome(card.nome)} da coleção?`,
      "Excluir",
    );
    if (ok) {
      await atualizarCards(cards.filter((item) => item.id !== card.id));
    }
  };

  const renderCard = ({ item }) => (
    <Card>
      <Faixa $cor={corDoTipo(item.tipos[0])}>
        <Imagem source={{ uri: item.imagem }} resizeMode="contain" />
        <Info>
          <Numero>{formatarNumero(item.id)}</Numero>
          <Nome numberOfLines={1}>{formatarNome(item.nome)}</Nome>
          <LinhaTipos>
            {item.tipos.map((tipo) => (
              <TipoBadge key={tipo} tipo={tipo} />
            ))}
          </LinhaTipos>
        </Info>
      </Faixa>
      <Corpo>
        <LinhaStatus>
          <StatusItem rotulo="HP" valor={item.hp} />
          <StatusItem rotulo="Ataque" valor={item.ataque} />
          <StatusItem rotulo="Defesa" valor={item.defesa} />
          <StatusItem rotulo="Altura" valor={`${item.altura} m`} />
          <StatusItem rotulo="Peso" valor={`${item.peso} kg`} />
        </LinhaStatus>
        <Botao
          titulo="Ver mais detalhes"
          icone="info-outline"
          variante="escuro"
          onPress={() => navigation.navigate("detalhes", { id: item.id, nome: item.nome })}
        />
        <Botao
          titulo="Excluir"
          icone="delete-outline"
          variante="perigo"
          onPress={() => excluir(item)}
        />
      </Corpo>
    </Card>
  );

  return (
    <Container>
      <Cabecalho>
        {nomeUsuario ? <Saudacao>Olá, {nomeUsuario}! Adicione Pokémon à sua coleção.</Saudacao> : null}
        <Formulario>
          <Entrada
            placeholder="Nome ou número (ex.: pikachu, 25)"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={40}
            returnKeyType="send"
            onSubmitEditing={() => adicionar(busca)}
            editable={!carregando}
          />
          <BotaoAdd
            onPress={() => adicionar(busca)}
            disabled={carregando}
            accessibilityRole="button"
            accessibilityLabel="Adicionar card"
          >
            {carregando ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              <>
                <MaterialIcons name="add-circle" size={22} color={cores.branco} />
                <TextoAdd>ADD</TextoAdd>
              </>
            )}
          </BotaoAdd>
          <BotaoQuadrado
            $cor={cores.escuro}
            onPress={adicionarAleatorio}
            disabled={carregando}
            accessibilityRole="button"
            accessibilityLabel="Adicionar Pokémon aleatório"
          >
            <MaterialCommunityIcons name="dice-5" size={24} color={cores.branco} />
          </BotaoQuadrado>
        </Formulario>
        <Contador>
          {cards.length} {cards.length === 1 ? "card na coleção" : "cards na coleção"}
        </Contador>
      </Cabecalho>

      <FlatList
        data={cards}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        contentContainerStyle={{ paddingVertical: 8 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          pronto ? (
            <Vazio>
              <MaterialCommunityIcons name="cards-outline" size={64} color={cores.borda} />
              <TextoVazio>
                Nenhum card ainda. Digite o nome ou número de um Pokémon e toque em ADD, ou use o
                dado para sortear um.
              </TextoVazio>
            </Vazio>
          ) : (
            <ActivityIndicator style={{ marginTop: 40 }} color={cores.primaria} size="large" />
          )
        }
      />
    </Container>
  );
}
