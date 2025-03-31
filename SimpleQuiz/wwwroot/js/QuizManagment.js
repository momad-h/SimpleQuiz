const quizupdate = document.getElementById('quiz-update');
const quizadd = document.getElementById('quiz-add');
const selectElement = document.getElementById('quizSelect');
const titleName = document.getElementById('add-title-name');
const quizId = document.getElementById('quizId');
const quizFaName = document.getElementById('quizFaName');
const quizEnName = document.getElementById('quizEnName');
const quizType = document.getElementById('quizType');
const quizMinScore = document.getElementById('quizMinScore');
const quizNOQ = document.getElementById('quizNOQ');
const quizTime = document.getElementById('quizTime');
const quizNegativeScore = document.getElementById('quizNegativeScore');
const quizDescription = document.getElementById('quizDescription');
const quizManagmentSubmit = document.getElementById('quizManagmentSubmit');
const quizSelectForQuestion = document.getElementById('quizSelectForQuestion');


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
        quizId.value = 0;
        quizEnName.value = '';
        quizFaName.value = '';
        quizDescription.value = '';
        quizType.options[0].selected = true
        quizMinScore.value = '';
        quizNOQ.value = '';
        quizTime.value = '';
        quizNegativeScore.checked = false;
        selectElement.options[0].selected = true;
    }
}

if (selectElement) {
    selectElement.addEventListener("change", function () {
        const selectedValue = selectElement.value;
        if (selectedValue === "-1") {
            quizadd.style.display = 'none';
            titleName.innerHTML = 'ایجاد آزمون';
        } else {
            quizadd.style.display = 'block';
            titleName.innerHTML = 'ویرایش آزمون';
            const selectedQuiz = window.quizData.find(quiz => quiz.id == selectedValue);
            if (selectedQuiz) {
                quizId.value = selectedQuiz.id;
                quizFaName.value = selectedQuiz.quizFarsiName;
                quizEnName.value = selectedQuiz.quizName;
                quizDescription.value = selectedQuiz.description;
                for (var i = 0; i < quizType.options.length; i++) {
                    if (quizType.options[i].innerHTML == selectedQuiz.quizType) {
                        quizType.options[i].selected = true;
                        break;
                    }
                }
                quizMinScore.value = selectedQuiz.minScoreToPass;
                quizNOQ.value = selectedQuiz.numberOfQuestions;
                quizTime.value = selectedQuiz.quizTime;
                if (selectedQuiz.hasNegativeScore == 1)
                    quizNegativeScore.checked = true;
                else
                    quizNegativeScore.checked = false;
            }
        }
    });
} else {
    console.error('Element with ID "quizSelect" not found!');
}

quizManagmentSubmit.addEventListener('click', function () {
    const quizData = {
        ID:document.getElementById('quizId').value,
        QuizFarsiName: document.getElementById('quizFaName').value,
        QuizName: document.getElementById('quizEnName').value,
        Description: document.getElementById('quizDescription').value,
        QuizTypeID: document.getElementById('quizType').value,
        MinScoreToPass: document.getElementById('quizMinScore').value,
        NumberOfQuestions: document.getElementById('quizNOQ').value,
        QuizTime: document.getElementById('quizTime').value,
        HasNegativeScore: document.getElementById('quizNegativeScore').checked ? 1 : 0
    };

    const quizJson = JSON.stringify(quizData);
    console.log(quizJson);
    SendAddOrEditQuiz(quizJson);
});

async function SendAddOrEditQuiz(quizInfo) {
    const apiUrl = "/ManagmentApi/QuizManagerAsync"; // آدرس کنترلر یا API سمت سرور
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: quizInfo, // تبدیل به JSON اگر لازم است
            headers: {
                'Content-Type': 'application/json', // اضافه کردن Content-Type
                'X-Requested-With': 'XMLHttpRequest' // برای تشخیص درخواست AJAX در سمت سرور
            }
        });

        if (!response.ok) {
            throw new Error('خطا در ارتباط با سرور');
        }

        const data = await response.json();

        if (data.success) {
            AlertMessage('اطلاعات با موفقیت به‌روزرسانی شد.', 'success');
        }
    } catch (error) {
        AlertMessage('خطا در به‌روزرسانی اطلاعات: ' + error.message, 'error');
    }
}