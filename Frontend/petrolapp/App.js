import React, {useState} from 'react';
import { StyleSheet} from 'react-native';
import env from "./Env"
import {AppLoading} from "expo"
import Navigator from "./routes/homeStack"
import { useFonts } from 'expo-font';
import { View, ScrollView, SafeAreaView } from "react-native";

export default function App() {
  const [loaded] = useFonts({
    "Roboto": require('./assets/fonts/Roboto-Regular.ttf')
  });


  if (!loaded) {
    return null;
  }

    return(
      <Navigator/>
    )
}


