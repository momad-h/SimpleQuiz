namespace SimpleQuiz
{
    public class QuizInfo
    {
        public int ID { get; set; }
        public string QuizName { get; set; }
        public string QuizFarsiName { get; set; }
        public string QuizType { get; set; }
        public int NumberOfQuestions { get; set; }
        public int QuizTime { get; set; }
        public string NegativeScore { get; set; }
        public int MinScoreToPass { get; set; }
    }
}
