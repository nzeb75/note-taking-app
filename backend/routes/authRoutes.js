const express = require('express');
const {register, login} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

//protected route
router.get('/welcome', authMiddleware, (req, res) => {
    res.status(200).json({message: `Welcome ${req.user.username}`});
});

module.exports = router;