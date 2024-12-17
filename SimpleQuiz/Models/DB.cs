using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;


namespace SimpleQuiz
{
    public class DB
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionStr;
        public DB(IConfiguration configuration)
        {
            _connectionStr = configuration.GetConnectionString("DefaultConnection");
        }
        public List<QuestionsViewModel> GetQuestions()
        {
            List<QuestionsViewModel> questions;
            try
            {
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    questions = db.Query<QuestionsViewModel>("SELECT TOP 3 ID,QuestionNumber,Questions FROM tempQuestions where QuestionNumber is not null").ToList();
                }
                return questions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ResponsesViewModel> GetResponses()
        {
            List<ResponsesViewModel> questions;
            try
            {
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    questions = db.Query<ResponsesViewModel>("SELECT ID,QuestionID,Questions FROM tempQuestions where QuestionID is not null").ToList();
                }
                return questions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void SendResultToServer()
        {

        }
        public bool CheckAnswer(string questionId, string answer)
        {
            try
            {
                Dictionary<string, string> correctAnswers;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    correctAnswers = db.Query("SELECT 'question'+CAST(QuestionID AS NVARCHAR(5)) QuestionId,CAST(ResponseNumber AS NVARCHAR(5)) Answer FROM tempQuestions WHERE isTrue=1").ToDictionary(row => (string)row.QuestionId, row => (string)row.Answer);
                }
                return correctAnswers.TryGetValue(questionId, out var correctAnswer) && correctAnswer == answer;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}