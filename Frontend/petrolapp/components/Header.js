import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function Header(props) {
  return (
     
    <Text style={styles.headerText}>{props.title}</Text>
      
  )
}

const styles = StyleSheet.create({
  headerText:{
        fontFamily: 'Roboto',
        fontSize:20,
        color: "#181818",
        fontWeight: 'bold',
        lineHeight: 32,
        
    },
    // container:{
    //   backgroundColor:"#D0BCFF"
    // }
})