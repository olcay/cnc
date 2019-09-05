var MotorController = function (leapService, motorService) {
    var logStep = 0, totalStep = 0, runLogInterval = false;

    var init = function (container) {
        
        $("#btnPenUp").click(penUp);
        $("#btnPenDown").click(penDown);
        $("#btnUnlockMotors").click(unlockMotors);
        $("#btnGoTo").click(goTo);

        $(".btnGoTo").click(goToFixed);
        $("#btnToggleLeap").click(enableLeap);

        $("#btnRunLog").click(runLog);

        $("#divPlayground").click(getPositionFromPlayground);

        $("#btnTestPrediction").click(sendToServer);

        //leapService.init(gotPosition);

        initCam();
    };

    var getPositionFromPlayground = function(e) {
        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);
        var relativeY = (e.pageY - offset.top);

        $('#txtX').val(Math.round(relativeY) * 2 - 600);
        $('#txtY').val(Math.round(relativeX) * 2 - 436);
      
        goTo();
    };

    var runLog = function() {
        $("#btnRunLog").removeClass("btn-success").addClass("btn-danger").html("Stop").unbind().click(stopRunningLog);
        logStep = 0;
        runLogInterval = true;
        processNextStep();
    };

    var processNextStep = function(){
        var splitted = $('#txtLog').val().split("\n");
        totalStep = splitted.length - 1;
        var position = JSON.parse(splitted[logStep]);

        $('#txtX').val(position[0]);
        $('#txtY').val(position[1]);

        goTo();
        
     };

    var stopRunningLog = function () {

        $("#btnRunLog").removeClass("btn-danger").addClass("btn-success").html("Run Log").unbind().click(runLog);

        runLogInterval = false;
        sendToServer();
    };

    var enableLeap = function (e) {
        leapService.enableLeap();
        $("#btnToggleLeap").html('Disable Leap').click(disableLeap);
    };

    var disableLeap = function (e) {
        leapService.disableLeap();
        $("#btnToggleLeap").html('Enable Leap').click(enableLeap);
    };

    var penUp = function (e) {
        motorService.penUp(done, fail);
    };

    var penDown = function (e) {
        var x = $('#txtX').val();
        var y = $('#txtY').val();

        if(runLogInterval === false){
            $("#txtLog").val($("#txtLog").val() + "[" + x + "," + y + "]\n");
        }

        motorService.penDown(done, fail);
    };

    var unlockMotors = function (e) {
        motorService.unlockMotors(done, fail);
    };

    var gotPosition = function (x, y, isTouching) {
        $('#txtX').val(Math.round(x) - 599);
        $('#txtY').val(Math.round(y) - 435);

        if (isTouching) {
            penDown();
        } else {
            penUp();
        }

        goTo();
    };

    var goToFixed = function (e) {
        $('#txtX').val($(this).data('routeX'));
        $('#txtY').val($(this).data('routeY'));

        goTo();
    };

    var goTo = function (e) {
        var x = $('#txtX').val();
        var y = $('#txtY').val();

        var pencilPosition = $("#spnPencil").position();
        var newTop = ((Number(x) + 600) / 2);
        var newLeft = ((Number(y) + 436) / 2);

        var distance = Number(Math.sqrt(Math.pow(newTop - pencilPosition.top, 2) + Math.pow(newLeft - pencilPosition.left, 2)));

        $("#spnPencil").animate({top: newTop + "px", left: newLeft + "px"}, distance * 13, "linear", pencilReachedToTarget);

        motorService.goTo(x, y, done, fail);
    };

    var pencilReachedToTarget = function() {
        if(runLogInterval !== false){
            penDown();
            setTimeout(penUpAfter, 500);
            
        }
    };

    var penUpAfter = function(){
        penUp();

        logStep++;
        console.log('total:' + totalStep + ' step:' + logStep);
        if(totalStep <= logStep){
            stopRunningLog();
        } else {
            setTimeout(processNextStep, 1000);
        }
    };

    var done = function (data) {
        console.log(data);
    };

    var fail = function (data) {
        console.log(data.responseText);
    };

    //--------------------
    // GET USER MEDIA CODE
    //--------------------
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    var video;
    var webcamStream;

    function startWebcam() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia(

                // constraints
                {
                    video: true,
                    audio: false
                },

                // successCallback
                function (localMediaStream) {
                    video = document.querySelector('video');

                    if (window.webkitURL) {
                        video.srcObject = localMediaStream;
                    } else {
                        video.src = stream;
                    }

                    webcamStream = localMediaStream;
                },

                // errorCallback
                function (err) {
                    console.log("The following error occured: " + err);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }

    }

    var canvas, ctx;

    function initCam() {
        // Get the canvas and obtain a context for
        // drawing in it
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');

        startWebcam();
    }

    function snapshot() {
        // Draws current image from the video element into the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    //document.addEventListener("DOMContentLoaded", init);

    function sendToServer() {
        
        snapshot();

        var image = document.getElementById("canvas").toDataURL("image/png");
        image = image.replace('data:image/png;base64,', '');
        $.ajax({
            type: 'POST',
            url: '/Home/PredictImageContentsAsync',
            data: '{ "imageData" : "' + image + '" }',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    if (data.tagName === $("#txtTag").val()) {
                        if (data.probability > 0.9) {
                            alert("it works sire!");
                        } else {
                            alert("it looks like working but I am wrong " + Number((1 - data.probability) * 100) + "%");
                        }
                    } else {
                        alert("it is not ended like you wanted! I am stuck at " + data.tagName);
                    }

                    console.log(JSON.stringify(data));
                }
            }
        });
    }

    return {
        init: init
    };
}(LeapService, MotorService);