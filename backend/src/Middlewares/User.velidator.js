const { body, validationResult } = require("express-validator");


const validationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


const registerUserValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    body("phone")
        .notEmpty()
        .withMessage("Phone is required"),
    body("gender")
        .notEmpty()
        .withMessage("Gender is required"),
    validationError,
]


const loginUserValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validationError,
]


const userAddressValidator = [
    body("street")
        .notEmpty()
        .withMessage("Street is required"),
    body("city")
        .notEmpty()
        .withMessage("City is required"),
    body("pincode")
        .notEmpty()
        .withMessage("Pincode is required"),
    body("state")
        .notEmpty()
        .withMessage("State is required"),
    validationError,

]

module.exports = { registerUserValidator, loginUserValidator, userAddressValidator }