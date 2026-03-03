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

// Connection string is read from:
// - Azure App Service: ConnectionStrings__DefaultConnection environment variable
// - Local development: appsettings.json / appsettings.Development.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException(
            "DefaultConnection connection string was not found. " +
            "Set the 'ConnectionStrings__DefaultConnection' environment variable in Azure App Service, " +
            "or define it in appsettings.json for local development.");

    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
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

if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        startupLogger.LogInformation("Production environment detected. Applying EF Core migrations...");
        dbContext.Database.Migrate();
        startupLogger.LogInformation("EF Core migrations applied successfully.");
    }
    catch (Exception ex)
    {
        startupLogger.LogError(ex, "An error occurred while applying EF Core migrations on startup.");
        throw;
    }
}

// app.UseHttpsRedirection(); // Disabled to allow HTTP from React frontend
app.UseCors("FrontendPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();


