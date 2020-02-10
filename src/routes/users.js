const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const userController = require('../controllers/users');

router.post('/register', validate.register, userController.register);

router.post('/login', validate.login, userController.login);

router.put('/password', validate.changePassword, userController.changePassword);

router.get('/list', validate.listUsers, userController.listUsers);

router.get('/role', validate.getRole, userController.getRole);

router.put('/role', validate.changeRole, userController.setRole);

router.delete('/logout', validate.logout, userController.logout);

router.delete('/delete', validate.deleteUser, userController.deleteUser);

module.exports = router;
