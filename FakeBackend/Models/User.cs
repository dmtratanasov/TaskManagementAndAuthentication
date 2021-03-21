using System;

namespace FakeBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string  Password { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
    }
}