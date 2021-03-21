using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using FakeBackend.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FakeBackend.Controllers
{
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class TasksController : ControllerBase
  {
    public TasksController() { }

    [HttpGet(Name = "GetTasks")]
    public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasksForUser()
    {
      var tasksData = await System.IO.File.ReadAllTextAsync("Data/tasks.json");
      var tasks = JsonSerializer.Deserialize<List<Models.Task>>(tasksData);

      var tasksForUser = tasks.FindAll(x => x.UserId == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));

      return Ok(tasksForUser);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<Models.Task>>> GetTaskById(int id)
    {
      var tasksData = await System.IO.File.ReadAllTextAsync("Data/tasks.json");
      var tasks = JsonSerializer.Deserialize<List<Models.Task>>(tasksData);

      var taskToReturn = tasks.FindAll(x => x.Id == id);

      return Ok(taskToReturn);
    }

    [HttpPost("add-task")]
    public async Task<ActionResult> AddTask(TaskDto task)
    {
      var tasksData = await System.IO.File.ReadAllTextAsync("Data/tasks.json");
      var tasks = JsonSerializer.Deserialize<List<Models.Task>>(tasksData);

      tasks.Add(new Models.Task
      {
        Id = tasks.Max(u => u.Id) + 1,
        Description = task.Description,
        From = task.From,
        To = task.To,
        Status = task.Status,
        Created = DateTime.Now,
        Modified = DateTime.Now,
        UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
      });

      await System.IO.File.WriteAllTextAsync("Data/tasks.json", JsonSerializer.Serialize(tasks));

      return CreatedAtRoute("GetTasks", int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value), task);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
      var tasksData = await System.IO.File.ReadAllTextAsync("Data/tasks.json");
      var tasks = JsonSerializer.Deserialize<List<Models.Task>>(tasksData);

      tasks.Remove(tasks.Find(x => x.Id == id));
      await System.IO.File.WriteAllTextAsync("Data/tasks.json", JsonSerializer.Serialize(tasks));

      return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(TaskDto task, int id)
    {
      var tasksData = await System.IO.File.ReadAllTextAsync("Data/tasks.json");
      var tasks = JsonSerializer.Deserialize<List<Models.Task>>(tasksData);

      var taskToUpdate = tasks.Find(x => x.Id == id);
      tasks.Remove(taskToUpdate);
      await System.IO.File.WriteAllTextAsync("Data/tasks.json", JsonSerializer.Serialize(tasks));

      taskToUpdate.Description = task.Description;
      taskToUpdate.From = task.From;
      taskToUpdate.To = task.To;
      taskToUpdate.Status = task.Status;
      taskToUpdate.Modified = DateTime.Now;

      tasks.Add(taskToUpdate);
      await System.IO.File.WriteAllTextAsync("Data/tasks.json", JsonSerializer.Serialize(tasks));

      return NoContent();
    }
  }
}