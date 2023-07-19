using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class TableMenu
    {
        public string ProductId { get; set; }
        public Product Product { get; set; }
        public Guid TableId { get; set; }
        public Table Table { get; set; }

        
    }
}