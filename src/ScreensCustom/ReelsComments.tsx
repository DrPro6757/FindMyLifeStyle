import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, Image, Keyboard, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BASE_URL, DELETE_USER_POST_COMMENT, Get_USER_POST_COMMENTS, USER_POST_COMMENT } from '../Utils/Strings';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import Loader from '../screens/Loader';
import OptionsModal from './OptionsModal';

const ReelsComments = () => {
    const route = useRoute()
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([])
    const [openOptionsModal, setOpenOptionsModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState('')
    const [selectedCommentData, setSelectedCommentData] = useState('')
    const [updatedComment, setUpdatedComment]=useState('');


    const [updateModal, setUpdateModal] = useState(false)

    useEffect(() => {
        GetAllComments()
    }, [])

    const GetAllComments = () => {
        axios.get(BASE_URL + Get_USER_POST_COMMENTS+ route.params.id)
            .then((res) => {
                console.log('All Comments ', res.data);
                setCommentList(res.data)
            })
            .catch((error) => {
                console.log('Event Post Comment Failed ', error)
            })
    }
    const deleteComment = () => {

        axios.delete(BASE_URL + DELETE_USER_POST_COMMENT + selectedCommentId)
            .then((res) => {
                console.log('Event Post Comment Deleted Successfully')
                setOpenOptionsModal(false)
                GetAllComments()
            })
            .catch((error) => {
                setOpenOptionsModal(false)
                console.log('Event Post Comment Failed ', error)
            })

    }
    const PostComment = () => {
        const userPostData = {
            username: "last user",
            userId: "6639fcc4e42506e0b5c65f0e",
            postId: route.params.id,
            comment: comment,
        }
        axios.post(BASE_URL + USER_POST_COMMENT, userPostData)
            .then((res) => {
                Alert.alert("Your comment has been posted successfully")
                console.log(res);
                setComment('')
                Keyboard.dismiss()
                GetAllComments()
            })
            .catch((error) => {
                console.log('Event Post Comment Failed ', error)
            })
    }
    const timeDiffernce = (previous) => {
        const current = new Date();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerWeek = msPerDay * 7;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;
        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }
        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }
        //later
        else if (elapsed < msPerWeek) {
            return Math.round(elapsed / msPerDay) + ' week ago';
        }
        //
        else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        }
        else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }


    const updateComment = () => {
        setUpdateModal(false)
    }

    return (
        <View style={styles.conatiner}>
            <OptionsModal visible={openOptionsModal}
                onUpdate={() => {
                    setOpenOptionsModal(false)
                    setUpdateModal(true)
                    // if(x==2){
                    //     deleteComment(selectedCommentId)
                    // }
                }}
                onDelete={() => {
                    deleteComment()
                }}
                onClose={() => { setOpenOptionsModal(false) }}
            />
            <FlatList data={commentList}
                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.commentsBackground}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            width: 45, height: 45, borderRadius: 22,
                                            backgroundColor: 'black', justifyContent: 'center', alignItems: 'center',
                                            marginLeft: 10, marginTop: 5
                                        }}>
                                        <Image source={require('../Images/user.png')}
                                            style={{ width: 30, height: 30, tintColor: 'white' }} />
                                    </View>
                                    <View>
                                        <Text style={{ marginTop: 15, marginLeft: 5, color: 'black', fontWeight: '500', fontSize: 16 }}>{item.username}</Text>
                                        <Text style={{ marginTop: 3, fontSize: 12, color: 'black' }}>
                                            {timeDiffernce(new Date(item.createdAt))}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={{ margin: 10 }}
                                    onPress={() => [setOpenOptionsModal(true), setSelectedCommentData(item.comment),setSelectedCommentId(item._id)]} //deleteComment(item._id)
                                >
                                    <Image source={require('../Images/list.png')}
                                        style={{ height: 20, width: 20, tintColor: '#1e1e1e' }}
                                    />
                                </TouchableOpacity>
                            </View>


                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '500', marginLeft: 12, marginTop: 10 }}>{item.comment}</Text>
                        </View>
                    )
                }}
            />
            <View style={styles.bottomView}>
                <TextInput
                    value={comment}
                    onChangeText={(txt) => setComment(txt)}
                    placeholder='Type comment here ...'
                    style={styles.input} />
                <TouchableOpacity
                    disabled={comment == '' ? true : false}
                    style={[styles.postBtn, { backgroundColor: comment == '' ? 'grey' : 'blue' }]}
                    onPress={() => PostComment()}
                >
                    <Text style={styles.btnText}>Comment</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={updateModal}
                transparent={true}
            >
                <View style={styles.updateModalMainContainer}>
                    <View style={styles.updateModalInnerContainer}>
                        <TextInput 
                        placeholder='Enter comment here'
                        value={selectedCommentData}
                        onChangeText={(txt)=>setUpdatedComment(txt)}
                        style={{ width: '80%', height: 70, borderWidth: 1, borderRadius: 10, padding: 5 }}
                        />
                        <View style={{ justifyContent: 'space-between', margin:10,flexDirection:'row'}}>
                            <TouchableOpacity 
                            style={styles.ModalBtnStyle}
                            onPress={()=>setUpdateModal(false)}
                            >
                                <Text style={{ color: 'white', fontSize: 20 }}>Cancle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={styles.ModalBtnStyle}
                            onPress={()=>updateComment()}
                            >
                                <Text style={{ color: 'white', fontSize: 20 }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>

                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    bottomView: {
        width: '100%',
        height: 70,
        backgroundColor: 'white',
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10

    },
    input: {
        width: '70%',
        height: '100%'
    },
    postBtn: {
        width: '20%',
        height: '60%',
        borderRadius: 10,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff'
    },
    commentsBackground: {
        height: 120,
        width: '90%',
        backgroundColor: 'white',
        alignSelf: 'center',
        marginVertical: 10
    },
    updateModalMainContainer: {
        height: '100%', width: '100%', justifyContent: 'center',
        alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
    },
    ModalBtnStyle: {
        height: 40,
        width: 100,
        borderWidth: 1,
        borderRadius: 10,
        margin:20,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e'
    },
    updateModalInnerContainer: {
        height: '50%', width: '90%', borderRadius: 10, backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center'
    }
})

export default ReelsComments



