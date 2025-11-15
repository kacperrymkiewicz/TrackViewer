using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrackViewer.API.Data;
using TrackViewer.API.Models;

namespace TrackViewer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrackEventsController : ControllerBase
    {
        private readonly DataContext _context;

        public TrackEventsController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<TrackEvent>> PostTrackEvent(TrackEventDto trackEventDto)
        {
            var newTrackEvent = new TrackEvent
            {
                Latitude = trackEventDto.Latitude,
                Longitude = trackEventDto.Longitude,
                IncidentType = trackEventDto.IncidentType,
                EventTime = DateTime.UtcNow
            };

            _context.TrackEvents.Add(newTrackEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrackEvent), new { id = newTrackEvent.Id }, newTrackEvent);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TrackEvent>> GetTrackEvent(int id)
        {
            var trackEvent = await _context.TrackEvents.FindAsync(id);

            if(trackEvent == null)
                return NotFound();

            return Ok(trackEvent);
        }
    }
}
