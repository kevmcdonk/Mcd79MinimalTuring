using System;

namespace Mcd79.MinimalTuring.Model
{
    public class ExperimentResult
    {
        public int ID { get; set; }
        public DateTime DateLogged { get; set; }
        public string? HumanWord { get; set; }
        public string? AIWord { get; set; }
    }
}