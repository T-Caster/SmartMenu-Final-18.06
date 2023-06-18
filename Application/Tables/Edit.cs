using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Tables
{
    public class Edit
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

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var table = await _context.Tables.FindAsync(request.Table.Id);

                if(table == null) return null;

                _mapper.Map(request.Table, table);

                var result = await _context.SaveChangesAsync() > 0;// number of changing great than 0
                
                if(!result) return Result<Unit>.Failure("Failed to update table");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}