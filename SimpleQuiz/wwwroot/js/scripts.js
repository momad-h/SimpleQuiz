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
        alert("لطفاً ابتدا وارد شوید.");
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
function submitQuiz() {
    const mcqAnswer = document.querySelector('input[name="question1"]:checked');
    const mcqResult = mcqAnswer ? mcqAnswer.nextElementSibling.textContent : "پاسخ داده نشده";

    // نمایش نتیجه
    document.getElementById("mcqResult").textContent = mcqResult;
    alert("آزمون با موفقیت ارسال شد!");
}

// مقداردهی اولیه در صفحه آزمون
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname==="/Quiz/QuizOnline") {
        loadUserInfo();
        startTimer(300); // تایمر 5 دقیقه
    }
});
