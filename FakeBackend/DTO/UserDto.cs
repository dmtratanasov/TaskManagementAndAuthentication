using System;

namespace FakeBackend.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string  Token { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
    }
}