using SupermarketAPI.Models;

namespace SupermarketAPI.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task<Product?> UpdateAsync(Product product);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<IReadOnlyList<Product>> GetByCategoryAsync(string category);
    Task<IReadOnlyList<Product>> GetLowStockProductsAsync(int threshold);
}
