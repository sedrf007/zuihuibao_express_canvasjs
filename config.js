var express = require('express');

var config = {
    'dev':{
        host     : '127.0.0.1',
        user     : 'jichenjie',
        password : 'Aa1993319!',
        database : 'dbzhb',
        port:3326,
        connectionLimit:10
    },
    'online':{
        host     : 'rds2uq3qm7vrq2a.mysql.rds.aliyuncs.com',
        user     : 'yiio2o',
        password : '_Yiio2o2017!',
        database : 'dbzhb',
        port:3326,
        connectionLimit:10
    }
};

module.exports =config;