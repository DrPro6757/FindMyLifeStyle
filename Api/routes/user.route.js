// const router = require("express").Router()
const router = require('express').Router();
// const { createUser } = require('../controllers/user.controller.js');
const {
  RegisterUser,
  LoginUser,
  UserDetail,
  Logout,
  UpdateUser,
  SaveEmailWithOTP,
  LoginUserWithOTP,
  getMyDataApi,
} = require('../controllers/user.controller');
const {validateUser, validate} = require('../middleware/validator');

// const User = require('../models/user.model.js')

// const router = express.Router();

// const User = require('../models/user.model.js');

// const {getUsers, getUser, createUser, updateUser,deleteUser} = require('../controllers/user.controller.js');

router.get('/', (req, res) => {
  res.send('hello user router');
});

//later
// router.post('/register',validateUser, validate, RegisterUser);

router.post('/saveOTP', SaveEmailWithOTP);

router.post('/register', RegisterUser);

//'/api/users/login'
router.post('/login', LoginUser);
router.get('/mydata/:id', getMyDataApi);

router.get('/userdetails/token', UserDetail);

router.get('/logout', Logout);
router.post('/loginwithotp', LoginUserWithOTP);

// router.put('update/:id', UpdateUser);

// router.get('/',getUsers);

// router.get('/:id',getUser);

// router.post('/', createUser);

// router.put('/:id', updateUser);

// router.delete('/:id', deleteUser);

module.exports = router;
