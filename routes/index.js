var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'jichenjie',
    password : 'Aa1993319!',
    database : 'dbzhb',
    port:3326
});
/* GET home page. */
// var money = new Array();
// var date = new Array();
// router.use(function(req, res, next){
//     connection.connect();
//     var date1 = getDateStr(-7);
//     var date2 = getDateStr(0);
//     connection.query("SELECT premium as money,date from premium_provider where provider='agent' and date>'"+date1+"' and date<'"+date2+"' order by date asc", function (err, rows, fields) {
//         //if (err) throw err;
//         console.log(rows[0]);
//         Object.keys(rows).forEach(function(key) {
//             var row = rows[key];
//             //console.log(row.date+key);
//             money.push(1);
//             date.push(row.name);
//         });
//     });
//     req.money = money;
//     req.date = date;
//     console.log(money);
//     console.log(req.money);
//     next();
// });

router.get('/', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('index.html',options);
});

router.get('/business', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('business_type.html',options);
});

router.get('/product', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('product.html',options);
});

router.get('/province_all', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('province_all.html',options);
});

router.get('/province_ordersource', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('province_ordersource.html',options);
});


router.get('/province_ordersource', function(req, res, next) {
    var options = {
        root: __dirname + '/html/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('province_ordersource.html',options);
});




module.exports = router;
