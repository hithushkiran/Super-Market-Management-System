namespace SupermarketAPI.Models.DTOs;

public class CartResponseDto
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public int TotalItems { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}