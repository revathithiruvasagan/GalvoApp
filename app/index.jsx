import { StyleSheet, Text, View ,Image, Button} from 'react-native'
import React from 'react'
import logo from "../assets/images/logo.png"
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const index = () => {

  
  return (
    <View style={styles.container} >
      <View style={styles.inContainer}>
      <Image source={logo}></Image>
      <View style={styles.bottom}>
      <CustomButton title="CUBIT" onPress={()=>{router.push('/Excel')}} />
      <Text style={styles.txt}> Measurement as Precise !</Text>
      </View>
      
      </View>
      
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container:{
   
    display:"flex",
    justifyContent:"space-between",
   
    alignItems:"center",
    backgroundColor:"#181A20",
    height:'100%',
    width:'100%'


  },
  inContainer:{
    marginTop:'50%',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:'40%',
    height:'70%'

  },
  txt:{
    color:"white",
    fontWeight:"bold",
    fontSize:15,
  },
  bottom:{
    display:'flex',
    alignItems:'center'

  }
 
})