const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {

res.send('hello welcome to African craft shoes API.');
});

module.exports = router;

