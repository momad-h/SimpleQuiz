namespace SimpleQuiz
{
    public class Services
    {
        public static string GenerateToken()
        {
            return Guid.NewGuid().ToString();
        }

    }
}
