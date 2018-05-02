window.onload = function () {
    $(function () {
        $.ajax({
            url: 'http://localhost:3000/column',
            type: 'POST',
            data: {
                start_date:'2018-04-18',
                end_date:'2018-04-25'
            },
            async:false,
            success: function(data){
                var premium=[];
                data.forEach(function (value) {
                    premium.push({
                        label:value.province,
                        y:value.money
                    })
                });
                var chart1 = new CanvasJS.Chart("chart1", {
                    animationEnabled: true,
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    title: {
                        text: "premium of province"
                    },
                    subtitles: [{
                        text: "Yuan",
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
                    data: [{
                        type: "column",
                        yValueFormatString: "¥#,##",
                        dataPoints: premium
                    }]
                });
                chart1.render();
            }
        });
    });
};
