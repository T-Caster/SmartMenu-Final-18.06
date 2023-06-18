using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tables
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Table Table { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command> // for validate
        {
            public CommandValidator()
            {
                RuleFor(x => x.Table).SetValidator(new TableValidator());
            }
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
                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername());

                var attendee = new TableAttendee{
                    AppUser = user,
                    Table = request.Table,
                    IsHost = true
                };
                request.Table.Attendees.Add(attendee);    

                _context.Tables.Add(request.Table);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create table");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
