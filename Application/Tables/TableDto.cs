using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Profiles;
//we wanted to receive data from our clients and we're going to look at them 
//now and use them to return our data.
namespace Application.Tables
{
    public class TableDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; } 
        public int Number { get; set; }
        public string HostUsername { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<AttendeeDto> Attendees { get; set; }
        public ICollection<CommentDto> Comments { get; set; }
    }
}