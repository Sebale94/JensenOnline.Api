
using JensenOnline.Api.Data;
using JensenOnline.Api.DTOs;
using JensenOnline.Api.Models;
using JensenOnline.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JensenOnline.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(AppDbContext context, IPasswordHasher<User> passwordHasher, TokenService tokenService) : ControllerBase

    {
        private readonly AppDbContext _context = context;
        private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
        private readonly TokenService _tokenService = tokenService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (userExists)
            {
                return BadRequest("En användare med den e-postadressen finns redan.");
            }

            var user = new User
            {
                Email = dto.Email,
                Role = "User"
            };

            user.Password = _passwordHasher.HashPassword(
                user,
                dto.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Användaren har registrerats.",
                userId = user.Id,
                email = user.Email,
                role = user.Role
            });

            
        }
            
            [HttpPost("login")]
            public async Task<IActionResult> Login(LoginDto dto)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == dto.Email);
                
                if (user == null)
                {
                    return Unauthorized("Felaktig e-postadress eller lösenord.");
                }

                var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
                    user,
                    user.Password,
                    dto.Password);

                if (passwordVerificationResult == PasswordVerificationResult.Failed)
                {
                    return Unauthorized("Felaktig e-postadress eller lösenord.");
                }

                var token = _tokenService.CreateToken(user);

                return Ok(new
                {
                    token,
                    userId = user.Id,
                    email = user.Email,
                    role = user.Role
                });
        }

    }
}