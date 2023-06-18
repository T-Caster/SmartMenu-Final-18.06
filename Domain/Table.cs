namespace Domain
{
    public class Table
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; } 
        public int Number { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<TableAttendee > Attendees{ get; set; } = new List<TableAttendee>(); 
        public ICollection<Comment>Comments { get; set; } = new List<Comment>();

    }   
}