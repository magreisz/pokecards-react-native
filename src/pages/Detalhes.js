import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Botao from "../components/Botao";
import TipoBadge from "../components/TipoBadge";
import { buscarDetalhes, imagemOficial } from "../services/api";
import {
  cores,
  corDoTipo,
  formatarNome,
  formatarNumero,
  habitats,
  nomesStats,
} from "../theme";

const STAT_MAXIMO = 255;

const Centro = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: ${cores.fundo};
`;

const TextoCentro = styled.Text`
  color: ${cores.textoSuave};
  font-size: 15px;
  text-align: center;
  margin: 12px 0;
`;

const Topo = styled.View`
  align-items: center;
  padding: 16px 16px 48px;
  background-color: ${(p) => p.$cor};
`;

const Numero = styled.Text`
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  font-weight: bold;
`;

const Nome = styled.Text`
  color: ${cores.branco};
  font-size: 30px;
  font-weight: bold;
  text-align: center;
`;

const Categoria = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-top: 2px;
`;

const LinhaTipos = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 6px;
`;

const Imagem = styled.Image`
  width: 220px;
  height: 220px;
  margin-top: 8px;
`;

const Alternar = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 6px 12px;
`;

const TextoAlternar = styled.Text`
  color: ${cores.branco};
  font-weight: bold;
  margin-left: 6px;
`;

const Painel = styled.View`
  margin: -32px 16px 16px;
  background-color: ${cores.branco};
  border-radius: 20px;
  padding: 18px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
`;

const Secao = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${cores.escuro};
  margin: 18px 0 10px;
`;

const Descricao = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${cores.texto};
`;

const Grade = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Celula = styled.View`
  width: 48%;
  background-color: ${cores.fundo};
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 8px;
`;

const RotuloCelula = styled.Text`
  font-size: 11px;
  color: ${cores.textoSuave};
  text-transform: uppercase;
`;

const ValorCelula = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${cores.escuro};
  margin-top: 2px;
`;

const LinhaStat = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const NomeStat = styled.Text`
  width: 84px;
  font-size: 13px;
  color: ${cores.textoSuave};
`;

const ValorStat = styled.Text`
  width: 36px;
  font-size: 14px;
  font-weight: bold;
  color: ${cores.escuro};
  text-align: right;
  margin-right: 8px;
`;

const Trilho = styled.View`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background-color: #eceef1;
  overflow: hidden;
`;

const Preenchimento = styled.View`
  height: 8px;
  border-radius: 4px;
  width: ${(p) => p.$porcentagem}%;
  background-color: ${(p) => p.$cor};
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Chip = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${cores.fundo};
  border-radius: 14px;
  padding: 6px 12px;
  margin: 0 6px 6px 0;
`;

const TextoChip = styled.Text`
  font-size: 13px;
  color: ${cores.texto};
`;

const Evolucoes = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Evolucao = styled.TouchableOpacity`
  align-items: center;
  width: 96px;
  padding: 6px;
  margin: 4px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(p) => (p.$atual ? p.$cor : "transparent")};
`;

const ImagemEvolucao = styled.Image`
  width: 72px;
  height: 72px;
`;

const NomeEvolucao = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${cores.texto};
  text-align: center;
`;

function Info({ rotulo, valor }) {
  return (
    <Celula>
      <RotuloCelula>{rotulo}</RotuloCelula>
      <ValorCelula>{valor}</ValorCelula>
    </Celula>
  );
}

export default function Detalhes() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);
  const [shiny, setShiny] = useState(false);

  const carregar = useCallback(async () => {
    setErro(false);
    setDados(null);
    try {
      setDados(await buscarDetalhes(params.id));
    } catch {
      setErro(true);
    }
  }, [params.id]);

  useEffect(() => {
    navigation.setOptions({ title: formatarNome(params.nome || "Detalhes") });
    carregar();
  }, [carregar, navigation, params.nome]);

  if (erro) {
    return (
      <Centro>
        <MaterialIcons name="wifi-off" size={56} color={cores.textoSuave} />
        <TextoCentro>Não foi possível carregar os detalhes. Verifique a internet.</TextoCentro>
        <Botao titulo="Tentar novamente" icone="refresh" onPress={carregar} />
      </Centro>
    );
  }

  if (!dados) {
    return (
      <Centro>
        <ActivityIndicator size="large" color={cores.primaria} />
        <TextoCentro>Buscando informações na PokéAPI...</TextoCentro>
      </Centro>
    );
  }

  const corPrincipal = corDoTipo(dados.tipos[0]);
  const especial = dados.mitico ? "Mítico" : dados.lendario ? "Lendário" : "Comum";
  const total = dados.stats.reduce((soma, item) => soma + item.valor, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <Topo $cor={corPrincipal}>
        <Numero>{formatarNumero(dados.id)}</Numero>
        <Nome>{formatarNome(dados.nome)}</Nome>
        {dados.categoria ? <Categoria>{dados.categoria}</Categoria> : null}
        <LinhaTipos>
          {dados.tipos.map((tipo) => (
            <TipoBadge key={tipo} tipo={tipo} grande />
          ))}
        </LinhaTipos>
        <Imagem
          source={{ uri: shiny && dados.imagemShiny ? dados.imagemShiny : dados.imagem }}
          resizeMode="contain"
        />
        {dados.imagemShiny ? (
          <Alternar onPress={() => setShiny(!shiny)} accessibilityRole="button">
            <MaterialIcons name="auto-awesome" size={16} color={cores.branco} />
            <TextoAlternar>{shiny ? "Ver versão normal" : "Ver versão shiny"}</TextoAlternar>
          </Alternar>
        ) : null}
      </Topo>

      <Painel>
        {dados.descricao ? (
          <>
            <Secao style={{ marginTop: 0 }}>Descrição</Secao>
            <Descricao>{dados.descricao}</Descricao>
          </>
        ) : null}

        <Secao>Informações</Secao>
        <Grade>
          <Info rotulo="Altura" valor={`${dados.altura} m`} />
          <Info rotulo="Peso" valor={`${dados.peso} kg`} />
          <Info rotulo="Experiência base" valor={dados.experiencia ?? "N/D"} />
          <Info rotulo="Taxa de captura" valor={dados.taxaCaptura} />
          <Info
            rotulo="Habitat"
            valor={dados.habitat ? habitats[dados.habitat] || formatarNome(dados.habitat) : "N/D"}
          />
          <Info
            rotulo="Geração"
            valor={dados.geracao ? dados.geracao.replace("generation-", "").toUpperCase() : "N/D"}
          />
          <Info rotulo="Raridade" valor={especial} />
          <Info rotulo="Total de status" valor={total} />
        </Grade>

        <Secao>Status base</Secao>
        {dados.stats.map((item) => (
          <LinhaStat key={item.nome}>
            <NomeStat>{nomesStats[item.nome] || item.nome}</NomeStat>
            <ValorStat>{item.valor}</ValorStat>
            <Trilho>
              <Preenchimento
                $cor={corPrincipal}
                $porcentagem={Math.min(100, Math.round((item.valor / STAT_MAXIMO) * 100))}
              />
            </Trilho>
          </LinhaStat>
        ))}

        <Secao>Habilidades</Secao>
        <Chips>
          {dados.habilidades.map((item) => (
            <Chip key={item.nome}>
              <TextoChip>{formatarNome(item.nome)}</TextoChip>
              {item.oculta ? (
                <MaterialIcons
                  name="visibility-off"
                  size={14}
                  color={cores.textoSuave}
                  style={{ marginLeft: 6 }}
                />
              ) : null}
            </Chip>
          ))}
        </Chips>

        {dados.evolucoes.length > 1 ? (
          <>
            <Secao>Linha evolutiva</Secao>
            <Evolucoes>
              {dados.evolucoes.map((item) => (
                <Evolucao
                  key={item.id}
                  $atual={item.nome === dados.nome}
                  $cor={corPrincipal}
                  disabled={item.nome === dados.nome}
                  onPress={() => navigation.push("detalhes", { id: item.id, nome: item.nome })}
                >
                  <ImagemEvolucao source={{ uri: imagemOficial(item.id) }} resizeMode="contain" />
                  <NomeEvolucao numberOfLines={1}>{formatarNome(item.nome)}</NomeEvolucao>
                </Evolucao>
              ))}
            </Evolucoes>
          </>
        ) : null}

        {dados.golpes.length ? (
          <>
            <Secao>Alguns golpes</Secao>
            <Chips>
              {dados.golpes.map((golpe) => (
                <Chip key={golpe}>
                  <TextoChip>{formatarNome(golpe)}</TextoChip>
                </Chip>
              ))}
            </Chips>
          </>
        ) : null}
      </Painel>
    </ScrollView>
  );
}
