/*jslint browser:true */
/*global alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
var quiz = {},
    arrQuestions = [],
    num = 0,
    score = 0,
    breakBoot = false,
    checkOfTickStatement = 0,
    checkBuzzerStatement = 0,
    answerBeforeTimesUp;