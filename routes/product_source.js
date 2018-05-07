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

router.post('/product_line',function (req,res) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var province = req.body.province;//new

    var sql1 = "select sum(premium) as money,'sync' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='sync' group by date order by date asc";
    var sql2 = "select sum(premium) as money,'app' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='app' group by date order by date asc";
    var sql3 = "select sum(premium) as money,'pc' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='pc' group by date order by date asc";
    var sql4 = "select sum(premium) as money,'weixin' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='weixin' group by date order by date asc";
    if(province!=null){
        sql1 = "select sum(premium) as money,'sync' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='sync' and province='"+province+"' group by date order by date asc";
        sql2 = "select sum(premium) as money,'app' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='app' and province='"+province+"' group by date order by date asc";
        sql3 = "select sum(premium) as money,'pc' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='pc' and province='"+province+"' group by date order by date asc";
        sql4 = "select sum(premium) as money,'weixin' as product_source,date from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and product_source='weixin' and province='"+province+"' group by date order by date asc";
    }

    var sql = sql1+';'+sql2+';'+sql3+';'+sql4;
    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            //console.log(rows);
            console.log(sql);
            res.json(rows);
            connection.release();
        })
    })
});

router.post('/productpie',function (req,res) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var type = req.body.type;//new ie. city
    var value = req.body.value;//new ie. 宁波
    var premium_all=0;
    var premium = [];

    pool.getConnection(function (err, connection) {
        var mysql = "SELECT sum(premium) as money,product_source from premium_product where date>='"+start_date+"' and date<='"+end_date+"' group by product_source order by money desc";
        if(type!=null){
            mysql = "SELECT sum(premium) as money,product_source from premium_product where date>='"+start_date+"' and date<='"+end_date+"' and "+type+" ='"+value+"' group by product_source order by money desc";
        }
        connection.query(mysql, function (err, rows, fields) {
            //console.log(rows);
            var i = 0;
            for(j=0;j<rows.length ;j++){
                premium_all = premium_all+parseInt(rows[j].money);
            }
            rows.forEach(function(element){
                console.log(element);
                if(element.money>0){
                    per = rows[i].money/premium_all*100;
                    per=per.toFixed(2);
                    premium[i]={
                        product_source : rows[i].product_source,
                        percentage : per
                    };
                    i++;
                }
            });
            //console.log(premium);
            //if (err) throw err;
            res.json(premium);
            connection.release();
            //res.json(rows);
        });
    });
});

router.post('/subproduct',function (req,res) {
    var type = req.body.type;//new ie. city
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var province = req.body.province;//new

    var sql = "select sum(premium) as money,"+type+" from premium_product where date>'"+start_date+"' and date<'"+end_date+"' group by "+type+" order by money desc";
    if(province!=null){
        sql = "select sum(premium) as money,"+type+" from premium_product where date>'"+start_date+"' and date<'"+end_date+"' and province='"+province+"' group by "+type+" order by money desc";
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