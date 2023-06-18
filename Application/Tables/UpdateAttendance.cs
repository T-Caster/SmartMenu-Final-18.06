using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tables
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
            _userAccessor = userAccessor;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var table = await _context.Tables
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if(table == null) return null; 

                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var HostUsername = table.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;     

                var attendance = table.Attendees.FirstOrDefault(x=> x.AppUser.UserName == user.UserName);

                if(attendance != null && HostUsername == user.UserName)
                {
                    table.IsCancelled = ! table.IsCancelled;
                }
                if(attendance != null && HostUsername != user.UserName)
                    table.Attendees.Remove(attendance);    

                if(attendance == null)
                {
                    attendance = new TableAttendee
                    {
                        AppUser = user,
                        Table = table,
                        IsHost = false
                    };
                    table.Attendees.Add(attendance);
                }
                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}