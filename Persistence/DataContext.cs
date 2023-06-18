using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Table> Tables { get; set; }
        public DbSet<TableAttendee> TableAttendees{get;set;}
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments{ get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //this is our configuration for our MANY to MANY relationship
            base.OnModelCreating(builder);

            builder.Entity<TableAttendee>(x => x.HasKey(aa => new{aa.AppUserId, aa.TableId}));

          builder.Entity<TableAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(u => u.Tables)
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<TableAttendee>()
                .HasOne(u => u.Table)
                .WithMany(u => u.Attendees)
                .HasForeignKey(aa => aa.TableId);


            //if we delete an Table, it will cascade that delete
            //down to the comments that were associated
            builder.Entity<Comment>()
            .HasOne(a => a.Table)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade);

        }
        
    }
}