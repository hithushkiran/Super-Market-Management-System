using SupermarketAPI.Models.DTOs;

namespace SupermarketAPI.Interfaces;

public interface ICartService
{
    Task<CartResponseDto> GetCart(int userId);
    Task<CartResponseDto> AddToCart(int userId, AddToCartDto dto);
    Task<CartResponseDto> UpdateCartItem(int userId, int cartItemId, UpdateCartItemDto dto);
    Task<CartResponseDto> RemoveFromCart(int userId, int cartItemId);
    Task<CartResponseDto> ClearCart(int userId);
}
