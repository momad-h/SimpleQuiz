namespace SimpleQuiz
{
    public class BlogPostViewModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string PostText { get; set; }
        public DateTime CreationDate { get; set; }
        public string Pic { get; set; }
        public int Status { get; set; }
        public int CreatorID { get; set; }
        public string UserName { get; set; }
        public string CategoryFarsiName { get; set; }
    }
}