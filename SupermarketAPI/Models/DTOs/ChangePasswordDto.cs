using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models.DTOs;

public class ChangePasswordDto
{
    [Required]
    [MinLength(8)]
    [StringLength(100)]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [StringLength(100)]
    public string NewPassword { get; set; } = string.Empty;

    [Required]
    [Compare(nameof(NewPassword))]
    public string ConfirmNewPassword { get; set; } = string.Empty;
}
