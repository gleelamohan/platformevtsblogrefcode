var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Return Request Demo' });
});

module.exports = router;
