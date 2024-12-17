// کنترل لاگین
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // فرض: شبیه‌سازی درخواست API
    if (username === "1" && password === "1") {
        
        // ذخیره اطلاعات کاربر
        sessionStorage.setItem("fullName", "کاربر تست");
        sessionStorage.setItem("username", username);
        // هدایت به صفحه آزمون
        window.location.href = "/Quiz/QuizOnline";
    } else {
        alert("نام کاربری یا رمز عبور اشتباه است.");
    }
}

// کنترل ثبت‌نام
function signup() {
    const fullName = document.getElementById("fullName").value;
    const signupUsername = document.getElementById("signupUsername").value;
    const signupPassword = document.getElementById("signupPassword").value;

    // فرض: شبیه‌سازی ثبت‌نام موفق
    alert("ثبت‌نام با موفقیت انجام شد! اکنون وارد شوید.");
    window.location.href = "/Quiz/Login";
}

// مقداردهی اطلاعات کاربر در صفحه آزمون
function loadUserInfo() {

    const fullName = sessionStorage.getItem("fullName");
    const username = sessionStorage.getItem("username");

    if (!fullName || !username) {
        //alert("لطفاً ابتدا وارد شوید.");
        window.location.href = "/Quiz/Login";
        return;
    }

    document.getElementById("userFullName").textContent = fullName;
    document.getElementById("userUsername").textContent = username;
}

// تایمر آزمون
let timerInterval;
function startTimer(duration) {
    const timerElement = document.getElementById("timeRemaining");
    let timeRemaining = duration;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeRemaining === 60) {
            alert("تنها یک دقیقه به پایان آزمون باقی مانده است!");
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("زمان آزمون به پایان رسید!");
            document.getElementById("submitQuizButton").disabled = true;
        }

        timeRemaining--;
    }, 1000);
}

// ارسال آزمون
//function submitQuiz() {
//    // انتخاب تمام سوالات
//    const form = document.getElementById("quizForm");
//    const formData = new FormData(form);
//    const results = [];

//    // پردازش پاسخ‌ها
//    for (const [key, value] of formData.entries()) {
//        // پیدا کردن سوال مرتبط با استفاده از name در تگ h5
//        const questionLabel = document.querySelector(`h5[name="${key}"]`).textContent;

//        // اضافه کردن به نتایج
//        results.push({
//            questionId: key, // شناسه سوال
//            questionText: questionLabel, // متن سوال
//            answer: value || "پاسخ داده نشده" // پاسخ کاربر
//        });
//    }

//    // ارسال داده‌ها به سمت سرور
//    sendResultsToServer(results);

//    // نمایش نتیجه در صفحه
//    const resultSection = document.querySelector(".result-section");
//    const resultList = results.map(result => `<li><strong>${result.questionText}</strong>: - پاسخ شما: گزینه  ${result.answer}</li>`).join('');
//    resultSection.innerHTML = `
//        <h3 class="text-success">آزمون با موفقیت ثبت شد!</h3>
//        <ul>${resultList}</ul>
//    `;

//    // نمایش بخش نتیجه
//    resultSection.style.display = "block";
//}

//function sendResultsToServer(results) {
//    const apiUrl = "/qApi/QuizApi/SendResultToServer"; // آدرس کنترلر یا API سمت سرور
//    debugger;
//    fetch(apiUrl, {
//        method: "POST", // ارسال درخواست POST
//        headers: {
//            "Content-Type": "application/json", // نوع داده ارسالی JSON
//        },
//        body: JSON.stringify({ answers: results }) // تبدیل داده‌ها به JSON
//    })
//        .then(response => {
//            if (response.ok) {
//                return response.json(); // پاسخ از سرور
//            } else {
//                throw new Error("ارسال به سرور با خطا مواجه شد.");
//            }
//        })
//        .then(data => {
//            console.log("پاسخ از سرور:", data);
//            alert("پاسخ‌ها با موفقیت ثبت شدند!");
//        })
//        .catch(error => {
//            console.error("خطا در ارسال به سرور:", error);
//            alert("خطا در ارسال پاسخ‌ها به سرور.");
//        });
//}
function submitQuiz() {
    // انتخاب تمام سوالات
    const form = document.getElementById("quizForm");
    const formData = new FormData(form);
    const results = [];

    const userInfo = {
        fullName: document.getElementById("userFullName").textContent,
        username: document.getElementById("userUsername").textContent
    };

    // پردازش پاسخ‌ها و جمع‌آوری داده‌ها برای ارسال به سرور
    for (const [key, value] of formData.entries()) {
        // پیدا کردن سوال مرتبط با استفاده از name در تگ h5
        const questionLabel = document.querySelector(`h5[name="${key}"]`).textContent;

        // اضافه کردن به نتایج
        results.push({
            questionId: key, // شناسه سوال
            questionText: questionLabel, // متن سوال
            answer: value || "پاسخ داده نشده" // پاسخ کاربر
        });
    }

    // ارسال داده‌ها به سمت سرور
    sendResultsToServer(results, userInfo);
}

function sendResultsToServer(results, userInfo) {
    
    const apiUrl = "/qApi/QuizApi/SendResultToServer"; // آدرس کنترلر یا API سمت سرور
    fetch(apiUrl, {
        method: "POST", // ارسال درخواست POST
        headers: {
            "Content-Type": "application/json", // نوع داده ارسالی JSON
        },
        body: JSON.stringify({ answers: results }) // تبدیل داده‌ها به JSON
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // پاسخ از سرور
            } else {
                throw new Error("ارسال به سرور با خطا مواجه شد.");
            }
        })
        .then(data => {
            console.log("پاسخ از سرور:", data);

            // نمایش نتایج بر اساس پاسخ API
            showResults(data.results, userInfo);
        })
        .catch(error => {
            console.error("خطا در ارسال به سرور:", error);
            alert("خطا در ارسال پاسخ‌ها به سرور.");
        });
}

//function showResults(results) {
//    const resultSection = document.querySelector(".result-section");
//    debugger;
//    // ایجاد لیست نمایش نتایج
//    const resultList = results.map(result => `
//        <li style="color: ${result.isCorrect ? 'green' : 'red'}">
//            <strong>${result.questionText}</strong>:
//            - پاسخ شما: گزینه ${result.answer}
//            ${!result.isCorrect ? ' (پاسخ شما اشتباه است)' : ''}
//        </li>
//    `).join('');

//    // نمایش پیام و لیست نتایج
//    resultSection.innerHTML = `
//        <h3 class="text-success">نتایج آزمون:</h3>
//        <ul>${resultList}</ul>
//    `;

//    // نمایش بخش نتیجه
//    resultSection.style.display = "block";
//}

function showResults(results, userInfo) {
    const totalQuestions = results.length;
    const answeredQuestions = results.filter(result => result.answer).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passStatus = score >= 70 ? "قبول" : "مردود";

    const popupContent = `
        <!DOCTYPE html>
        <html lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>نتایج آزمون</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                @font-face {
                    font-family: 'B Titr';
                    }
                body {
                    font-family: Tahoma, Arial, sans-serif;
                    direction: rtl;
                    text-align: right;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    margin-top: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                .header, .footer {
                    font-family: 'B Titr', Arial, sans-serif;
                    text-align: center;
                    padding: 15px;
                    background-color: #007bff;
                    color: #fff;
                    border-radius: 8px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9rem;
                }
                .results-header {
                    font-family: 'B Nazanin', Arial, sans-serif;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .result-list {
                    padding: 0;
                    list-style: none;
                }
                .result-list li {
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .result-list li.correct {
                    background-color: #d4edda;
                    color: #155724;
                }
                .result-list li.incorrect {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                .info-card {
                    margin-bottom: 15px;
                }
                .buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>نتایج آزمون</h1>
                </div>
                <div class="row mb-4">
                    <div class="col-md-6 info-card">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">اطلاعات کاربر</h5>
                                <p class="card-text">نام و نام خانوادگی: ${userInfo.fullName}</p>
                                <p class="card-text">نام کاربری: ${userInfo.username}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 info-card">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">وضعیت آزمون</h5>
                                <p class="card-text">تعداد کل سوالات: ${totalQuestions}</p>
                                <p class="card-text">تعداد پاسخ داده شده: ${answeredQuestions}</p>
                                <p class="card-text">تعداد پاسخ نداده: ${unansweredQuestions}</p>
                                <p class="card-text">تعداد پاسخ صحیح: ${correctAnswers}</p>
                                <p class="card-text">تعداد پاسخ غلط: ${incorrectAnswers}</p>
                                <p class="card-text">نمره: ${score}٪</p>
                                <p class="card-text ${passStatus === "قبول" ? 'text-success' : 'text-danger'}">وضعیت: ${passStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="results-header">
                    <h2>بررسی پاسخ‌های شما</h2>
                </div>
                <ul class="result-list">
                    ${results.map(result => `
                        <li class="${result.isCorrect ? 'correct' : 'incorrect'}">
                            <strong>${result.questionText}</strong><br>
                            پاسخ شما: گزینه ${result.answer}
                            ${!result.isCorrect ? '<br><small>(پاسخ شما اشتباه است)</small>' : ''}
                        </li>
                    `).join('')}
                </ul>
                <div class="buttons">
                    <button class="btn btn-success" onclick="window.print()">چاپ نتایج</button>
                    <button class="btn btn-danger" onclick="window.close()">بستن</button>
                </div>
                <div class="footer">
                    <p>© ۲۰۲۴ سامانه آزمون آنلاین</p>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;

    // باز کردن پاپ‌آپ
    const popupWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes,resizable=yes');
    if (popupWindow) {
        popupWindow.document.open();
        popupWindow.document.write(popupContent);
        popupWindow.document.close();
    } else {
        alert("باز کردن پاپ‌آپ ممکن نیست. لطفاً پاپ‌آپ را فعال کنید.");
    }
}


// مقداردهی اولیه در صفحه آزمون
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname==="/Quiz/QuizOnline") {
        loadUserInfo();
        startTimer(300); // تایمر 5 دقیقه
    }
});
