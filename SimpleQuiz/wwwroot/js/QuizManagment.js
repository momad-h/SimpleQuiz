const quizupdate = document.getElementById('quiz-update');
const quizadd = document.getElementById('quiz-add');
const selectElement = document.getElementById('quizSelect');
const titleName = document.getElementById('add-title-name');
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
            document.getElementById('quizFaName').innerText = selectedQuiz.quizFarsiName;
            document.getElementById('quizEnName').innerText = selectedQuiz.quizName;
        }
    }
});
