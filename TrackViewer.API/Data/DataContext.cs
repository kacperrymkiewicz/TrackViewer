using Microsoft.EntityFrameworkCore;
using TrackViewer.API.Models;

namespace TrackViewer.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<TrackEvent> TrackEvents { get; set; }
    }
}
