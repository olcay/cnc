var LeapService = function () {
    var continueLoop = false;
    var appWidth = 1200;
    var appHeight = 872;

    function disableLeap() {
        continueLoop = false;
    }

    function enableLeap() {
        continueLoop = true;
    }
    
    function init(done) {
        var controllerOptions = { enableGestures: false };

        Leap.loop(controllerOptions,
            function (frame) {
                if (continueLoop) {
                    var iBox = frame.interactionBox;
                    var pointable = frame.pointables[0];

                    if (pointable && (frame.id % 100 === 0)) {

                        var leapPoint = pointable.stabilizedTipPosition;
                        var normalizedPoint = iBox.normalizePoint(leapPoint, true);

                        var appX = normalizedPoint[0] * appWidth;
                        var appY = (1 - normalizedPoint[1]) * appHeight;
                        var touchZone = pointable.touchZone;

                        console.log(appX + ', ' + appY);
                        console.log(touchZone);

                        done(appX, appY, touchZone === 'touching');
                    }
                }
            });
    }

    return {
        init: init,
        enableLeap: enableLeap,
        disableLeap: disableLeap
    };
}();