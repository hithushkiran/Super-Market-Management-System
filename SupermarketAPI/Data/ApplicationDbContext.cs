using Microsoft.EntityFrameworkCore;
using SupermarketAPI.Models;

namespace SupermarketAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(p => p.Category)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(p => p.Price)
                .HasPrecision(18, 2)
                .IsRequired();

            entity.Property(p => p.Quantity)
                .IsRequired();

            entity.Property(p => p.ExpiryDate)
                .IsRequired();

            entity.Property(p => p.ImageUrl)
                .HasMaxLength(2048);

            entity.Property(p => p.CreatedAt)
                .IsRequired();

            entity.HasIndex(p => p.Name);
            entity.HasIndex(p => p.Category);
            entity.HasIndex(p => p.ExpiryDate);
        });
    }
}
