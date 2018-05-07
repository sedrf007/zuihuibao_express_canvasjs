
(function($){
    $('.head a:first-child').click(function(){
        JumpUrl('http://localhost:3000/');
    });
    $('.head a#bus').click(function(){
        JumpUrl('business');
    });
    $('.head a:last-child').click(function(){
        JumpUrl('product');
    });
    $('.actions-btn li').click(function(){
        $(this).addClass('active').siblings().removeClass('active')
    });
    $('.canvasjs-chart-credit').hide();
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
   // date();
})(jQuery);
function setStartTime() {
    $('.startDate').datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: "+d",
        onClose : function(dateText, inst) {
            $( "#endDate" ).datepicker( "show" );
        },
        onSelect:function(dateText, inst) {
            $( "#endDate" ).datepicker( "option","minDate",dateText );
        }

    });
}
function setEndTime() {
    $(".endDate").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: "+d",
        defaultDate : new Date(),
        onClose : function(dateText, inst) {
            if (dateText < $("input[name=startDate]").val()){
                $( "#endDate" ).datepicker( "show" );
                alert("结束日期不能小于开始日期！");
                //$("#endDate").val(newdate)
            }
        }
    })
}
// function date() {
//     $('.date').datepicker(
//         $.extend({showMonthAfterYear:true}, $.datepicker.regional['zh-CN'],
//             {'showAnim':'','dateFormat':'yy-mm-dd','changeMonth':'true','changeYear':'true',
//                 'showButtonPanel':'true'}
//         ));
// }
function datepickerjQ() {
    $(".ui-datepicker-time").on("click",function(){
        $(".ui-datepicker-css").css("display","block")
    });
    $(".ui-kydtype li").on("click",function(){
        $(".ui-kydtype li").removeClass("on").filter($(this)).addClass("on");
//            getAppCondtion();
    });
    $(".ui-close-date").on("click",function(){
        $(".ui-datepicker-css").css("display","none")
        $("#ui-datepicker-div").css("display","none")
        //inst.dpDiv.css({"display":"none"})
    });
    $(".startDate").on("click",function(){
        $(".endDate").attr("disabled",false);
    });
}
function timeConfig(time){
        //快捷菜单的控制
        var nowDate = new Date();
        var timeStr = '/' + nowDate.getFullYear() + '-' + (nowDate.getMonth()+1) + '-' + nowDate.getDate();
        nowDate.setDate(nowDate.getDate()+parseInt(time));
        var endDateStr = nowDate.getFullYear() + '-'+  (nowDate.getMonth()+1) + '-' + nowDate.getDate();

        if(time == -1){
            endDateStr += '/' + endDateStr;
        }else{
            endDateStr += timeStr;
        }
        return endDateStr;
    }
function datalist(){
         setStartTime();
         setEndTime();
        datepickerjQ();
        var time=-13;
        var  start=timeConfig(time).split('/')[0];
        var d=start.split('-')[2];
        var m=start.split('-')[1];
        if(d<10){
            d='0'+ d;
        }
        if(m<10){
            m='0'+ (m);
        }
        var startDate=start.split('-')[0]+'-'+m+'-'+d;

        var enddate=timeConfig(time).split('/')[1];
        var dt=enddate.split('-')[2];
        var mt=enddate.split('-')[1];
        if(dt<10){
            dt='0'+ dt;
        }
        if(mt<10){
            mt='0'+ mt;
        }
        var endDate=enddate.split('-')[0]+'-'+mt+'-'+dt;
        $(".ui-datepicker-time").attr("value",startDate +"/"+ endDate);
        $("#startDate").attr("value",startDate);
        $("#endDate").attr("value",endDate);
        var dateList=startDate+'/'+endDate;
        return dateList
    }
function datePickers(){
    //自定义菜单
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var dateList = startDate +'/'+ endDate;
    $(".ui-datepicker-time").val(dateList);
    $(".ui-datepicker-css").css("display","none");
    requestdata(startDate,endDate);
}
function JumpUrl(url) {
    window.location.href=url;
}
function GetUrlPara(str) {
    if (window.location.search.split('?').length==1)
        return '';
    var arr = window.location.search.split('?')[1].split('&');
    var hash = {};
    for (var i=0; i<arr.length; ++i)
    {
        hash[arr[i].split('=')[0]]=arr[i].split('=')[1];
    }
    if (hash[str])
        return hash[str];
    else
        return '';
}
