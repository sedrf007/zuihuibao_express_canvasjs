(function ($) {
    $.chart = function(req,chartname){
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
    };

    $.chartcolumn = function (req) {
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
            var yes_money = "昨日保费：¥"+(index_total[0][0][0]['money']/10000).toFixed(2)+'万';
            var month_money = "当月保费：¥"+(index_total[0][1][0]['money']/100000000).toFixed(2)+'亿';
            var year_money = "年度保费：¥"+(index_total[0][2][0]['money']/100000000).toFixed(2)+'亿';

            $('#yes_money').html(yes_money);
            $('#month_money').html(month_money);
            $('#year_money').html(year_money);
            data1=pie[0];
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
                    indexLabelFontSize: 16,
                    indexLabel: "{label} - {y}%",
                    dataPoints: [
                        { y: data1[0].percentage, label: data1[0].insurance_company },
                        { y: data1[1].percentage, label: data1[1].insurance_company },
                        { y: data1[2].percentage, label: data1[2].insurance_company },
                        { y: data1[3].percentage, label: data1[3].insurance_company },
                        { y: data1[4].percentage, label: data1[4].insurance_company }
                    ]
                }]
            });
            var premium=[];
            data2.forEach(function (value) {
                premium.push({
                    label:value.province,
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
                    fontSize: 16
                }],
                axisY: {
                    prefix: "¥"
                    // scaleBreaks: {
                    //     customBreaks: [{
                    //         startValue: 10000,
                    //         endValue: 35000
                    //     }]
                    // }
                },
                axisX:{
                    interval: 1,
                    labelAngle: -70
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
                    markerType: "square",
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

})(jQuery);


$(function () {
    var dateList=datalist();
    var endDateStr=dateList.split('/')[0];
    var timeStr=dateList.split('/')[1];
    requestdata(endDateStr,timeStr);
    $(".ui-datepicker-quick input").on("click",function(){
        var thisAlt = $(this).attr("alt");
        var startda=timeConfig(thisAlt).split('/')[0];
        var y=startda.split('-')[0];
        var d=startda.split('-')[2];
        var m=startda.split('-')[1];
        if(d<10){
            d='0'+d;
        }
        if(m<10){
            m='0'+m;
        }
        var endDateStr=y+'-'+m+'-'+d;
        var endda=timeConfig(thisAlt).split('/')[1];
        var yt=endda.split('-')[0];
        var dt=endda.split('-')[2];
        var mt=endda.split('-')[1];
        if(dt<10){
            dt='0'+dt;
        }
        if(mt<10){
            mt='0'+mt;
        }
        var timeStr=yt+'-'+mt+'-'+dt;
        $(".ui-datepicker-time").val(timeConfig(thisAlt));
        $(".ui-datepicker-css").css("display","none");
        $("#ui-datepicker-div").css("display","none");
        requestdata(endDateStr,timeStr);
    });

});
function datePickers(){
    //自定义菜单
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var dateList = startDate +'/'+ endDate;
    $(".ui-datepicker-time").val(dateList);
    $(".ui-datepicker-css").css("display","none");
    requestdata(startDate,endDate);
}
function requestdata(m,n){
    var request = {
        type:'province',
        start_date:m,
        end_date:n
    };
    var column_type = $.post('http://localhost:3000/subline',request);
    //console.log(column_type);
    //ShowLoading('加载中');
    $.when(column_type).done(function(column){
        //console.log(column);
        //HideLoading();
        var column_num = column.length;
        var i = 0;
        var chart_tiny=[];
        while(i<column_num){
            // console.log(column[i]);
            var province = column[i].province;
            var req = {
                type:'province',
                start_date:m,
                end_date:n,
                value:province
            };
            var a = $.chart(req,i+1);
            chart_tiny.push(a);
            i=i+1;
            $("h4#title"+i).html(province)
            //$("h4#title"+i).html(province)
        }
        var reqall = {
            start_date:m,
            end_date:n
        };
        Promise.all(chart_tiny).then($.chartcolumn(reqall))
    })
}


