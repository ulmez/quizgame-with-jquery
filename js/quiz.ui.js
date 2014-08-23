/*jslint browser:true */
/*global checkBuzzerStatement: true, checkOfTickStatement: true, breakBoot: true, answerBeforeTimesUp: true, $: false, quiz: false, num: true, score: true, arrQuestions: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
quiz.ui = (function () {
    "use strict";
    return {
        loadSound: function loadGivenSound(soundId, delayTime) {
            var audio;
            setTimeout(function () {
                audio = document.querySelector(soundId);
                audio.load();
                audio.play();
            }, delayTime);
        },

        onStart: function startSequence() {
            var liWidth = 0,
                i;
            $("h1").text("Do you want to answer Arnolds questions?");

            $("#correctAnswer").hide();

            for (i = 0; i < 3; i = i + 1) {
                $("#answer" + i).hide();
            }

            $("#con").css({
                left: ($(window).width() / 2) - 300
            });

            liWidth = $("#yes").width() + $("#no").width() + 40;

            $(".menupos").width(liWidth);

            $("#con").animate({
                left: "-=" + $(window).width() + "px"
            }, 0).animate({
                left: "+=" + $(window).width() + "px"
            }, 1000);

            quiz.ui.loadSound("#questions", 1000);
        },

        tickMaintenance: function boot() {
            var liWidth = 0,
                i;
            breakBoot = false;
            (function boot() {
                if (checkOfTickStatement === 0 && checkBuzzerStatement === 0) {
                    quiz.ui.loadSound("#buzzer", 0);
                }

                if (breakBoot) {
                    return false;
                }

                if (num < arrQuestions.length - 1) {
                    quiz.ui.loadSound("#nightmare", 5000);
                }

                $("#correctAnswer").show();
                $("#correctAnswer").text("To late, the right answer is: " + quiz.logic.correctAnswer(num));
                if ($("#buttonBlocker").hasClass("menu")) {
                    $("#buttonBlocker").removeClass("menu");
                    $("#buttonBlocker").addClass("blocked");
                    setTimeout(function () {
                        $("#correctAnswer").hide();
                    }, 3000);
                    $("#con").delay(3000).animate({
                        left: "-=" + $(window).width() + "px"
                    }, 1000).animate({
                        left: "+=" + $(window).width() + "px"
                    }, 1000);

                    setTimeout(function () {
                        $("#buttonBlocker").removeClass("blocked");
                        $("#buttonBlocker").addClass("menu");
                    }, 4000);

                    if (num < arrQuestions.length - 1) {
                        num += 1;
                    } else {
                        num = 0;
                        setTimeout(function () {
                            $("body").removeClass("arnold");
                            if (score > 0) {
                                $("body").addClass("average");
                                quiz.ui.loadSound("#talkhand", 1000);
                                $("h1").html("Pretty good but you are not a terminator.<br />Your final score is: " + score + " of " + arrQuestions.length + "<br />Do you want to play again?");
                            } else {
                                quiz.ui.loadSound("#discipline", 1000);
                                $("body").addClass("totalrecall");
                                $("h1").html("Your final score is: " + score + " of " + arrQuestions.length + "<br />Arnold is very disappointed with you!<br />Do you want to play again?");
                            }
                            score = 0;
                            liWidth = $("#yes").width() + $("#no").width() + 40;
                            $(".menupos").width(liWidth);
                            for (i = 0; i < 3; i = i + 1) {
                                $("#answer" + i).hide();
                            }
                            $("#yes").show();
                            $("#no").show();
                        }, 4000);
                        return false;
                    }

                    if (num !== 0) {
                        setTimeout(function () {
                            $("h1").text(quiz.logic.questionText(num));
                            arrQuestions[num].answers = _.shuffle(arrQuestions[num].answers);
                            liWidth = 0;
                            for (i = 0; i < 3; i = i + 1) {
                                $("#answer" + i).text(quiz.logic.questionAnswers(num)[i]);
                                liWidth += $("#answer" + i).width() + 20;
                            }
                            $(".menupos").width(liWidth);
                        }, 4000);
                    }
                }
                setTimeout(boot, 23500);
            }());
        },

        answers: function setAnswers() {
            var liWidth = 0,
                numWhiteSpaces,
                whiteSpaceTotalWidth = 0,
                tempString,
                i;

            $("#yes").hide();
            $("#no").hide();

            for (i = 0; i < 3; i = i + 1) {
                $("#answer" + i).show();
            }

            $("h1").text(quiz.logic.questionText(num));

            arrQuestions[num].answers = _.shuffle(arrQuestions[num].answers);

            for (i = 0; i < 3; i = i + 1) {
                $("#answer" + i).text(quiz.logic.questionAnswers(num)[i]);
                tempString = $("#answer" + i).text();
                numWhiteSpaces = tempString.split(" ").length - 1;
                whiteSpaceTotalWidth += numWhiteSpaces * 6;

                liWidth += $("#answer" + i).width() + whiteSpaceTotalWidth + 20;
            }

            $(".menupos").width(liWidth);

            quiz.ui.loadSound("#nightmare", 1000);

            answerBeforeTimesUp = setTimeout(function () {
                quiz.ui.tickMaintenance();
            }, 19500);

            $("li").each(function (index) {
                $("#answer" + index).click(function () {
                    if ($("#buttonBlocker").hasClass("menu")) {
                        checkOfTickStatement = 1;
                        breakBoot = true;

                        $('#nightmare')[0].pause();

                        clearTimeout(answerBeforeTimesUp);
                        answerBeforeTimesUp = "";

                        if (num < arrQuestions.length - 1) {
                            quiz.ui.loadSound("#nightmare", 5000);
                            answerBeforeTimesUp = setTimeout(function () {
                                checkOfTickStatement = 0;
                                quiz.ui.tickMaintenance();
                            }, 23500);
                        }

                        $("#buttonBlocker").removeClass("menu");
                        $("#buttonBlocker").addClass("blocked");
                        if ($(this).text() === quiz.logic.correctAnswer(num)) {
                            score += 1;
                            quiz.ui.loadSound("#affirmative", 0);
                            $("#correctAnswer").text("That was correct!");
                        } else {
                            quiz.ui.loadSound("#nodeal", 0);
                            $("#correctAnswer").text("Wrong, the right answer is: " + quiz.logic.correctAnswer(num));
                        }
                        $("#correctAnswer").show();
                        setTimeout(function () {
                            $("#correctAnswer").hide();
                        }, 3000);
                        $("#con").delay(3000).animate({
                            left: "-=" + $(window).width() + "px"
                        }, 1000).animate({
                            left: "+=" + $(window).width() + "px"
                        }, 1000);
                        setTimeout(function () {
                            $("#buttonBlocker").removeClass("blocked");
                            $("#buttonBlocker").addClass("menu");
                            if (num < arrQuestions.length - 1) {
                                num += 1;
                            } else {
                                num = 0;
                                if (score < arrQuestions.length && score > 0) {
                                    $("body").removeClass("arnold");
                                    $('body').addClass("average");
                                    quiz.ui.loadSound("#talkhand", 1000);
                                    $("h1").html("Pretty good but you are not a terminator.<br />Your final score is: " + score + " of " + arrQuestions.length + "<br />Do you want to play again?");
                                } else if (score === arrQuestions.length) {
                                    quiz.ui.loadSound("#hastalavista", 1000);
                                    $("body").removeClass("arnold");
                                    $('body').addClass("terminator");
                                    $("h1").html("Your final score is: " + score + " of " + arrQuestions.length + "<br />Well done! You're a real Terminator!<br />Do you want to play again?");
                                } else {
                                    quiz.ui.loadSound("#discipline", 1000);
                                    $("body").removeClass("arnold");
                                    $('body').addClass("totalrecall");
                                    $("h1").html("Your final score is: " + score + " of " + arrQuestions.length + "<br />Arnold is very disappointed with you!<br />Do you want to play again?");
                                }
                                score = 0;
                                liWidth = $("#yes").width() + $("#no").width() + 40;
                                $(".menupos").width(liWidth);
                                for (i = 0; i < 3; i = i + 1) {
                                    $("#answer" + i).hide();
                                }
                                $("#yes").show();
                                $("#no").show();
                            }
                            if (num !== 0) {
                                $("h1").text(quiz.logic.questionText(num));
                                arrQuestions[num].answers = _.shuffle(arrQuestions[num].answers);
                                liWidth = 0;
                                for (i = 0; i < 3; i = i + 1) {
                                    $("#answer" + i).text(quiz.logic.questionAnswers(num)[i]);
                                    liWidth += $("#answer" + i).width() + 20;
                                }
                                $(".menupos").width(liWidth);
                            }
                        }, 4000);
                    }
                });
            });

            $("#correctAnswer").text(quiz.logic.correctAnswer(num));
        },

        play: function playYesNo() {
            $("#yes").click(function () {
                checkOfTickStatement = 0;
                checkBuzzerStatement = 1;

                setTimeout(function () {
                    checkBuzzerStatement = 0;
                }, 18500);

                arrQuestions = _.shuffle(arrQuestions);
                $("body").removeClass("terminator");
                $("body").removeClass("totalrecall");
                $("body").removeClass("average");
                $("body").addClass("arnold");
                $("#con").animate({
                    left: "-=" + $(window).width() + "px"
                }, 1000).animate({
                    left: "+=" + $(window).width() + "px"
                }, 1000);
                setTimeout(function () {
                    quiz.ui.answers();
                }, 1000);
            });

            $("#no").click(function () {
                setTimeout(function () {
                    $("body").removeClass("arnold");
                    $("body").removeClass("terminator");
                    $("body").removeClass("totalrecall");
                    $("body").removeClass("average");
                    $("body").addClass("busharnold");
                    quiz.ui.loadSound("#sadtrombone", 1000);
                }, 1000);

                $("#con").animate({
                    left: "-=" + $(window).width() + "px"
                }, 1000).animate({
                    left: "+=" + $(window).width() + "px"
                }, 1000);
                setTimeout(function () {
                    $("#yes").hide();
                    $("#no").hide();
                    $("h1").html("You are not a Terminator,<br />you are a bush");
                }, 1000);
            });
        },

        resizeWindow: function onResizeWindow() {
            $(window).resize(function () {
                $("#con").css({
                    left: ($(window).width() / 2) - 300
                });
            });
        }
    };
}());