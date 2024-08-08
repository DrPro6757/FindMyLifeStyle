const {check, validationResult} = require("express-validator")

exports.validateUser = [
check('name')
.trim()
.not()
.isEmpty()
.withMessage('Please Check Your Name')
.isLength({min:3, max:30})
.withMessage('Name Must Be 3 to 30 Characters Long!'),
check('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
check('password')
.trim()
.not()
.isEmpty()
.withMessage('Please Check Your Password')
.isLength({min:8, max:30})
.withMessage('Password Must Be 8 to 30 Characters Long!'),
];

exports.validate = (req,res, next) => {
    const error = validationResult(req).array()
    if(!error.length) return next()

    res.status(400).json({success:false, error: error[0].msg})
}