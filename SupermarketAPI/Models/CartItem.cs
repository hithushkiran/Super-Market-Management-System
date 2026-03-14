using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models;

public class CartItem
{
    public int Id { get; set; }

    [Required]
    public int CartId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
    public decimal Price { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public Cart? Cart { get; set; }

    public Product? Product { get; set; }
}