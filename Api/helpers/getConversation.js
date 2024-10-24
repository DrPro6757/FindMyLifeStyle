const {ConversationModel} = require('../models/Conversation.model.js')

const getConversation =async(currentUserId)=>{
    if (currentUserId){
        console.log('current user', currentUserId)

        const currentUserConversation  = await ConversationModel.find({
            "$or":[
                {sender:currentUserId},
                {receiver:currentUserId}
            ]
        }).sort({updatedAt : -1}).populate('messages').populate('sender').populate('receiver')
        const conversation = currentUserConversation.map((convo)=>{
            const countUnseenMsg = convo.messages.reduce((preve, curr) => {
                const msgByUserId = curr?.msgByUserId.toString()

                if( msgByUserId !== currentUserId){
                    return preve+(curr.seen?0:1)

                }else{
                    return preve
                }
            },0)
            return{
                _id : convo?._id,
                sender : convo?.sender,
                receiver : convo?.receiver,
                unseenMsg : countUnseenMsg,
                lastMsg : convo.messages[convo?.messages?.length - 1]
        }
        })
        return conversation
    }else{
        return []
    }
}
module.exports = getConversation
