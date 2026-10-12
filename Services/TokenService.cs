using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using JensenOnline.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace JensenOnline.Api.Services;

public class TokenService(IConfiguration configuration)
{
    private readonly IConfiguration _configuration = configuration;

    public string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new(ClaimTypes.Email,user.Email),
            new(ClaimTypes.Role,user.Role)
        };

        var key = _configuration["Jwt:Key"]
            ?? throw new Exception("JWT key Saknas");

        var securityKey = new SymmetricSecurityKey
            (System.Text.Encoding.UTF8.GetBytes(key));
        
        var credentials = new SigningCredentials
            (securityKey, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
}
