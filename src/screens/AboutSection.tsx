import { View, Text, Modal, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

const AboutSection = ({showAbout}) => {
  const [closeThis, setCloseThis] =useState(false);
  useEffect(() => {
  }, [showAbout])
  
  const closeThisAboutModal=()=>{
    showAbout = false
  console.log("close this modal "+ showAbout)
  }
  
  return (
    <View style={{height:'100%', width:'100%', justifyContent:'space-evenly'}}>
     <View style={{height:'100%', width:'100%'}}>
      <TouchableOpacity onPress={()=>closeThisAboutModal()}>
<Text style = {{fontSize: 20, color:'red'}}>CLose this modal</Text>
      </TouchableOpacity>
      </View>
       <Modal visible={showAbout} transparent
       style={{height:'20%', width:'20%', marginTop:300 , alignSelf:'center'}}
       >
    <Text>About Section Text</Text>
    <View style={styles.modalView}>
    <View style={styles.mainView}>
      <TouchableOpacity onPress={()=>closeThisAboutModal()}>
<Text style = {{fontSize: 20, color:'red'}}>CLose this modal</Text>
      </TouchableOpacity>
{/* <ActivityIndicator size={'large'}/> */}
</View>
    </View>
  </Modal>
  
    </View>
 
  )
}
const styles = StyleSheet.create({
    modalView:{
        // width:Dimensions.get('window').width,
        // height:Dimensions.get('window').height,
        backgroundColor:'rgba(0,0,0,.6)',
        justifyContent:'center',
        alignItems:'center',

    },
    mainView:{
        width:100,
        height:100,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    }
});

export default AboutSection