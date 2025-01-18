namespace SimpleQuiz
{
    public class QuizSubmissionModel
    {
        public List<QuizAnswerModel> Answers { get; set; }
    }

    public class QuizAnswerModel
    {
        public string? Question { get; set; } // متن سوال
        public string? Name { get; set; }     // مقدار name مربوط به دکمه رادیویی
        public string? Id { get; set; }       // مقدار id مربوط به دکمه رادیویی انتخاب‌شده
        public string? Value { get; set; }    // مقدار value مربوط به دکمه رادیویی
        public string? Response { get; set; } // متن پاسخ
    }
}