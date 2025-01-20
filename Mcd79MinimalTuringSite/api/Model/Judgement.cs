using System;

namespace Mcd79.MinimalTuring.Model
{
    public enum SelectedJudgement
    {
        Human,
        AI
    }
    public class Judgement
    {
        public Guid ID { get; set; }
        public DateTime DateLogged { get; set; }
        public string? HumanWord { get; set; }
        public string? AIWord { get; set; }
        public SelectedJudgement? Guess { get; set; }
        
    }
}