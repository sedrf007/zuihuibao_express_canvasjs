
(function($){
    $.setStartTime = function(){
        $('.startDate').datepicker({
            dateFormat: "yy-mm-dd",
            maxDate: "+d",
            onClose : function(dateText, inst) {
                $( "#endDate" ).datepicker( "show" );
            },
			onSelect:function(dateText, inst) {
                $( "#endDate" ).datepicker( "option","minDate",dateText );
            },
			
        });
    };
    $.setEndTime = function(){
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
        });
    };
    $.date = function(){
        $('.date').datepicker(
            $.extend({showMonthAfterYear:true}, $.datepicker.regional['zh-CN'],
                {'showAnim':'','dateFormat':'yy-mm-dd','changeMonth':'true','changeYear':'true',
                    'showButtonPanel':'true'}
            ));
    };
    $.datepickerjQ = function(){
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
	
})(jQuery);


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
        $.setStartTime();
        $.setEndTime();
        $.datepickerjQ();
        var time=-13;
        console.log(timeConfig(time));
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