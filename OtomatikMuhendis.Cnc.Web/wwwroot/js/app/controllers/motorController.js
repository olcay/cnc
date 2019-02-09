var MotorController = function (leapService, motorService) {
    var init = function (container) {
        $("#btnPenUp").click(penUp);
        $("#btnPenDown").click(penDown);
        $("#btnUnlockMotors").click(unlockMotors);
        $("#btnGoTo").click(goTo);

        $(".btnGoTo").click(goToFixed);
        $("#btnToggleLeap").click(enableLeap);

        leapService.init(gotPosition);
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

        motorService.goTo(x, y, done, fail);
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