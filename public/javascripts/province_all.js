/**
 * Created by zlf on 2018/5/7.
 */
$(function () {
    console.log(getUrlParam('province'))
   $('.province').html(getUrlParam('province'));
});

function chart(req,chartname) {
    return new Promise(function(resolve,reject){
        $.post('http://localhost:3000/tiny_column',req).done(function (data) {
            var column=[];
            data.forEach(function (value) {
                var date = value.date;

                var date_list = date.split('-');
                column.push({
                    x:new Date(date_list[0],date_list[1]-1,date_list[2]),
                    y:value.money
                })
            });
            chartname = 'tiny'+chartname;
            var chart = new CanvasJS.Chart(chartname,
                {
                    title: {
                        text: ''
                    },
                    axisX:{
                        valueFormatString: "DD MMM",
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true
                        },
                        labelAngle: -30
                    },
                    data: [
                        {
                            type: "line",
                            dataPoints: column
                        }
                    ]
                });
            chart.render();
            var text = 'output '+chartname;
            resolve(text)
        })
    });
}
function chartcolumn(req) {
    console.log(req)
    var url1 = 'http://localhost:3000/pie';
    var url2 = 'http://localhost:3000/column';
    var data1,data2;
    var postpie = $.post(url1,req);
    var postcolumn = $.post(url2,req);
    var index_data = $.post('http://localhost:3000/index_total');
    var line = $.post('http://localhost:3000/line',req);
    var index_total = $.post('http://localhost:3000/index_total');

    $.when(postpie,postcolumn,index_data,line,index_total).done(function (pie,column,index_data,line,index_total) {
        // console.log(index_total[0][0][0]['money']);
        var yes_money = "¥"+(index_total[0][0][0]['money']/10000).toFixed(2)+'万';
        var month_money = "¥"+(index_total[0][1][0]['money']/100000000).toFixed(2)+'亿';
        var year_money = "¥"+(index_total[0][2][0]['money']/100000000).toFixed(2)+'亿';

        $('#yes_money').html(yes_money);
        $('#month_money').html(month_money);
        $('#year_money').html(year_money);
        data1=pie[0];
        pie_data=[];
        pie[0].forEach(function(pie){
            pie_data.push({
                y:pie.percentage,
                label:pie.insurance_company
            })
        });

        data2 = column[0];
        var total_line = [];
        line[0].forEach(function (value) {
            var date = value.date;
            var line_date = date.split('-');
            total_line.push({
                x:new Date(line_date[0],line_date[1]-1,line_date[2]),
                y:value.money
            })
        });
        var chart = new CanvasJS.Chart("pie", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: false,
            animationEnabled: true,
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
                dataPoints: pie_data
            }]
        });
        var premium=[];
        data2.forEach(function (value) {
            premium.push({
                label:value.city,
                y:value.money
            })
        });
        var chart1 = new CanvasJS.Chart("column", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: ""
            },
            subtitles: [{
                text: "单位：元",
                fontSize: 14
            }],
            axisY: {
                prefix: "¥",
                labelFontSize:16
                // scaleBreaks: {
                //     customBreaks: [{
                //         startValue: 10000,
                //         endValue: 35000
                //     }]
                // }
            },
            axisX:{
                interval: 1,
                labelAngle: -70,
                labelFontSize:14
            },
            data: [{
                type: "column",
                yValueFormatString: "¥#,###",
                dataPoints: premium
            }]
        });
        var chart2 = new CanvasJS.Chart("line", {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: ""
            },
            axisX:{
                valueFormatString: "DD MMM",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                title: "Premium",
                crosshair: {
                    enabled: true
                }
            },
            toolTip:{
                shared:true
            },
            legend:{
                cursor:"pointer",
                verticalAlign: "bottom",
                horizontalAlign: "left",
                dockInsidePlotArea: true,
                //itemclick: toogleDataSeries
            },
            data: [{
                type: "line",
                showInLegend: true,
                name: "Premium",
                markerType: "circle",
                markerSize:6,
                //xValueFormatString: "DD MMM, YYYY",
                color: "#F08080",
                dataPoints: total_line
            }]
        });
        chart.render();
        chart2.render();
        chart1.render();
        chart.render();
    })
}
function requestdata(m,n){
    var request = {
        type:'city',
        start_date:m,
        end_date:n,
        province:getUrlParam('province')
    };
    var column_type = $.post('http://localhost:3000/subline',request);
    $.when(column_type).done(function(column){
        //console.log(column);
        //HideLoading();
        var column_num = column.length;
        var i = 0;
        var chart_tiny=[];
        while(i<column_num){
            var city = column[i].city;
            var req = {
                type:'city',
                start_date:m,
                end_date:n,
                value:city
            };
            var a = chart(req,i+1);
            chart_tiny.push(a);
            i=i+1;
            $("h4#title"+i).html(city);
            var name='#tiny'+i;
            $(name).parent('.tiny-column').show();
        }
        var reqall = {
            start_date:m,
            end_date:n,
            province:getUrlParam('province')
        };
        Promise.all(chart_tiny).then(chartcolumn(reqall))
    })
}
