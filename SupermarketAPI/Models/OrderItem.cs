using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models;

public class OrderItem
{
    public int Id { get; set; }

    [Required]
    public int OrderId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
    public decimal Price { get; set; }

    [Required]
    [StringLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string ProductCategory { get; set; } = string.Empty;

    public Order? Order { get; set; }
    public Product? Product { get; set; }
}