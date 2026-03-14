using SupermarketAPI.Models.DTOs;

namespace SupermarketAPI.Interfaces;

public interface IOrderService
{
    Task<OrderDetailDto> PlaceOrder(int userId, PlaceOrderDto dto);
    Task<IEnumerable<OrderDto>> GetUserOrders(int userId);
    Task<OrderDetailDto> GetOrderDetails(int userId, int orderId);
}