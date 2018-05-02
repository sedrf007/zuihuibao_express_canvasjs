window.onload = function () {
    $(function () {
        $.ajax({
            url: 'http://localhost:3000/total_premium',
            type: 'POST',
            data: {
            },
            async:false,
            success: function(data){
                console.log(data[0].date);
                var dps = [];
                for(i=0;i<data.length;i++){
                    date = data[i].date.split('-');
                    console.log(date);
                    dps.push({x:new Date(date[0],date[1],date[2]),y:data[i].money})
                }
                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "light2",
                    title:{
                        text: "Simple Line Chart"
                    },
                    xValueFormatString: "DD MMM",
                    axisY:{
                        includeZero: false
                    },
                    data: [{
                        type: "line",
                        dataPoints: dps
                    }]
                });
                chart.render();
            }
        });
    });
};