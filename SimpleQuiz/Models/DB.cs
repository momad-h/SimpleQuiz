using Dapper;
using Microsoft.Data.SqlClient;
using System.Collections.Immutable;
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

        #region QUIZ_Section
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
        public CheckResponseViewModel CheckAnswer2(string questionId, string answer)
        {
            try
            {
                CheckResponseViewModel? res;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    res = db.Query<CheckResponseViewModel>("CheckResponse",new{QuestionId= questionId,Answer= answer},commandType:CommandType.StoredProcedure).SingleOrDefault();
                }

                return res;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public QuizInfo GetQuizInfo(int quizId)
        {
            try
            {
                QuizInfo? quiz;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    quiz = db.Query<QuizInfo>("SELECT Quiz.ID, QuizName, QuizFarsiName, TypeName QuizType, NumberOfQuestions, QuizTime, REPLACE(REPLACE(NegativeScore,0,N'ندارد'),1,N'دارد') NegativeScore,MinScoreToPass FROM Quiz JOIN QuizTypes ON QuizTypes.ID=QuizType WHERE Quiz.ID=@ID", new { ID = quizId }).SingleOrDefault();
                }

                return quiz;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<QuizInfo> GetQuizInfo()
        {
            try
            {
                List<QuizInfo>? quiz;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    quiz = db.Query<QuizInfo>("SELECT Quiz.ID, QuizName, QuizFarsiName, TypeName QuizType, NumberOfQuestions, QuizTime, REPLACE(REPLACE(NegativeScore,0,N'ندارد'),1,N'دارد') NegativeScore,MinScoreToPass FROM Quiz JOIN QuizTypes ON QuizTypes.ID=QuizType").ToList();
                }

                return quiz;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<List<QuizInfo>> AsyncGetQuizInfo()
        {
            try
            {
                List<QuizInfo>? quiz;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    quiz = db.Query<QuizInfo>("SELECT Quiz.ID, QuizName, QuizFarsiName, TypeName QuizType, NumberOfQuestions, QuizTime, REPLACE(REPLACE(NegativeScore,0,N'ندارد'),1,N'دارد') NegativeScore,MinScoreToPass FROM Quiz JOIN QuizTypes ON QuizTypes.ID=QuizType").ToList();
                }

                return quiz;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int SaveQuizHistory(string userName, List<UserQuizViewModel> model)
        {
            try
            {
                int[] QuizHistoryID;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    int correctCount = model.Count(x => x.IsCorrect);
                    var SaveHistoryParameters = new { UserName = userName, QuizScore = correctCount, QuizDate = DateTime.Now };
                    QuizHistoryID = db.Query<int>("Quiz_SaveHistory", SaveHistoryParameters, commandType: CommandType.StoredProcedure).ToArray();
                    foreach (UserQuizViewModel question in model)
                    {
                        var SaveHistoryDetailsParameters = new { QuizHistoryID = QuizHistoryID[0], QuestionId = question.QuestionId.Replace("question", ""), Answer = question.Answer, IsCorrect = question.IsCorrect };
                        db.Query<int>("Quiz_SaveHistoryDetails", SaveHistoryDetailsParameters, commandType: CommandType.StoredProcedure).ToArray();
                    }
                }
                return QuizHistoryID[0];
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion

        #region UserManagment_Section
        public int Signup(UserInfoViewModel user)
        {
            try
            {
                int[] res;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    res = db.Query<int>("Quiz_InsertUsers", user, commandType: CommandType.StoredProcedure).ToArray();
                }
                return res[0];
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public UserInfoViewModel UserInfo(UserInfoViewModel user)
        {
            try
            {
                UserInfoViewModel? userInfo;
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    userInfo = db.Query<UserInfoViewModel>("SELECT * FROM Users WHERE UserName=@UserName", user).SingleOrDefault();
                }
                return userInfo;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<RoleViewModel> RoleList()
        {
            try
            {
                List<RoleViewModel> roles = new List<RoleViewModel>();
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    roles = db.Query<RoleViewModel>("SP_GetRoles", CommandType.StoredProcedure).ToList();
                }
                return roles;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public void UpdateRole(int userId, int roleId)
        {
            try
            {
                using (IDbConnection db = new SqlConnection(_connectionStr))
                {
                    db.Query("SP_UpdateRoles", new { UserID = userId, RoleID = roleId }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion

        #region Blog_Section
        public List<BlogPostViewModel> GetBlogPosts()
        {
            try
            {
                using (IDbConnection db=new SqlConnection(_connectionStr))
                {
                    var posts = db.Query<BlogPostViewModel>("Select Blog_Post.*,UserName,CategoryFarsiName From Blog_Post join AspNetUsers on Blog_Post.CreatorID=AspNetUsers.Id join CategoryList on Blog_Post.Category=CategoryList.ID").ToList();
                    return posts;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion
    }
}