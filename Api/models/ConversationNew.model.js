const mongoose = require('mongoose');

const ConversationNewSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MessageUsers',
    },
  ],
});

const ConversationSchemaModel = mongoose.model(
  'ConversationUser',
  ConversationNewSchema,
);

module.exports = ConversationSchemaModel;
