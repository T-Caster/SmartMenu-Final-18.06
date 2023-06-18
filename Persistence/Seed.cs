using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any() && !context.Tables.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var tables = new List<Table>
                {
                    new Table
                    {
                        Date = DateTime.Now.AddMonths(-2),
                        Number = 1,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Table
                    {
                        
                        Date = DateTime.Now.AddMonths(-1),
                        Number = 2,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Table
                    {
                      
                        Date = DateTime.Now.AddMonths(1),
                        Number = 3,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Table
                    {
                        
                        Date = DateTime.Now.AddMonths(2),
                        Number = 4,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new TableAttendee
                            {
                                AppUser = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Table
                    {
                        Date = DateTime.Now.AddMonths(3),
                        Number = 5,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            },
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = false                            
                            },
                        }
                    },
                    new Table
                    {
                        Date = DateTime.Now.AddMonths(4),
                        Number = 6,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            }
                        }
                    },
                    new Table
                    {
                        Date = DateTime.Now.AddMonths(5), 
                        Number = 7,                     
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Table
                    {
                       
                        Date = DateTime.Now.AddMonths(6),
                        Number = 8,                      
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Table
                    {
                        Date = DateTime.Now.AddMonths(7),
                        Number = 9,
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new TableAttendee
                            {
                                AppUser = users[2],
                                IsHost = false                            
                            },
                        }
                    },
                    new Table
                    {                       
                        Date = DateTime.Now.AddMonths(8),
                        Number = 10,                   
                        Attendees = new List<TableAttendee>
                        {
                            new TableAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new TableAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    }
                };

                await context.Tables.AddRangeAsync(tables);
                await context.SaveChangesAsync();
            }
        }
    }
}
