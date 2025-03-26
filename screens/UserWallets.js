import { useContext, useEffect, useState } from "react";

import WalletsOutput from "../components/Wallet/WalletsOutput";
import { WalletContext } from "../store/wallet-context";
import { getFormattedDate } from "../util/date";
import { getDateMinusDays } from "../util/date";
import { fetchWallet } from "../util/http";
import { Alert } from "react-native";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function UserWallets() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const walletCtx = useContext(WalletContext);

  useEffect(() => {
    async function getWallets() {
      setIsFetching(true);
      try {
        const wallets = await fetchWallet();
        walletCtx.setWallet(wallets);
      } catch (error) {
        setError("Could not fetch wallets!");
      }
      setIsFetching(false);
    }

    getWallets();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <WalletsOutput
      wallets={walletCtx.wallets}
      // expensesPeriod="Last 7 Days"
      // fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default UserWallets;
