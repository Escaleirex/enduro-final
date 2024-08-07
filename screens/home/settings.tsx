import {
  Alert,
  Image,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import { BoldText, RegularText } from "../../components/styled-text";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { showMessage } from "react-native-flash-message";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function Settings() {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  async function onShare() {
    try {
      const result = await Share.share({
        title: "enduro!",
        url: "https://google.pt",
        message:
          "enduro | a shared social calendar for you & your friends to stay connected.",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error);
    }
  }

  async function handleLogout() {
    setLoading(true);

    try {
      await signOut(auth);
      setUser({
        uid: "",
        email: "",
        username: "",
        avatar: "",
      });

      setIsLoggedIn(false);
      setLoading(false);
    } catch (e) {
      showMessage({
        message: "failed to log out!",
        type: "danger",
        icon: "danger",
      });
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 10, flex: 1, paddingHorizontal: 20 }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 10,
            paddingVertical: 15,
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Image
            style={{
              height: 50,
              width: 50,
              backgroundColor: "black",
              borderRadius: 25,
            }}
            source={{ uri: user.avatar }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <BoldText style={{ paddingVertical: 0 }}>
              {user?.username || user?.email}
            </BoldText>
            <RegularText
              style={{ paddingVertical: 0, fontSize: 11, color: "gray" }}
            >
              {user?.username && user?.email}
            </RegularText>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // navigate("profile");
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderWidth: 0.5,
                borderRadius: 20,
                borderColor: "#e3e3e3",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="pencil" color={"gray"} size={18} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(
              "do you want to log out?",
              "this will log you out of the current device but still retain your data in the cloud.",
              [
                { text: "no", onPress: () => {} },
                {
                  text: "yes",
                  onPress: async () => await handleLogout(),
                },
              ]
            )
          }
          style={{
            padding: 10,
            marginTop: 15,
            backgroundColor: "white",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderBottomColor: "#f3f3f3",
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="red" />
          <RegularText style={{ paddingHorizontal: 20, flex: 1 }}>
            log out
          </RegularText>
          <Ionicons name="chevron-forward" color="gray" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
