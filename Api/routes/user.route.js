const router = require("express").Router()
// const router = express.Router();

// const User = require('../models/user.model.js');

// const {getUsers, getUser, createUser, updateUser,deleteUser} = require('../controllers/user.controller.js');

router.get('/', (req,res)=>{
    res.send("hello user router")
})
// router.get('/',getUsers);

// router.get('/:id',getUser);

// router.post('/', createUser);

// router.put('/:id', updateUser);

// router.delete('/:id', deleteUser);

module.exports = router
