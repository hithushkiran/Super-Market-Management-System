using System.ComponentModel.DataAnnotations;

namespace SupermarketAPI.Models;

public class Cart
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}