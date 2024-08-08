// const router = require("express").Router()
const router = require("express").Router();
// const { createUser } = require('../controllers/user.controller.js');
const {RegisterUser, LoginUser, UserData} = require('../controllers/user.controller');
const { validateUser, validate } = require("../middleware/validator");


// const User = require('../models/user.model.js')

// const router = express.Router();

// const User = require('../models/user.model.js');

// const {getUsers, getUser, createUser, updateUser,deleteUser} = require('../controllers/user.controller.js');

router.get('/', (req,res)=>{
    res.send("hello user router")
})

router.post('/register',validateUser, validate, RegisterUser);

//'/api/users/login'
router.post('/login',LoginUser);

router.post('/data', UserData);
// router.get('/',getUsers);

// router.get('/:id',getUser);

// router.post('/', createUser);

// router.put('/:id', updateUser);

// router.delete('/:id', deleteUser);

module.exports = router
