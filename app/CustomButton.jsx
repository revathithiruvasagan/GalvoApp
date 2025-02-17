import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}> 
           <View style={styles.buttonContainer}>
      <Text style = {styles.buttonText}>{title}</Text>
    </View>
    </TouchableOpacity>

  )
}

export default CustomButton

const styles = StyleSheet.create({
    buttonContainer:{
        width:100,
        height:60,
        marginBottom:10,
        borderRadius:12,
        
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#f4247c"


    },
    buttonText:{
        color:"white",
        fontWeight:"bold",
        fontSize:20
    }
})