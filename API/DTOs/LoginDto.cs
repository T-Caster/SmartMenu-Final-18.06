using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//this is going to be used for when a user logs in
namespace API.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}