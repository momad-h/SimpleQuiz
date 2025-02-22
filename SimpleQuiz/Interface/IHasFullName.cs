namespace SimpleQuiz
{
    public interface IHasExtraInfo
    {
        string FullName { get; set; }
        string Bio { get; set; }
        string WebSite { get; set; }
        DateTime BirthDay { get; set; }
        public bool Gender { get; set; }
    }
}
