function get(content) {
    console.log("Clicked item content:", content);
    const panel=document.getElementById('new-question-panel');
    const title=document.getElementById('new-question-title');
    panel.style.display = 'block';
    title.innerText='سوال جدید در '+content;
}

// انتخاب تمامی عناصر li داخل dropdown-menu
const listItems = document.querySelectorAll('.dropdown-menu li');

// اضافه کردن event listener به هر li
listItems.forEach(item => {
    item.addEventListener('click', function() {
        // دریافت محتوای متن داخل li
        const content = item.textContent.trim();
        // فراخوانی تابع get و پاس دادن محتوا به آن
        get(content);
    });
});