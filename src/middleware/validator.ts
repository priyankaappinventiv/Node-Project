import {check, validationResult} from "express-validator";
 const validateUser = [
  check('username')
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Password cannot be empty')
    .isLength({min: 8})
    .withMessage('Password must be more that 6 charecters'),
  check('firstname')
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!'), 
  check('lastname')
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!'),   
  check('gmail')
    .not()
    .isEmpty()
    .withMessage('Invalid email address!'),  
  check('phoneNumber')
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .isLength({min: 10})
    .withMessage('Minimum 10 characters required!'),  
  (req:any, res:any, next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  },
];

export default validateUser;