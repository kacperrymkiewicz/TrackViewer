using System.ComponentModel.DataAnnotations;

namespace TrackViewer.API.Models
{
    public class TrackEvent
    {
        public int Id { get; set; }
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public IncidentType IncidentType { get; set; }
        public DateTime EventTime { get; set; }
    }

    public class TrackEventDto
    {
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public IncidentType IncidentType { get; set; }
    }

}
