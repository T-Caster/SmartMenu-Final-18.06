using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Tables
{
    public class List
    {
        public class Query : IRequest<Result<List<TableDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<TableDto>>>
        {
            private readonly DataContext _context;
        private readonly IMapper _mapper;

            public Handler(DataContext context,IMapper mapper)
            {
                 _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<TableDto>>> Handle(Query request, CancellationToken token)
            {
                var tables = await _context.Tables
                    .ProjectTo<TableDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(token);

                return Result<List<TableDto>>.Success(tables);
            }
        }
    }
}