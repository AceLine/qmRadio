$(document).on('pageinit', function(){
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady()
    {
        action();
    }



    function action()
    {
        var networkState = navigator.connection.type;
        var qmRadioStatus = 0;
        if(networkState != 'none')
        {
            setInterval(function(){
                var url = "http://www.666kw.com/includes/qmRadio_check_android.php";

                var sendData ='q=phonegap';

                $.ajax({
                    type: "GET",
                    url: url,
                    data: sendData,
                    dataType: "json",
                    success: function(data, status, object){
                        var body = object.responseText;

                        var obj = jQuery.parseJSON(body);

                        $("#nowplaying").html(obj.nowPlaying.artist+'<br />'+obj.nowPlaying.title);
                        $(".connecting").css('display','none');
                        $(".nowplaying").css('display','block');
                    },
                    error: function(e){}
                });
            },1000);

            $(".buttons").css('visibility','visible');

            $(".bar").each(function(i) {
                fluctuate($(this));
            });

            $("#play").on('tap', function() {
                if(qmRadioStatus == 0){
                    qmRadioSrc = 'http://qmradio.666kw.com/666kw-com_qmRadio.mp3';
                    my_media = new Media(qmRadioSrc,
                    function(){
                        $("#qmRadio_status").html("Streaming qmRadio");
                    },
                    function(err){
                        $("#qmRadio_status").html("Error: "+err.message);
                    },
                    function(status){
                        if(status == 0) $("#qmRadio_status").html("&nbsp;");
                        if(status == 1) $("#qmRadio_status").html("Please wait... Stream is buffering.");
                        if(status == 2) $("#qmRadio_status").html("Streaming qmRadio");
                    });
                    my_media.play();
                    qmRadioStatus = 1;
                }
                else
                {
                    my_media.stop();
                    $("#qmRadio_status").html("Paused...");
                    qmRadioStatus = 0;
                }
            });

            $("#exit").on("tap", function(){
                if(qmRadioStatus == 1) my_media.stop();
                $(".connecting").css('display','none');
                $(".nowplaying").css('display','none');
                $(".closing").css('display','block');
                setTimeout(function(){
                    navigator.app.exitApp();
                }, 2000);
            });

        }
        else
        {
            navigator.notification.alert('You have no connection to the internet. Connect to internet and try again.', function(){
                $(".connecting").css('display','none');
                $(".nowplaying").css('display','none');
                $(".closing").css('display','block');
                setTimeout(function(){
                    navigator.app.exitApp();
                }, 2000);
            }, 'qmRadio', 'Close');
        }
    }
    function fluctuate(bar) {
        var hgt = Math.random() * 10;
        hgt += 1;
        var t = hgt * 30;

        bar.animate({
            height: hgt
        }, t, function() {
            fluctuate($(this));
        });
    }
});
