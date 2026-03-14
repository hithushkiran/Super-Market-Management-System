using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models.DTOs;

public class AddToCartDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}