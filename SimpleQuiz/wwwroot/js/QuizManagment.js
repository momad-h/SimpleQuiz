const quizupdate = document.getElementById('quiz-update');
const quizadd = document.getElementById('quiz-add');
const selectElement = document.getElementById('quizSelect');
const titleName = document.getElementById('add-title-name');
const quizFaName = document.getElementById('quizFaName');
const quizEnName = document.getElementById('quizEnName');
const quizType = document.getElementById('quizType');
const quizMinScore = document.getElementById('quizMinScore');
const quizNOQ = document.getElementById('quizNOQ');
const quizTime = document.getElementById('quizTime');
const quizNegativeScore = document.getElementById('quizNegativeScore');

function SelectQuizAddOrUpdate() {
    const radioButtons = document.querySelectorAll('input[name="quizmanagment"]');

    // بررسی اینکه آیا هر کدام از دکمه‌ها انتخاب شده است
    let selectedValue = null;
    radioButtons.forEach(radioButton => {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
        }
    });

    // اگر دکمه‌ای انتخاب شده بود، اکشن مورد نظر را انجام دهید
    if (selectedValue === 'quiz-update') {
        quizupdate.style.display = 'block';
        quizadd.style.display = 'none';
    } else if (selectedValue === 'quiz-add') {
        quizupdate.style.display = 'none';
        quizadd.style.display = 'block';
        titleName.innerHTML = 'ایجاد آزمون';
        quizEnName.value = '';
        quizFaName.value = '';
        quizType.options[0].selected = true
        quizMinScore.value = '';
        quizNOQ.value = '';
        quizTime.value = '';
        quizNegativeScore.checked = false;
        selectElement.options[0].selected = true;

    }
}


selectElement.addEventListener('change', function () {
    const selectedValue = selectElement.value;

    if (selectedValue === "-1") {
        quizadd.style.display = 'none';
        titleName.innerHTML = 'ایجاد آزمون';
    } else {
        quizadd.style.display = 'block';
        titleName.innerHTML = 'ویرایش آزمون';
        const selectedQuiz = window.quizData.find(quiz => quiz.id == selectedValue);
        if (selectedQuiz) {
            quizFaName.value = selectedQuiz.quizFarsiName;
            quizEnName.value = selectedQuiz.quizName;
            for (var i = 0; i < quizType.options.length; i++) {
                if (quizType.options[i].innerHTML == selectedQuiz.quizType) {
                    quizType.options[i].selected = true;
                    break;
                }
            }
            quizMinScore.value = selectedQuiz.minScoreToPass;
            quizNOQ.value = selectedQuiz.numberOfQuestions;
            quizTime.value = selectedQuiz.quizTime;
            if (selectedQuiz.negativeScore==1)
                quizNegativeScore.checked = true;
            else
                quizNegativeScore.checked = false;
        }
    }
});
