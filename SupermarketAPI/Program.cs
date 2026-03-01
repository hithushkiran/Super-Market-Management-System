using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SupermarketAPI.Data;
using SupermarketAPI.Interfaces;
using SupermarketAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("DefaultConnection connection string was not found.");

    options.UseMySql(connectionString, ResolveServerVersion(connectionString));
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        if (!dbContext.Database.CanConnect())
        {
            startupLogger.LogError("Database connection check failed. Verify MySQL host, port, user, password, and authentication plugin settings.");
        }

        dbContext.Database.Migrate();
        startupLogger.LogInformation("Database migrations applied successfully.");
    }
    catch (MySqlException ex)
    {
        startupLogger.LogError(ex,
            "MySQL connection failed. Ensure user 'root' can authenticate with caching_sha2_password and connection string options include SslMode=None and AllowPublicKeyRetrieval=True.");
    }
    catch (Exception ex)
    {
        startupLogger.LogError(ex, "Database migration failed during startup.");
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();

static ServerVersion ResolveServerVersion(string connectionString)
{
    try
    {
        return ServerVersion.AutoDetect(connectionString);
    }
    catch
    {
        return new MySqlServerVersion(new Version(9, 3, 0));
    }
}
