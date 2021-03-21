using System;

namespace FakeBackend.DTO
{
    public class TaskDto
    {
        public string Description { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Status { get; set; }
    }
}