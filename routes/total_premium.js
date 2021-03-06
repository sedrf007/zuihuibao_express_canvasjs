var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config');
if(process.env.NODE_ENV=='development'){
    var mysql_config = config.dev
}else{
    var mysql_config = config.online
}
var pool = mysql.createPool(mysql_config);
//connection.connect();
//connection.end();

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
    if(d<10)d="0"+d;
    return y+"-"+m+"-"+d;
}

router.post('/total_premium', function(req, res, next) {
    var date1 = req.body.start_date;
    var date2 = req.body.end_date;
    var province = req.body.province;//new
    pool.getConnection(function (err, connection) {
        var sql = "SELECT premium as money,date from premium_provider where provider='agent' and date>'"+date1+"' and date<'"+date2+"' order by date asc";
        if(province!=null){
            sql = "SELECT premium as money,date from premium_provider where provider='agent' and date>'"+date1+"' and date<'"+date2+"' and province='"+province+"' order by date asc"
        }
        connection.query(sql, function (err, rows, fields) {
            //if (err) throw err;
            //console.log(rows[0]);
            // Object.keys(rows).forEach(function(key) {
            //     var row = rows[key];
            //     //console.log(row.date+key);
            //     money.push(1);
            //     date.push(row.name);
            // });
            res.json(rows);
            connection.release();
        });
    });

});

router.post('/pie',function(req,res,next){
    var date1 = req.body.start_date;
    var date2 = req.body.end_date;
    var province = req.body.province;//new
    var ins_list = [
        'RENBAO',
        'TAIPINGYANG',
        'ZHONGHUA',
        'GUOSHOU'
    ];
    var premium_all=0;
    var premium = [];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT sum(premium) as money,insurance_company from premium_all where date>'"+date1+"' and date<'"+date2+"' group by insurance_company order by money desc";
        if(province!=null){
            sql = "SELECT sum(premium) as money,insurance_company from premium_all where date>'"+date1+"' and date<'"+date2+"' and province='"+province+"' group by insurance_company order by money desc";
        }
        connection.query(sql, function (err, rows, fields) {
            console.log(rows);
            rows.forEach(function(element,index){
                premium_all = premium_all+parseInt(element.money);
            });
            var length = rows.length;
            var per_other = premium_all;
            for(i=0;i<length;i++){
                per = rows[i].money/premium_all*100;
                per=per.toFixed(2);
                premium[i]={
                    insurance_company : rows[i].insurance_company,
                    percentage : per
                };
                per_other = per_other-rows[i].money;
            }

            per_other = per_other/premium_all*100;
            //console.log(per_other);
            per_other = per_other.toFixed(2);
            premium.push({
                insurance_company : 'OTHER',
                percentage : per_other
            });
            //console.log(premium);
            //if (err) throw err;
            res.json(premium);
            connection.release();
            //res.json(rows);
        });
    });
});


router.post('/column',function (req,res,next) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var province = req.body.province;//new
    var sql = "select sum(premium) as money,province from premium_all where date>='"+start_date+"' and date<='"+end_date+"' group by province order by money desc";
    if(province!=null){
        sql = "select sum(premium) as money,city from premium_all where date>='"+start_date+"' and date<='"+end_date+"' and province='"+province+"' group by city order by money desc";
    }

    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            //console.log(rows);
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/index_total',function (req,res) {
    var dd = new Date();
    dd.setDate(dd.getDate());//设置日期
    var y = dd.getFullYear();
    var m = dd.getMonth();//获取当前月份的日期
    if(m<10)m="0"+m;
    if(m==0){
        m='01';
        y=y-1;
    }

    var today = getDateStr();
    var yes = getDateStr(-1);
    var month = y+"-"+m+"-01";
    var year = y+"-01-01";
    var province = req.body.province;//new
    if(province!=null){
        sql1 = sql1+" and province="+province;
        sql2 = sql2+" and province="+province;
        sql3 = sql3+" and province="+province;
    }
    // var sql1 = "select sum(premium) as money from premium_all where date>'"+yes+"' and date<'"+today+"'";
    // var sql2 = "select sum(premium) as money from premium_all where date>'"+month+"' and date<'"+today+"'";
    // var sql3 = "select sum(premium) as money from premium_all where date>'"+year+"' and date<'"+today+"'";
    sql1 = "select sum(premium) as money from premium_all where date>='"+yes+"' and date<'"+today+"'";
    sql2= "select sum(premium) as money from premium_all where date>='"+month+"'";
    sql3="select sum(premium) as money from premium_all where date>='"+year+"'";
    var sql = sql1+';'+sql2+';'+sql3
    console.log(sql);
    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            //console.log(rows);
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/line',function (req,res) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var province = req.body.province;//new
    var sql = "select sum(premium) as money,date from premium_all where date>'"+start_date+"' and date<'"+end_date+"' group by date order by date asc";
    if(province!=null){
        sql = "select sum(premium) as money,date from premium_all where date>'"+start_date+"' and date<'"+end_date+"' and province='"+province+"' group by date order by date asc";
    }

    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/tiny_column',function (req,res) {
    var type = req.body.type;//new ie. city
    var value = req.body.value;//new ie. 宁波
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var sql = "select sum(premium) as money,date from premium_all where date>'"+start_date+"' and date<'"+end_date+"' and "+type+" ='"+value+"' group by date order by date asc";

    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            console.log(rows);
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/subline',function (req,res) {
    var type = req.body.type;//new ie. city
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var province = req.body.province;//new

    var sql = "select sum(premium) as money,"+type+" from premium_all where date>'"+start_date+"' and date<'"+end_date+"' group by "+type+" order by money desc";

    if(province!=null){
        sql = "select sum(premium) as money,"+type+" from premium_all where date>'"+start_date+"' and date<'"+end_date+"'and province='"+province+"' group by "+type+" order by money desc";
    }

    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            console.log(rows);
            res.json(rows);
            connection.release();
        })
    })
});

module.exports=router;