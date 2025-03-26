import { createContext, useReducer } from "react";
import { fetchListOfWallets } from "../util/database";

export const WalletContext = createContext({
  wallets: [],
  addWallet: ({
    name,
    type,
    budget,
    startCutoff,
    endCutoff,
    showToDashboard,
  }) => {},
  setWallet: (wallets) => {},
  deleteWallet: (id) => {},
  updateWallet: (
    id,
    { name, type, budget, startCutoff, endCutoff, showToDashboard }
  ) => {},
});

function walletReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableWalletIndex = state.findIndex(
        (wallet) => wallet.id === action.payload.id
      );
      const updatableWallet = state[updatableWalletIndex];
      const updatedItem = { ...updatableWallet, ...action.payload.data };
      const updatedWallet = [...state];
      updatedWallet[updatableWalletIndex] = updatedItem;
      return updatedWallet;
    case "DELETE":
      return state.filter((wallet) => wallet.id !== action.payload);
    default:
      return state;
  }
}

function WalletContextProvider({ children }) {
  const [walletState, dispatch] = useReducer(walletReducer, []);

  function addWallet(walletData) {
    dispatch({ type: "ADD", payload: walletData });
  }

  function setWallet(wallets) {
    dispatch({ type: "SET", payload: wallets });
  }

  function deleteWallet(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateWallet(id, walletData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: walletData } });
  }

  const value = {
    wallets: walletState,
    setWallet: setWallet,
    addWallet: addWallet,
    deleteWallet: deleteWallet,
    updateWallet: updateWallet,
    dispatch,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export default WalletContextProvider;
