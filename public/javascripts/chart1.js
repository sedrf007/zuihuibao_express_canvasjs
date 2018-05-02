window.onload = function () {

    var p = getamount();
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Total Premium"
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
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "Premium",
            markerType: "square",
            //xValueFormatString: "DD MMM, YYYY",
            color: "#F08080",
            dataPoints: [
                { x: p[0].date, y: p[0].premium },
                { x: p[1].date, y: p[1].premium },
                { x: p[2].date, y: p[2].premium },
                { x: p[3].date, y: p[3].premium },
                { x: p[4].date, y: p[4].premium },
                { x: p[5].date, y: p[5].premium },
                { x: p[6].date, y: p[6].premium },
                // { x: new Date(2017, 0, 4), y: 700 },
                // { x: new Date(2017, 0, 5), y: 710 },
                // { x: new Date(2017, 0, 6), y: 658 },
                // { x: new Date(2017, 0, 7), y: 734 },
                // { x: new Date(2017, 0, 8), y: 963 },
                // { x: new Date(2017, 0, 9), y: 847 },
                // { x: new Date(2017, 0, 10), y: 853 },
                // { x: new Date(2017, 0, 11), y: 869 },
                // { x: new Date(2017, 0, 12), y: 943 },
                // { x: new Date(2017, 0, 13), y: 970 },
                // { x: new Date(2017, 0, 14), y: 869 },
                // { x: new Date(2017, 0, 15), y: 890 },
                // { x: new Date(2017, 0, 16), y: 930 }
            ]
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

    function toogleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else{
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}




function getamount() {
    connection.connect();
    var premium = new Array();
    var date1 = getDateStr(-7);
    var date2 = getDateStr(0);
    connection.query("SELECT premium,date from premium_provider where provide='agent' and date>"+date+" and date<"+date+" order by date asc", function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        for(i=0;i<7;i++){
            premium[i]['premium'] = rows[i].premium;
            premium[i]['date'] = rows[i].date;
        }
    });

    return premium
}