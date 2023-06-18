using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tables
{
    public class Details
    {
        public class Query : IRequest<Result<TableDto>>
        {
            public Guid Id { get; set; }
        } 

        public class Handler : IRequestHandler<Query, Result<TableDto>>
        {
            private readonly DataContext _context;
        private readonly IMapper _mapper;

            public Handler(DataContext context,IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<TableDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var table =  await _context.Tables
                    .ProjectTo<TableDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);
                return Result<TableDto>.Success(table);
            }
        }
    }
}