(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function () {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

(function () {
    var canvas = $('#canvas');
    if (!canvas[0].getContext) {
        $("#error").show();
        return false;
    }

    var baseWidth = 1100;
    var baseHeight = 680;

    canvas.attr("width", baseWidth);
    canvas.attr("height", baseHeight);

    var opts = {
        seed: {
            x: baseWidth / 2 - 20,
            color: "rgb(190, 26, 37)",
            scale: 4
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 150,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    };

    var tree = new Tree(canvas[0], baseWidth, baseHeight, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    function getCanvasPos(e) {
        var rect = canvas[0].getBoundingClientRect();
        var clientX, clientY;
        var oe = e.originalEvent || e;
        if (oe.touches && oe.touches.length > 0) {
            clientX = oe.touches[0].clientX;
            clientY = oe.touches[0].clientY;
        } else if (oe.changedTouches && oe.changedTouches.length > 0) {
            clientX = oe.changedTouches[0].clientX;
            clientY = oe.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        return {
            x: (clientX - rect.left) * (canvas[0].width / rect.width),
            y: (clientY - rect.top) * (canvas[0].height / rect.height)
        };
    }

    function handleStart(e) {
        var pos = getCanvasPos(e);
        if (seed.hover(pos.x, pos.y)) {
            if (e.cancelable) e.preventDefault();
            hold = 0;
            canvas.off("click touchstart", handleStart);
            canvas.off("mousemove touchmove", handleMove);
            canvas.removeClass('hand');
        }
    }

    function handleMove(e) {
        var pos = getCanvasPos(e);
        canvas.toggleClass('hand', seed.hover(pos.x, pos.y));
    }

    canvas.on("click touchstart", handleStart);
    canvas.on("mousemove touchmove", handleMove);

    $(document).keydown(function(e) {
        if (e.keyCode == 13) {
            if (hold) {
                hold = 0;
                canvas.off("click touchstart", handleStart);
                canvas.off("mousemove touchmove", handleMove);
                canvas.removeClass('hand');
            }
        }
    });

    var seedAnimate = eval(Jscex.compile("async", function () {
        seed.draw();
        while (hold) {
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canScale()) {
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        var isMobile = $(window).width() <= 768;
        if (!isMobile) {
            tree.snapshot("p1", 240, 0, 610, 680);
            while (tree.move("p1", 500, 0)) {
                foot.draw();
                $await(Jscex.Async.sleep(10));
            }
            foot.draw();
        }
        // Guardamos la captura del árbol completo armado en "tree_final"
        tree.snapshot("tree_final", 0, 0, baseWidth, baseHeight);
        $await(Jscex.Async.sleep(100));
    }));

    var jumpAnimate = eval(Jscex.compile("async", function () {
        while (true) {
            tree.ctx.clearRect(0, 0, baseWidth, baseHeight);
            // Redibujamos la captura del árbol en cada fotograma
            tree.draw("tree_final");
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile("async", function () {
        $("#code").show().typewriter();
    }));

    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());
        textAnimate().start();
        $await(jumpAnimate());
    }));

    runAsync().start();
})();
