import React from "react";
import styled from "styled-components/native";

import { corDoTipo, nomeDoTipo } from "../theme";

const Selo = styled.View`
  background-color: ${(p) => p.$cor};
  border-width: 1.5px;
  border-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  padding: ${(p) => (p.$grande ? "5px 14px" : "3px 10px")};
  margin-right: 6px;
  margin-top: 4px;
`;

const Nome = styled.Text`
  color: #fff;
  font-size: ${(p) => (p.$grande ? "14px" : "11px")};
  font-weight: bold;
`;

export default function TipoBadge({ tipo, grande = false }) {
  return (
    <Selo $cor={corDoTipo(tipo)} $grande={grande}>
      <Nome $grande={grande}>{nomeDoTipo(tipo)}</Nome>
    </Selo>
  );
}
