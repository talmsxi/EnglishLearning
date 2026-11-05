const words = ['rowspan', 'colspan', 'variable', 'function', 'array',
               'string', 'number', 'loop', 'condition', 'event',
               'button', 'selector', 'class', 'attribute', 'value',
               'index', 'library', 'browser', 'table', 'style'];

const translations = ['об\'єднання рядків', 'об\'єднання стовпців', 'змінна', 'функція', 'масив',
                      'рядок', 'число', 'цикл', 'умова', 'подія',
                      'кнопка', 'селектор', 'клас', 'атрибут', 'значення',
                      'індекс', 'бібліотека', 'браузер', 'таблиця', 'стиль'];

const total = 20;
const pause = 2500;

let order = [];
let answers = [];
let marks = [];
let step = 0;
let rightCount = 0;
let wrongCount = 0;
let waiting = false;

$(function () {
    $("#card").on("click", checkWord);
    $("#prev").on("click", goPrev);
    $("#next").on("click", goNext);
    $("#restart").on("click", newGame);

    $(document).on("keydown", function (event) {
        if (event.keyCode == 13) {
            checkWord();
        }
    });

    newGame();
});

function clean(text) {
    return text.trim().toLowerCase().replace('’', '\'').replace('ʼ', '\'');
}

function alreadyUsed(name) {
    for (let i = 0; i < order.length; i = i + 1) {
        if (order[i] == name) {
            return true;
        }
    }
    return false;
}

function makeOrder() {
    order = [];

    while (order.length < total) {
        let number = Math.floor(Math.random() * words.length);

        if (alreadyUsed(number) == false) {
            order[order.length] = number;
        }
    }
}

function showStep() {
    let number = order[step];

    $("#word").text(words[number]);
    $("#step").text((step + 1) + " / " + total);
    $("#answer").val(answers[step]);
    $("#message").text("");

    $("#card").removeClass("right");
    $("#card").removeClass("wrong");

    if (marks[step] == "right") {
        $("#card").addClass("right");
        $("#status").text("Переклад правильний");
        $("#status").css("color", "#2e8b57");
    }
    else if (marks[step] == "wrong") {
        $("#card").addClass("wrong");
        $("#status").text("Правильно: " + translations[number]);
        $("#status").css("color", "#c0392b");
    }
    else {
        $("#status").text("");
    }
}

function checkWord() {
    if ($("#modal").hasClass("open")) {
        return;
    }

    if (waiting) {
        return;
    }

    if (marks[step] != "") {
        $("#message").text("Це слово вже перевірено");
        return;
    }

    let text = $("#answer").val();

    if (text.trim() == "") {
        $("#message").text("Спочатку введіть переклад");
        return;
    }

    let number = order[step];
    answers[step] = text;

    if (clean(text) == clean(translations[number])) {
        marks[step] = "right";
        rightCount = rightCount + 1;
    }
    else {
        marks[step] = "wrong";
        wrongCount = wrongCount + 1;
    }

    $("#rightCount").text(rightCount);
    $("#wrongCount").text(wrongCount);

    showStep();

    waiting = true;

    setTimeout(function () {
        waiting = false;

        if (rightCount + wrongCount == total) {
            showLevel();
        }
        else {
            goNext();
        }
    }, pause);
}

function goPrev() {
    if (waiting) {
        return;
    }

    if (step > 0) {
        step = step - 1;
        showStep();
    }
}

function goNext() {
    if (waiting) {
        return;
    }

    if (step < total - 1) {
        step = step + 1;
        showStep();
    }
}

function showLevel() {
    let level = "Beginner";

    if (rightCount >= 18) {
        level = "Advanced";
    }
    else if (rightCount >= 14) {
        level = "Upper-Intermediate";
    }
    else if (rightCount >= 10) {
        level = "Intermediate";
    }
    else if (rightCount >= 6) {
        level = "Elementary";
    }

    $("#level").text(level);
    $("#modalText").text("Правильних перекладів: " + rightCount + " з " + total);
    $("#modal").addClass("open");
}

function newGame() {
    step = 0;
    rightCount = 0;
    wrongCount = 0;
    waiting = false;
    answers = [];
    marks = [];

    for (let i = 0; i < total; i = i + 1) {
        answers[i] = "";
        marks[i] = "";
    }

    makeOrder();

    $("#rightCount").text("0");
    $("#wrongCount").text("0");
    $("#modal").removeClass("open");

    showStep();
}
