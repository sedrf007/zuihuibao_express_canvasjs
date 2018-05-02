var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'jichenjie',
    password : 'Aa1993319!',
    database : 'dbzhb',
    port:3326,
    connectionLimit:10
});

function getDateStr(dayCount){
    if(null == dayCount){
        dayCount = 0;
    }
    var dd = new Date();
    dd.setDate(dd.getDate()+dayCount);//设置日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    if(m<10)m="0"+m;
    var d = dd.getDate();
    if(d<0)d="0"+d;
    return y+"-"+m+"-"+d;
}

router.post('/line_all',function (req,res) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var type = req.body.type;
    var value = req.body.value;

    var sql1 = "select sum(total_premium),order_source from preimum_order_source where date>='"+start_date+"' and date<='"+end_date+"' and order_source='pc' order by date asc";
    var sql2 = "select sum(total_premium),order_source from preimum_order_source where date>='"+start_date+"' and date<='"+end_date+"' and order_source='app' order by date asc";
    var sql3 = "select sum(total_premium),order_source from preimum_order_source where date>='"+start_date+"' and date<='"+end_date+"' and order_source='weixin' order by date asc";

    var sql = sql1+';'+sql2+';'+sql3;
    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            //console.log(rows);
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/businesspie',function (req,res) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var type = req.body.type;
    var value = req.body.value;
    var ins_list = [
        'pc',
        'weixin',
        'app',
        'other'
    ];
    var premium_all=0;
    var premium = [];

    pool.getConnection(function (err, connection) {
        connection.query("SELECT sum(premium) as money,order_source from premium_order_source where date>='"+start_date+"' and date<='"+end_date+"' group by order_source order by money desc", function (err, rows, fields) {
            console.log(rows);
            rows.forEach(function(element){
                premium_all = premium_all+parseInt(element.money);
            });
            for(i=0;i<4;i++){
                per = rows[i].money/premium_all*100;
                per=per.toFixed(2);
                premium[i]={
                    order_source : rows[i].insurance_company,
                    percentage : per
                }
            }
            //console.log(premium);
            //if (err) throw err;
            res.json(premium);
            connection.release();
            //res.json(rows);
        });
    });
});

router.post('/tinypie',function (req,res) {

});

module.exports=router;