document.addEventListener("DOMContentLoaded", () => {
    const createQuizPage = document.getElementById("create-quiz-page");
    const manageQuestionsPage = document.getElementById("manage-questions-page");

    if (createQuizPage) {
        // کد مربوط به صفحه ایجاد آزمون
        document.getElementById('quiz-action').addEventListener('change', (e) => {
            document.getElementById('new-quiz-form').style.display = e.target.value === 'create' ? 'block' : 'none';
        });

        document.getElementById('create-quiz-btn').addEventListener('click', () => {
            const quizData = {
                name: document.getElementById('quiz-name').value,
                questions: parseInt(document.getElementById('question-count').value),
                duration: parseInt(document.getElementById('quiz-duration').value),
                negativeMarking: document.getElementById('negative-marking').value === 'yes',
                finalScore: parseInt(document.getElementById('final-score').value),
                level: document.getElementById('quiz-level').value,
                topic: document.getElementById('quiz-topic').value
            };

            fetch('http://momad.ir/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quizData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Quiz created successfully! Quiz ID: ${data.QuizID}`);
                    window.location.href = `manage_questions.html?QuizID=${data.QuizID}`;
                }
            });
        });
    }

    if (manageQuestionsPage) {
        // کد مربوط به صفحه مدیریت سوالات
        document.getElementById('select-quiz').addEventListener('change', (e) => {
            document.getElementById('question-form').style.display = e.target.value ? 'block' : 'none';
        });

        document.getElementById('question-type').addEventListener('change', (e) => {
            const mcqOptions = document.getElementById('mcq-options');
            const textQuestion = document.getElementById('text-question');
            if (e.target.value === 'mcq') {
                mcqOptions.style.display = 'block';
                textQuestion.style.display = 'none';
            } else {
                mcqOptions.style.display = 'none';
                textQuestion.style.display = 'block';
            }
        });

        document.getElementById('submit-question').addEventListener('click', () => {
            const selectedQuiz = document.getElementById('select-quiz').value;
            const questionType = document.getElementById('question-type').value;
            let questionData;

            if (questionType === 'mcq') {
                questionData = {
                    quizID: selectedQuiz,
                    type: 'mcq',
                    options: [
                        document.getElementById('option-1').value,
                        document.getElementById('option-2').value,
                        document.getElementById('option-3').value,
                        document.getElementById('option-4').value
                    ],
                    correctOption: parseInt(document.getElementById('correct-option').value)
                };
            } else {
                questionData = {
                    quizID: selectedQuiz,
                    type: 'text',
                    answer: document.getElementById('text-answer').value
                };
            }

            fetch('http://momad.ir/api/insertorupdate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Question saved successfully!');
                }
            });
        });
        document.addEventListener("DOMContentLoaded", () => {
            const questionList = document.getElementById('question-list');
            const questionForm = document.getElementById('questionForm');
        
            // افزودن سوال جدید
            document.getElementById('submit-question').addEventListener('click', () => {
                const questionText = document.getElementById('question-text').value;
                const questionType = document.getElementById('question-type').value;
        
                // ذخیره سوال
                const question = {
                    text: questionText,
                    type: questionType,
                    options: questionType === 'mcq' ? [
                        document.getElementById('option-1').value,
                        document.getElementById('option-2').value,
                        document.getElementById('option-3').value,
                        document.getElementById('option-4').value
                    ] : null,
                    correctOption: questionType === 'mcq' ? document.getElementById('correct-option').value : null,
                    answer: questionType === 'text' ? document.getElementById('text-answer').value : null
                };
        
                // افزودن به لیست نمایش
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = question.text;
                li.addEventListener('click', () => {
                    // پر کردن فرم برای ویرایش
                    document.getElementById('question-text').value = question.text;
                    document.getElementById('question-type').value = question.type;
        
                    if (question.type === 'mcq') {
                        document.getElementById('option-1').value = question.options[0];
                        document.getElementById('option-2').value = question.options[1];
                        document.getElementById('option-3').value = question.options[2];
                        document.getElementById('option-4').value = question.options[3];
                        document.getElementById('correct-option').value = question.correctOption;
                        document.getElementById('mcq-options').style.display = 'block';
                        document.getElementById('text-question').style.display = 'none';
                    } else {
                        document.getElementById('text-answer').value = question.answer;
                        document.getElementById('mcq-options').style.display = 'none';
                        document.getElementById('text-question').style.display = 'block';
                    }
                });
        
                questionList.appendChild(li);
                alert('سوال ذخیره شد!');
            });
        });
        
    }
});
