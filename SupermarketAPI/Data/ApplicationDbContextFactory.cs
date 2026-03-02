using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SupermarketAPI.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        const string connectionString = "Server=localhost;Port=3306;Database=SupermarketDB;User=root;Password=123456;SslMode=None;AllowPublicKeyRetrieval=True;";

        optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(9, 3, 0)));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
