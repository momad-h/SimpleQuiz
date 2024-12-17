namespace SimpleQuiz
{
    public class QuizSubmissionModel
    {
        public List<QuizAnswerModel> Answers { get; set; }
    }

    public class QuizAnswerModel
    {
        public string QuestionId { get; set; } // شناسه سوال
        public string QuestionText { get; set; } // متن سوال
        public string Answer { get; set; } // پاسخ کاربر
    }
}
