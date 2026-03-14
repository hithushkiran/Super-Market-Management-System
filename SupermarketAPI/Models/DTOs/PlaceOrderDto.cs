using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models.DTOs;

public class PlaceOrderDto
{
    [Required]
    [StringLength(500, MinimumLength = 5)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string PaymentMethod { get; set; } = string.Empty;
}