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

        leapService.init(gotPosition);
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
        totalStep = splitted.length;
        var position = JSON.parse(splitted[logStep]);

        $('#txtX').val(position[0]);
        $('#txtY').val(position[1]);

        goTo();
        
     };

    var stopRunningLog = function() {
        $("#btnRunLog").removeClass("btn-danger").addClass("btn-success").html("Run Log").unbind().click(runLog);

        runLogInterval = false;
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

    return {
        init: init
    };
}(LeapService, MotorService);