var express = require('express');
var router = express.Router();
var typhoon = require('../models/typhoon');

// 原生接口
router.get('/list', (req, res, next) => {
    typhoon.getTyphoonList(req, res, next)
});

module.exports = router;