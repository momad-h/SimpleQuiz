// کنترل لاگین
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userInfos = {
        UserName: username,
        Password: password
    };
    const userInfo = await loginApi(userInfos);
    // فرض: شبیه‌سازی درخواست API
    if (username.toLowerCase() === userInfo.userName.toLowerCase() && password === userInfo.password) {

        // ذخیره اطلاعات کاربر
        sessionStorage.setItem("fullName", userInfo.name);
        sessionStorage.setItem("username", userInfo.userName);
        // هدایت به صفحه آزمون
        //window.location.href = "/Quiz/QuizOnline";
        window.location.href = await generateLinkApi();
    } else {
        //alert("نام کاربری یا رمز عبور اشتباه است.");
        customAlert("خطا", "نام کاربری یا رمز عبور اشتباه است.", "error", false, "بستن");
    }
}

async function generateLinkApi() {
    const apiUrl = "/qApi/QuizApi/GenerateSecureLink"; // آدرس کنترلر یا API سمت سرور
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("ارسال به سرور با خطا مواجه شد.");
        }

        const data = await response.text(); // دریافت پاسخ به صورت رشته
        console.log("پاسخ از سرور:", data);
        return data; // بازگرداندن داده
    } catch (error) {
        console.error("خطا در ارسال به سرور:", error);
        alert("خطا در ارسال پاسخها به سرور.");
        throw error; // برای مدیریت خطا در فراخوانی تابع
    }
}

// کنترل ثبت‌نام
async function signup() {
    const fullName = document.getElementById("fullName").value;
    const signupUsername = document.getElementById("signupUsername").value;
    const signupPassword = document.getElementById("signupPassword").value;
    const signupRepeatPassword = document.getElementById("signupRepeatPassword").value;
    const signupEmail = document.getElementById("signupEmail").value;
    const signupMobile = document.getElementById("signupMobile").value;

    if (signupPassword === signupRepeatPassword) {
        const userSignup = {
            Name: fullName,
            UserName: signupUsername,
            Password: signupPassword,
            Email: signupEmail,
            Mobile: signupMobile
        };
        var userSignupRes = await signupApi(userSignup);
        if (userSignupRes===1) {
            alert("ثبت‌نام با موفقیت انجام شد! اکنون وارد شوید.");
            window.location.href = "/Quiz/Login";
        }
        else if (userSignupRes === -1) {
            alert("نام کاربری تکراری است");
        }
        else {
            alert("خطا در ثبت نام");
        }
    }
    else {
        alert("خطا");
    }
}
async function signupApi(userInfo) {
    const apiUrl = "/qApi/QuizApi/Signup"; // آدرس کنترلر یا API سمت سرور
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        });

        if (!response.ok) {
            throw new Error("ارسال به سرور با خطا مواجه شد.");
        }

        const data = await response.json(); // پاسخ JSON از سرور
        console.log("پاسخ از سرور:", data);
        return data; // بازگرداندن داده
    } catch (error) {
        console.error("خطا در ارسال به سرور:", error);
        alert("خطا در ارسال پاسخ‌ها به سرور.");
        throw error; // برای مدیریت خطا در فراخوانی تابع
    }
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

        // ذخیره زمان باقی‌مانده در localStorage
        localStorage.setItem("remainingTime", timeRemaining);

        if (timeRemaining === 60) {
            alert("تنها یک دقیقه به پایان آزمون باقی مانده است!");
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("زمان آزمون به پایان رسید!");
            document.getElementById("submitQuizButton").disabled = true; // غیرفعال کردن دکمه ارسال
            return;
        }

        timeRemaining--;
    }, 1000);
}
// تابع برای گرفتن تمامی گزینه‌هایی که تیک خورده‌اند در جدول خاص
// تابع برای گرفتن تمامی گزینه‌هایی که تیک خورده‌اند در جدول خاص به همراه اطلاعات سوال و پاسخ
function getCheckedOptions() {
    // ایجاد یک آرایه خالی برای ذخیره نتایج
    let selectedOptions = [];

    // گرفتن جدول با id="quiz"
    const quizTable = document.getElementById('quiz');

    if (quizTable) {
        // گرفتن تمامی سوالات (ردیف‌های اصلی)
        const questionRows = quizTable.querySelectorAll('tbody > tr');

        questionRows.forEach((row) => {
            // پیدا کردن متن سوال
            const questionTextElement = row.querySelector('td[name]');
            if (questionTextElement) {
                const questionText = questionTextElement.textContent.trim();
                const questionName = questionTextElement.getAttribute('name');

                // پیدا کردن جدول پاسخ‌ها برای این سوال
                const responseTable = row.nextElementSibling?.querySelector('tbody');

                if (responseTable) {
                    const radios = responseTable.querySelectorAll(`input[type="radio"][name="${questionName}"]`);

                    // پیدا کردن گزینه انتخاب‌شده
                    const selectedRadio = Array.from(radios).find(radio => radio.checked);

                    if (selectedRadio) {
                        // پیدا کردن متن پاسخ انتخاب شده
                        const responseLabel = selectedRadio.closest('label');
                        const responseText = responseLabel ? responseLabel.textContent.trim() : "";

                        selectedOptions.push({
                            question: questionText,
                            name: selectedRadio.name,
                            id: selectedRadio.id,
                            value: selectedRadio.value,
                            response: responseText
                        });
                    } else {
                        // اگر سوالی پاسخ داده نشده بود
                        selectedOptions.push({
                            question: questionText,
                            name: questionName,
                            id: null,
                            value: null,
                            response: null // مشخص کردن پاسخ‌ندادن
                        });
                    }
                }
            }
        });
    }
    // بازگشت آرایه
    console.log(JSON.stringify({ answers: selectedOptions }));
    sendResultsToServer(selectedOptions, 1);
}


function submitQuiz() {
    // بررسی زمان باقی‌مانده
    const remainingTime = parseInt(localStorage.getItem("remainingTime"), 10);
    if (remainingTime <= 0 || isNaN(remainingTime)) {
        alert("زمان شما به اتمام رسیده است و امکان ارسال آزمون وجود ندارد.");
        return; // ارسال آزمون متوقف شود
    }

    // نمایش پیغام تأیید
    const isConfirmed = confirm("آیا مطمئن هستید که می‌خواهید آزمون را خاتمه دهید؟");
    if (!isConfirmed) {
        return; // اگر کاربر لغو کرد، ارسال انجام نمی‌شود
    }


    // صفر کردن زمان باقی‌مانده
    clearInterval(timerInterval);
    localStorage.removeItem("remainingTime");

    // ادامه ارسال آزمون
    const form = document.getElementById("quizForm");
    const formData = new FormData(form);
    const results = [];

    const userInfo = {
        fullName: document.getElementById("userFullName").textContent,
        username: document.getElementById("userUsername").textContent
    };

    // پردازش پاسخ‌ها و جمع‌آوری داده‌ها برای ارسال به سرور
    for (const [key, value] of formData.entries()) {
        const questionLabel = document.querySelector(`h5[name="${key}"]`).textContent;

        results.push({
            questionId: key,
            questionText: questionLabel,
            answer: value || "پاسخ داده نشده"
        });
    }

    // غیرفعال کردن تمام ورودی‌ها و دکمه‌ها در فرم
    const inputs = form.querySelectorAll("input, button");
    inputs.forEach(input => input.disabled = true);

    // ارسال داده‌ها به سمت سرور
    sendResultsToServer(results, userInfo);
}
function sendResultsToServer(results, userInfo) {
    const apiUrl = "/qApi/QuizApi/SendResultToServer?userName=1"// + userInfo.username; // آدرس کنترلر یا API سمت سرور
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
async function loginApi(userInfo) {
    const apiUrl = "/qApi/QuizApi/Login"; // آدرس کنترلر یا API سمت سرور
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        });

        if (!response.ok) {
            throw new Error("ارسال به سرور با خطا مواجه شد.");
        }

        const data = await response.json(); // پاسخ JSON از سرور
        console.log("پاسخ از سرور:", data);
        return data; // بازگرداندن داده
    } catch (error) {
        console.error("خطا در ارسال به سرور:", error);
        alert("خطا در ارسال پاسخ‌ها به سرور.");
        throw error; // برای مدیریت خطا در فراخوانی تابع
    }
}
function showResults(results, userInfo) {
    // محاسبه اطلاعات آزمون
    const totalQuestions = results.length;
    const answeredQuestions = results.filter(result => result.answer).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passStatus = score >= 70 ? "قبول" : "مردود";

    // محتوای HTML
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
                .info-row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 15px;
                }
                .info-row span {
                    margin: 0 15px;
                    font-size: 1rem;
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
                <div class="info-row">
                    <span><strong>نام:</strong> ${userInfo.fullName}</span>
                    <span><strong>نام کاربری:</strong> ${userInfo.username}</span>
                </div>
                <div class="info-row">
                    <span><strong>تعداد کل سوالات:</strong> ${totalQuestions}</span>
                    <span><strong>تعداد پاسخ داده شده:</strong> ${answeredQuestions}</span>
                    <span><strong>تعداد پاسخ نداده:</strong> ${unansweredQuestions}</span>
                    <span><strong>تعداد پاسخ صحیح:</strong> ${correctAnswers}</span>
                    <span><strong>تعداد پاسخ غلط:</strong> ${incorrectAnswers}</span>
                    <span><strong>نمره:</strong> ${score}٪</span>
                    <span><strong>وضعیت:</strong> <span class="${passStatus === "قبول" ? 'text-success' : 'text-danger'}">${passStatus}</span></span>
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
function customAlert(title, text, type, showCancelButton, confirmButtonText, cancelButtonText ="") {
    $('body').removeClass('timer-alert');
    swal({
        title: title,
        text: text,
        type: type,
        showCancelButton: showCancelButton,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText
    });
}
document.addEventListener("DOMContentLoaded", function () {
    setInterval(function time() {
        var d = new Date();
        var hours = 24 - d.getHours();
        var min = 60 - d.getMinutes();
        if ((min + '').length == 1) {
            min = '0' + min;
        }
        var sec = 60 - d.getSeconds();
        if ((sec + '').length == 1) {
            sec = '0' + sec;
        }
        document.querySelector('#countdown #hour').innerHTML = "00";
        document.querySelector('#countdown #min').innerHTML = min;
        document.querySelector('#countdown #sec').innerHTML = sec;
    }, 1000);
});
// مقداردهی اولیه در صفحه آزمون
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/Quiz/QuizOnline") {
        loadUserInfo();

        const savedTime = parseInt(localStorage.getItem("remainingTime"), 10);
        const initialTime = isNaN(savedTime) ? 300 : savedTime; // اگر زمان ذخیره‌شده موجود نیست، مقدار اولیه 5 دقیقه
        startTimer(initialTime);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm"); // فرض کنید فرم لاگین دارای این ID باشد

    if (loginForm) {
        loginForm.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // جلوگیری از ارسال پیش‌فرض فرم
                login(); // فراخوانی تابع لاگین
            }
        });
    }
});
document.addEventListener("change", (event) => {
    if (event.target.classList.contains("form-check-input")) {
        const parent = event.target.closest(".question");
        if (parent) {
            parent.querySelectorAll(".form-check-input").forEach(input => {
                const label = input.parentElement;
                label.classList.remove("selected-row");
            });
            event.target.parentElement.classList.add("selected-row");
        }
    }
});
