import { StyleSheet, Text, View, TouchableOpacity
,KeyboardAvoidingView, Platform, TextInput,
ActivityIndicator
} from 'react-native'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import env from '../../../Env'

export default function Home(props) {

  const [car, setCar]= useState("")
  const [model,setModel]=useState("")
  const [currentFuel,setCurrentFuel]=useState("")
  const[requesting, setRequesting]=useState(false)

  const allowed= (car,model)=>{
    if (car && currentFuel && model.length==4){
        var x = parseInt(model)
      if (x>=2000 && x<=2023){ return true }; return false
    }
    else{
      return false
    }
  }

  const handleBtnClick= async ()=>{

    setRequesting(true)
    var x =await axios.post(`${env.url}/get-answer`,{car:car,model:model}).then(response=>{
      console.log(response.data)
      return response.data
    })
    if(x.fuel && x.fuelper100km && x.fuelcapacity && parseFloat(currentFuel)<=x.fuelcapacity){
      props.navigation.push('Details',{car:car,model:model, currentFuel:parseFloat(currentFuel), fuel:x.fuel,fuelper100km:x.fuelper100km, fuelcapacity:x.fuelcapacity})
    }
    else{
      setCar("")
      setModel("")
      setCurrentFuel("")
    }
    setRequesting(false)
  }
  return (

    
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS ==='ios'?'padding':'height'}>
      {
        <>
      <TextInput 
      placeholder='Car Model'
       style={styles.inputs} 
       value={car}
       editable={!requesting}
       onChangeText={(car)=>{
        setCar(car)
        }}></TextInput>
      <TextInput keyboardType='numeric' 
      placeholder="Model year" 
      style={styles.inputs}
      onChangeText={(model)=>{
        setModel(model)
        }}
      value={model}
      editable={!requesting}></TextInput>
      <TextInput keyboardType='numeric' 
      placeholder="Current fuel in L/kWh" 
      style={styles.inputs}
      onChangeText={(currentFuel)=>{
        currentFuel.length<=4?setCurrentFuel(currentFuel):null
        }}
      value={currentFuel}
      editable={!requesting}></TextInput>
      
      <TouchableOpacity 
      style={[styles.beginButton, allowed(car,model)&&!requesting?styles.activate:styles.deactivate]} 
      onPress={allowed(car,model)&&!requesting?handleBtnClick:null}>
        <Text style={styles.beginButtonText}>{"Plan Journey"}</Text>
      </TouchableOpacity>
      {!requesting
      ?<>
      <Text style={allowed(car,model)?{fontSize:15,opacity:0}:{fontSize:15, opacity:0.4}
      }>Enter Valid Model, Year and Fuel Capacity</Text>
      <Text></Text>
      </>
      :<>
      <ActivityIndicator size='small' color="#21005D"></ActivityIndicator>
      <Text style={{fontSize:15, opacity:0.4}}>ChatGPT At Wrok</Text>
      </>
      }
      </>
      
}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F6EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },
  
  beginButton: {
    paddingHorizontal:60,
    paddingVertical:25,
    borderRadius:20,
    backgroundColor: '#21005D',
    marginBottom:10
  },
  beginButtonText:{
      fontFamily:"Roboto",
      color: 'white',
      fontSize: 32,
      fontWeight: 900,
      
  },
  deactivate:{
    backgroundColor: '#BEBEBE'
  },
  activate:{
    backgroundColor: "#21005D"
  },
  inputs:{
     fontFamily:"Roboto",
     borderColor:"#21005D",
     borderWidth:2,
     borderRadius:20,
     paddingVertical:10,
     paddingHorizontal:10,
     width:"100%",
     fontSize:20,
     justifyContent:"center",
     alignItems: "center",
     marginBottom:60,
     backgroundColor:"white"
  }

})