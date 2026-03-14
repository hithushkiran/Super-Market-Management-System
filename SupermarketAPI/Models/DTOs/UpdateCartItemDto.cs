using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models.DTOs;

public class UpdateCartItemDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }
}