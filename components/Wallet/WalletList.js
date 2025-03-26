import { FlatList } from "react-native";

import WalletItem from "./WalletItem";

function renderWalletItem(itemData) {
  return <WalletItem {...itemData.item} />;
}

function WalletList({ wallets }) {
  // Convert array of arrays into an array of objects

  return (
    <FlatList
      data={wallets}
      renderItem={renderWalletItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default WalletList;
