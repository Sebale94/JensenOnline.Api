using System.Security.AccessControl;

namespace JensenOnline.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<Order> Orders { get; set; } = [];
}
