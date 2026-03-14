using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models.DTOs;

public class UpdateProfileDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Address { get; set; }

    [Phone]
    [StringLength(20)]
    public string? Phone { get; set; }
}
