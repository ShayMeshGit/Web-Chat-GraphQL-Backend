const yup = require('yup');


const userSignupSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a vaild email.').
        required('Please enter an email.'),
    username: yup
        .string()
        .max(20, `Username too long.`)
        .required('Please enter a username.'),
    password: yup
        .string()
        .min(4, 'Password to short.')
        .required('Please enter a password.')
});

const userLoginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a vaild email.').
        required('Please enter an email.'),
    password: yup
        .string()
        .required('Please enter a password.')
});


module.exports = {
    userSignupSchema,
    userLoginSchema
};