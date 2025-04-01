import { FlatList } from "react-native";

import IncomeItem from "./IncomeItem";
import { getFormattedDate } from "../../util/date";

function renderIncomeItem(itemData) {
  return <IncomeItem {...itemData.item} />;
}

function IncomeList({ income }) {
  // Convert array of arrays into an array of objects

  return (
    <FlatList
      data={income}
      renderItem={renderIncomeItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default IncomeList;
