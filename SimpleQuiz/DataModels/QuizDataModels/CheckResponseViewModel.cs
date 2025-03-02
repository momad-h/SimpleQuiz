namespace SimpleQuiz
{
    public class CheckResponseViewModel
    {
        public string? QuestionId { get; set; }
        public string? Answer { get; set; }
        public string? Questions { get; set; }
        public bool IsCorrect { get; set; }
        public int Score { get; set; }
    }
}