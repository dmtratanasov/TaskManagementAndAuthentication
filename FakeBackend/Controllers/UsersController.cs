using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using FakeBackend.DTO;
using FakeBackend.Models;
using FakeBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FakeBackend.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class UsersController : ControllerBase
  {
    private readonly TokenService _tokenService;
    public UsersController(TokenService tokenService) { _tokenService = tokenService; }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(LoginRegisterDto registerData)
    {

      var usersData = await System.IO.File.ReadAllTextAsync("Data/users.json");
      var users = JsonSerializer.Deserialize<List<User>>(usersData);

      if (users.Find(x => x.Email == registerData.Email) != null)
      {
        return BadRequest("Email already exists");
      }

      var user = new User
      {
        Id = users.Max(u => u.Id) + 1,
        Email = registerData.Email,
        Password = registerData.Password,
        Created = DateTime.Now
      };

      users.Add(user);

      await System.IO.File.WriteAllTextAsync("Data/users.json", JsonSerializer.Serialize(users));

      return new UserDto
      {
        Id = user.Id,
        Email = user.Email,
        Created = DateTime.Now,
        Token = _tokenService.CreateToken(user)
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginRegisterDto loginData)
    {
      var userData = await System.IO.File.ReadAllTextAsync("Data/users.json");
      var users = JsonSerializer.Deserialize<List<User>>(userData);

      var user = users.Find(x => x.Email == loginData.Email && x.Password == loginData.Password);
      if (user == null)
      {
        return Unauthorized("Username or password is incorrect");
      }
      return new UserDto
      {
        Id = user.Id,
        Email = user.Email,
        Created = DateTime.Now,
        Token = _tokenService.CreateToken(user)
      };
    }
  }
}
