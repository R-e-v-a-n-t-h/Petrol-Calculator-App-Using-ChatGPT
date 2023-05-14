import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import axios from'axios'

export default function Loading(props) {

  useEffect(()=>{
    getData()
    props.navigation.replace("Home")
  })

  const getData= async ()=>{
    var car = props.navigation.state.params.car
    var model = props.navigation.state.params.model
    await axios.post
    
  }

  return (
    <>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#21005D"/>
        <Text style={{fontSize:15, opacity:0.3}}>ChatGPT at Work</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  }
})