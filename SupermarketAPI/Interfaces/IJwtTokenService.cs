using SupermarketAPI.Models.DTOs;

namespace SupermarketAPI.Interfaces;

public interface IJwtTokenService
{
    AuthResponseDto GenerateToken(User user);
}
