using System;

namespace FakeBackend.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Status { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }
        public int UserId { get; set; }
    }
}