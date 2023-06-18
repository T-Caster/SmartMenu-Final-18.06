using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class TableAttendee
    {
        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }

        public Guid TableId { get; set; }

        public Table Table { get; set; }

        public bool IsHost { get; set; }
    }
}