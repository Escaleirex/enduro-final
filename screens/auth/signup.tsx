import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import useDimensions from "../../hooks/useDimensions";
import {
  BoldText,
  HeadingText,
  SubHeadingText,
} from "../../components/styled-text";
import { Input, PwdInput } from "../../components/ui/input";
import { PrimaryButton } from "../../components/ui/button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  validateEmail,
  validateMatchPassword,
  validatePassword,
} from "../../utils/validateInput";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { navigate }: NavigationProp<AuthStackParamList> = useNavigation();
  const { screenWidth, screenHeight } = useDimensions();

  async function selectImageFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleSignup() {
    if (!username || !email || !password || !confirmPassword) {
      showMessage({
        message: "please fill in all fields!",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (!validateEmail(email)) {
      showMessage({
        message: "make sure your email is in the right format!",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (!validatePassword(password)) {
      showMessage({
        message: "your password is less than 8 characters!",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (!validateMatchPassword(password, confirmPassword)) {
      showMessage({
        message: "your passwords do not match!",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    await createAccount();
  }

  async function createAccount() {
    setLoading(true);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('uid:', credentials.user.uid)
      await addUserToDb(credentials.user.uid);
      showMessage({
        message: "account created successfully!",
        type: "success",
        icon: "success",
      });
      navigate("login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage({
          message: "user already exists, go to login!",
          type: "danger",
          icon: "danger",
        });
      } else {
        showMessage({
          message: "failed to create account!",
          type: "danger",
          icon: "danger",
        });
      }
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setImage(null);
    }
  }

  async function addUserToDb(uid: string) {
    try {
      const docD = doc(db, "users", uid)
      await setDoc(docD, {
        email: email.trim(),
        username: username,
        avatar: image,
      });
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
      // Handle error appropriately (e.g., show error message to the user)
    }
  }  

  return (
    <ScrollView
      style={{
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 32,
      }}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        <HeadingText style={{ color: "aqua" }}>
          hey there, welcome to enduro
        </HeadingText>
        <SubHeadingText onPress={() => navigate("login")}>
          already have an account? login
        </SubHeadingText>

        <View style={{ marginTop: 32, gap: 16 }}>
          <Input
            placeholder="create a unique username"
            onChangeText={(e) => setUsername(e)}
            value={username}
          />
          <Input
            placeholder="email address"
            onChangeText={(e) => setEmail(e)}
            value={email}
          />
          <PwdInput
            placeholder="password"
            onChangeText={(e) => setPassword(e)}
            value={password}
          />
          <PwdInput
            placeholder="confirm password"
            onChangeText={(e) => setConfirmPassword(e)}
            value={confirmPassword}
          />
          <View
            style={{
              gap: 16,
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TouchableOpacity
              onPress={selectImageFromGallery}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#d3d3d3",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="ios-person-outline" size={20} color={"#000"} />
              )}
            </TouchableOpacity>
            {image ? (
              <BoldText>upload a new avatar</BoldText>
            ) : (
              <BoldText>upload an avatar</BoldText>
            )}
          </View>
        </View>
      </View>

      <PrimaryButton
        title={loading ? <ActivityIndicator color={"#fff"} /> : "sign up"}
        onPress={handleSignup}
      />
    </ScrollView>
  );
}
