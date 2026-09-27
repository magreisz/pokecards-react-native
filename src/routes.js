import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Cards from "./pages/Cards";
import Detalhes from "./pages/Detalhes";
import { cores } from "./theme";

const Stack = createStackNavigator();

const cabecalho = {
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.branco,
  headerTitleStyle: { fontWeight: "bold" },
  cardStyle: { flex: 1 },
};

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={cabecalho}>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "LOGIN", headerLeft: () => null }}
      />
      <Stack.Screen
        name="cadastro"
        component={Cadastro}
        options={{ title: "CADASTRAR USUÁRIO" }}
      />
      <Stack.Screen
        name="cards"
        component={Cards}
        options={{ title: "POKÉCARDS", headerLeft: () => null, gestureEnabled: false }}
      />
      <Stack.Screen
        name="detalhes"
        component={Detalhes}
        options={{ title: "DETALHES" }}
      />
    </Stack.Navigator>
  );
}
