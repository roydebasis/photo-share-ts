// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const { findUser } = require("../../services/userService");

// Vallidate user data
const createUpdateValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet.")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address.")
    .trim()
    .custom(async (value, { req }) => {
      try {
        const user = await findUser({email: value}, req.params.id);
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value, { req }) => {
      try {
        const user = await findUser({mobile: value}, req.params.id);
        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check('gender').optional().isAlpha().withMessage('Only alphabets are allowed.')
];

const updateValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
        return;
    } 
    // remove uploaded files
    if (req.files && req.files.length > 0) {
        const { filename } = req.files[0];
        unlink(
          path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
          (err) => {
              if (err) console.log(err);
          }
        );
    }
   
    res.status(400).json({
        errors: mappedErrors,
    });
};

module.exports = {
  createUpdateValidators,
  updateValidationHandler
};
