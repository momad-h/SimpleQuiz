using Microsoft.Extensions.Caching.Memory;

namespace SimpleQuiz
{
    public class TokenService
    {
        private readonly IMemoryCache _cache;

        public TokenService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string CreateToken(string page)
        {
            var token = Guid.NewGuid().ToString();
            _cache.Set(token, new TokenInfoViewModel
            {
                Token = token,
                Page = page,
                Expiry = DateTime.UtcNow.AddMinutes(15) // زمان انقضا
            });

            return token;
        }

        public bool ValidateToken(string token, string page)
        {
            if (token == null)
                return false;
            if (_cache.TryGetValue(token, out TokenInfoViewModel tokenInfo))
            {
                if (tokenInfo.Page == page && tokenInfo.Expiry > DateTime.UtcNow)
                {
                    return true;
                }
            }
            return false;
        }
    }

}
