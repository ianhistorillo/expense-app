import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import ManageExpenses from "./screens/ManageExpenses";
import ManageIncome from "./screens/ManageIncome";
import ManageWallet from "./screens/ManageWallet";
import RecentExpenses from "./screens/RecentExpenses";
import HomeDashboard from "./screens/HomeDashboard";
import AllExpenses from "./screens/AllExpenses";
import AllIncome from "./screens/AllIncome";
import { GlobalStyles } from "./constants/styles";
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";
import WalletContextProvider from "./store/wallet-context";

import { init } from "./util/database";
import UserWallets from "./screens/UserWallets";
import IncomeContextProvider from "./store/income-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Prevent the splash screen from auto-hiding

    init().then(() => {
      setDbInitialized(true);
      // Hide the splash screen once the data is ready
    });
  }, []);

  if (!dbInitialized) {
    return null; // Show nothing while the database is being initialized
  }

  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary10 },
        headerTintColor: "black",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.white },
        tabBarActiveTintColor: GlobalStyles.colors.primary200,
      })}
    >
      <BottomTabs.Screen
        name="HomeDashboard"
        component={HomeDashboard}
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="UserWallets"
        component={UserWallets}
        options={{
          title: "Your Wallets",
          tabBarLabel: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
          headerRight: () => {
            const navigation = useNavigation();
            return (
              <IconButton
                icon="add"
                size={24}
                color={GlobalStyles.colors.black}
                onPress={() => {
                  navigation.navigate("ManageWallet");
                }}
              />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerRight: () => {
            const navigation = useNavigation();
            return (
              <IconButton
                icon="add"
                size={24}
                color={GlobalStyles.colors.black}
                onPress={() => {
                  navigation.navigate("ManageExpenses");
                }}
              />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="AllIncome"
        component={AllIncome}
        options={{
          title: "All Income",
          tabBarLabel: "All Income",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
          headerRight: () => {
            const navigation = useNavigation();
            return (
              <IconButton
                icon="add"
                size={24}
                color={GlobalStyles.colors.black}
                onPress={() => {
                  navigation.navigate("ManageIncome");
                }}
              />
            );
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <React.Fragment>
      <StatusBar style="light" />
      <WalletContextProvider>
        <IncomeContextProvider>
          <ExpensesContextProvider>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: GlobalStyles.colors.white,
                  },
                  headerTintColor: "white",
                }}
              >
                <Stack.Screen
                  name="ExpensesOverview"
                  component={ExpensesOverview}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ManageWallet"
                  component={ManageWallet}
                  options={{
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="ManageExpenses"
                  component={ManageExpenses}
                  options={{
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="ManageIncome"
                  component={ManageIncome}
                  options={{
                    presentation: "modal",
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ExpensesContextProvider>
        </IncomeContextProvider>
      </WalletContextProvider>
    </React.Fragment>
  );
}
