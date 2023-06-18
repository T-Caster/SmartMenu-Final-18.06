using Application.Tables;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TablesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTables()
        {
            return HandleResult(await Mediator.Send(new List.Query())); 
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTable(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTable(Table table)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Table = table }));
        }
        [Authorize(Policy = "IsTableHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(Guid id, Table table)
        {
            table.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Table = table }));
        }
        [Authorize(Policy = "IsTableHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
        [HttpPost("{id}/attend")]
        public async Task<IActionResult>Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}