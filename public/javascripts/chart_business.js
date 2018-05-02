(function ($) {
    $.chart_pie = function (req,chartname) {
        return new Promise(function(resolve,reject){
            $.post('http://localhost:3000/businesspie',req).done(function (data) {
                console.log(data.length);
                if(data.length>0){
                    var pie=[];
                    data.forEach(function (value) {
                        pie.push({
                            y:value.percentage,
                            x:value.order_source
                        })
                    });
                    chartname = 'tiny'+chartname;
                    var chart = new CanvasJS.Chart(chartname, {
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
                            dataPoints: pie
                        }]
                    });
                    chart.render();
                }

                resolve()
            })
        });
    };

    $.chart_pie_all = function(req){
        var pie = $.post('http://localhost:3000/businesspie',req);
        var line = $.post('http://localhost:3000/line_all',req);
        $.when(pie,line).done(function (pie,line) {
            //console.log(pie);
            //console.log(line);
            var pie_all=[];
            pie[0].forEach(function (value) {
                pie_all.push({
                    y:value.percentage,
                    label:value.order_source
                })
            });
            var chart = new CanvasJS.Chart("pie_all", {
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
                    dataPoints: pie_all
                }]
            });
            var line1 = [];
            var line2 = [];
            var line3 = [];
            line[0][0].forEach(function (value, index) {
                var date = value.date;
                var source_date = date.split('-');
                line1.push({
                    x:new Date(source_date[0],source_date[1]-1,source_date[2]),
                    y:value.money
                })
            });
            line[0][1].forEach(function (value, index) {
                var date = value.date;
                var source_date = date.split('-');
                line2.push({
                    x:new Date(source_date[0],source_date[1]-1,source_date[2]),
                    y:value.money
                })
            });
            line[0][2].forEach(function (value, index) {
                var date = value.date;
                var source_date = date.split('-');
                line3.push({
                    x:new Date(source_date[0],source_date[1]-1,source_date[2]),
                    y:value.money
                })
            });
            var chart1 = new CanvasJS.Chart("business_line", {
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
                    title: "",
                    crosshair: {
                        enabled: true
                    }
                },
                toolTip:{
                    shared:true
                },
                legend:{
                    cursor:"pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true,
                    itemclick: toogleDataSeries
                },
                data: [{
                    type: "line",
                    showInLegend: true,
                    name: "在线经纪",
                    markerType: "square",
                    xValueFormatString: "DD MMM, YYYY",
                    color: "#F08080",
                    dataPoints: line1
                },
                    {
                        type: "line",
                        showInLegend: true,
                        name: "网销",
                        lineDashType: "dash",
                        color:"#19F02F",
                        dataPoints: line2
                    },
                    {
                        type: "line",
                        showInLegend: true,
                        name: '电销',
                        lineDashType: "shortDash",
                        dataPoints: line3
                    }]
            });
            function toogleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else{
                    e.dataSeries.visible = true;
                }
                chart1.render();
            }
            chart.render();
            chart1.render();
        })
    };
})(jQuery);

$(function () {
    var start_date = '2018-04-10';
    var end_date = '2018-04-25';
    var request = {
        type:'province',
        start_date:start_date,
        end_date:end_date
    };

    var column_type = $.post('http://localhost:3000/subpie',request);
    //console.log(column_type);
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
                var a = $.chart_pie(req,i+1);
                chart_tiny.push(a);
                i=i+1;
                $("h4#title"+i).html(province)
            }
            //$("h4#title"+i).html(province)
        }
        var reqall = {
            start_date:start_date,
            end_date:end_date
        };
        Promise.all(chart_tiny).then($.chart_pie_all(reqall))

        // column.forEach(function (value,index) {
        //     var result = {
        //         type:'province',
        //         start_date:start_date,
        //         end_date:end_date,
        //         value:value.province
        //     };
        //     $.chart(result,index+1)
        // });
    })
});