window.onload = function () {
    $(function () {
        var url1 = 'http://localhost:3000/pie';
        var url2 = 'http://localhost:3000/column';
        var request_column= {
            start_date:'2018-04-18',
            end_date:'2018-04-25'
        };
        var request_line={
            start_date:'2018-04-15',
            end_date:'2018-04-25'
        };
        var data1,data2;
        var postpie = $.post(url1);
        var postcolumn = $.post(url2,request_column);
        var index_data = $.post('http://localhost:3000/index_total');
        var line = $.post('http://localhost:3000/line',request_line);
        var index_total = $.post('http://localhost:3000/index_total');

        console.log(11111);
        $.when(postpie,postcolumn,index_data,line,index_total).done(function (pie,column,index_data,line,index_total) {
            data1=pie[0];
            data2 = column[0];
            console.log(line);
            var total_line = [];
            line[0].forEach(function (value) {
                var date = value.date;
                console.log(value);
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
                },
                    // {
                    //     type: "line",
                    //     showInLegend: true,
                    //     name: "Unique Visit",
                    //     lineDashType: "dash",
                    //     dataPoints: [
                    //         { x: new Date(2017, 0, 3), y: 510 },
                    //         { x: new Date(2017, 0, 4), y: 560 },
                    //         { x: new Date(2017, 0, 5), y: 540 },
                    //         { x: new Date(2017, 0, 6), y: 558 },
                    //         { x: new Date(2017, 0, 7), y: 544 },
                    //         { x: new Date(2017, 0, 8), y: 693 },
                    //         { x: new Date(2017, 0, 9), y: 657 },
                    //         { x: new Date(2017, 0, 10), y: 663 },
                    //         { x: new Date(2017, 0, 11), y: 639 },
                    //         { x: new Date(2017, 0, 12), y: 673 },
                    //         { x: new Date(2017, 0, 13), y: 660 },
                    //         { x: new Date(2017, 0, 14), y: 562 },
                    //         { x: new Date(2017, 0, 15), y: 643 },
                    //         { x: new Date(2017, 0, 16), y: 570 }
                    //     ]
                    // }
                ]
            });
            chart.render();

            // function toogleDataSeries(e){
            //     if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            //         e.dataSeries.visible = false;
            //     } else{
            //         e.dataSeries.visible = true;
            //     }
            //
            //}
            chart2.render();
            chart1.render();
            chart.render();
        });


        // var data1=ajaxPost(url1,{});
        // console.log(data1);
        // var data2=ajaxPost(url2,request_column);

    });
};

function ajaxPost(url,params){
    $.ajax({
        url: url,
        type: 'POST',
        data: params,
        //async:false,
        success: function(data){
            return data
        }
    })
}

