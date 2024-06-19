import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const OptionsModal = ({visible, onUpdate, onClose, onDelete}) => {
  return (
    <Modal 
    visible={visible}
    transparent={true}
    onRequestClose={()=>onClose()}
    >
        <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
        onPress={()=>onClose()}
            style={{
                height:'70%',
                width:'100%',
            }}
            >

            </TouchableOpacity>
            <View style={{
                height:'30%',
                width:'100%',
                bottom:0,
                position:'absolute',
                backgroundColor:'#0e0e0e',
                justifyContent:'center',
                alignItems:'center',
                borderTopWidth:1,
                borderTopColor:'#5e5e5e'
            }}>
                <TouchableOpacity 
                style ={{height:50, width:'50%', margin:10, borderWidth:1, borderColor:'white', borderRadius:10}}
                onPress={()=>onUpdate()}
                >
                    <View style={{flexDirection:'row', height:'100%', width:'100%', justifyContent:'center', alignItems:'center', }}>
                    <Text style={{color:'white', fontSize:25, marginRight:10}}>Update</Text>
                    <Image source={require('../Images/edit.png')} 
                    style={{height:30,width:30, tintColor:'white'}}
                    />
                    </View>
                    
                </TouchableOpacity>
                <TouchableOpacity 
                style ={{height:50, width:'50%', margin:10, borderWidth:1, borderColor:'white', borderRadius:10}}
                onPress={()=>onDelete()}
                >
                    <View style={{flexDirection:'row', height:'100%', width:'100%', justifyContent:'center', alignItems:'center', }}>
                    <Text style={{color:'white', fontSize:25, marginRight:10}}>delete</Text>
                    <Image source={require('../Images/delete.png')} 
                    style={{height:30,width:30, tintColor:'white'}}
                    />
                    </View>
                    
                </TouchableOpacity>

            </View>
        </View>
    </Modal>
  )
}

export default OptionsModal