var MotorService = function () {
    var cncServer = 'http://localhost:4242';

    var unlockMotors = function (done, fail) {
        console.log('unlockMotors');

        $.ajax({
            url: cncServer + "/v1/motors",
            method: "DELETE"
        })
            .done(done)
            .fail(fail);
    };

    var penDown = function (done, fail) {
        console.log('penDown');

        $.get({
            url: cncServer + "/pen.down"
        })
            .done(done)
            .fail(fail);
    };

    var penUp = function (done, fail) {
        console.log('penUp');

        $.get({
            url: cncServer + "/pen.up"
        })
            .done(done)
            .fail(fail);
    };

    var goTo = function (x, y, done, fail) {
        console.log('goTo');

        $.get({
            url: cncServer + '/coord/' + x + '/' + y
        })
            .done(done)
            .fail(fail);
    };

    return {
        unlockMotors: unlockMotors,
        penDown: penDown,
        penUp: penUp,
        goTo: goTo
    };
}();