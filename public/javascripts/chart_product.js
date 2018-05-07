/**
 * Created by zlf on 2018/5/3.
 */

function requestdata(start_date,end_date) {
    var time={
        start_date:start_date,
        end_date:end_date
    };
    var request = {
        type:'province',
        start_date:start_date,
        end_date:end_date
    };
    var column_type = $.post('http://localhost:3000/subproduct',request);
    $.when(column_type).done(function(column){
        //console.log(column);
        var column_num = column.length;
        var i = 0;
        var chart_tiny=[];
        while(i<column_num){
            if(column[i].money>0){
                var province = column[i].province;
                var req = {
                    type:'province',
                    start_date:start_date,
                    end_date:end_date,
                    value:province
                };
                var a = provincial_data(req,i+1);
                chart_tiny.push(a);
                i=i+1;
                $("h4#title"+i).html(province)
            }
            var num=26-i;
            if(num>column_num){
                console.log(num);
                var n='#product'+num;
                $(n).parent('.tiny-column').hide();
            }
        }
        Promise.all(chart_tiny).then(product_data(time));
    })
}

//接口获得数据(各产品保费趋势，产品占比)
function product_data(time) {
    ShowLoading('加载中');
    var pie = $.post('http://localhost:3000/productpie',time);
    var line = $.post('http://localhost:3000/product_line',time);
    $.when(pie,line).done(function (val1,val2) {
        HideLoading();
        Product_Premium('product_premium',val2);
        Proportion_Product('proportion_product',val1);
       }
    );
}
//各省产品占比数据
function provincial_data(time,name) {
    return new Promise(function(resolve,reject){
        //设置饼图颜色方法
        CanvasJS.addColorSet("greenShades",
            [//colorSet Array
                "#63c2de",
                "#f8cb00",
                "#f86c6b"
            ]);
        $.post('http://localhost:3000/productpie',time).done(function (data) {
            if(data.length>0){
                var pie=[];
                data.forEach(function (value) {
                    pie.push({
                        y:value.percentage,
                        label:value.product_source
                    })
                });
                name = 'product'+name;
                var chart = new CanvasJS.Chart(name, {
                    theme: "light1", // "light1", "light2", "dark1", "dark2"
                    colorSet: "greenShades",
                    title: {
                        text: ""
                    },
                    creditText:false,
                    creditHref:'baidu.com',
                    data: [{
                        type: "pie",
                        startAngle: 25,
                        toolTipContent: "<b>{label}</b>: {y}%",
                        showInLegend: "true",
                        legendText: "{label}",
                        indexLabelFontSize: 12,
                        indexLabel: "{label}{y}%",
                        dataPoints: pie
                    }]
                });
                chart.render();
            }
            resolve()
        })
    });
}

//各产品保费趋势图
function Product_Premium(name,val){
    var line1 = [];
    var line2 = [];
    var line3 = [];
    var line4 = [];
    val[0][0].forEach(function (value, index) {
        var date = value.date;
        var source_date = date.split('-');
        line1.push({
            x:new Date(source_date[0],source_date[1]-1,source_date[2]),
            y:value.money
        })
    });
    val[0][1].forEach(function (value, index) {
        var date = value.date;
        var source_date = date.split('-');
        line2.push({
            x:new Date(source_date[0],source_date[1]-1,source_date[2]),
            y:value.money
        })
    });
    val[0][2].forEach(function (value, index) {
        var date = value.date;
        var source_date = date.split('-');
        line3.push({
            x:new Date(source_date[0],source_date[1]-1,source_date[2]),
            y:value.money
        })
    });
    val[0][3].forEach(function (value, index) {
        var date = value.date;
        var source_date = date.split('-');
        line4.push({
            x:new Date(source_date[0],source_date[1]-1,source_date[2]),
            y:value.money
        })
    });
    var chart = new CanvasJS.Chart(name, {
        title: {
            text: ""
        },
        axisX: {
            valueFormatString: "MMM YYYY",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY2: {
            title: "",
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: [
            {
            type: "line",
            showInLegend: true,
            name: "同步",
            markerType: "circle",
            markerSize:6,
            xValueFormatString: "DD MMM, YYYY",
            dataPoints: line1
            },
            {
                type: "line",
                showInLegend: true,
                name: "APP",
                markerSize:6,
                lineDashType: "dash",
                dataPoints: line2
            },
            {
                type: "line",
                showInLegend: true,
                name: 'PC电网销',
                markerSize:6,
                lineDashType: "dash",
                dataPoints: line3
            },{
                type: "line",
                showInLegend: true,
                name: '在线经纪',
                markerSize:6,
                lineDashType: "dash",
                dataPoints: line4
            }]
    });
    chart.render();
    function toogleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else{
            e.dataSeries.visible = true;
        }
        chart.render();
    }
}

//产品占比图
function Proportion_Product(name,val) {
    CanvasJS.addColorSet("greenShades",
        [//colorSet Array
            "#63c2de",
            "#f8cb00",
            "#f86c6b",
            "#8E44AD"
        ]);
    var pie_all=[];
    val[0].forEach(function (value) {
        pie_all.push({
            y:value.percentage,
            label:value.product_source
        })
    });
    var chart = new CanvasJS.Chart(name, {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        colorSet: "greenShades",
        title: {
            text: ""
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 12,
            indexLabel: "{label}{y}%",
            dataPoints: pie_all
        }]
    });
    chart.render();
}