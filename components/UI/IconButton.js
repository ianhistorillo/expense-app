import { Pressable, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ icon, type, color, size, onPress }) {
  if (type === "dashboardIcon") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.dashboardButtonContainer}>
          <Ionicons name={icon} size={size} color={color} />
        </View>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.buttonContainer}>
          <Ionicons name={icon} size={size} color={color} />
        </View>
      </Pressable>
    );
  }
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  dashboardButtonContainer: {
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 30,
    padding: 14,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
