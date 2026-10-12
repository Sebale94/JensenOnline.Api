using System.Security.Claims;
using JensenOnline.Api.Data;
using JensenOnline.Api.DTOs;
using JensenOnline.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace JensenOnline.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Användaren är inte autentiserad.");
            }

            var product = await _context.Products
            .FirstOrDefaultAsync(
                p => p.Id == dto.ProductId);

            if (product == null)
            {
                return NotFound("Produkten hittades inte.");
            }

            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                OrderItems =
                [
                    new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = dto.Quantity,
                    }
                ]
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                order.Id,
                order.UserId,
                order.CreatedAt,
                product = product.Name,
                productId = product.Id,
                quantity = dto.Quantity,
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Användaren är inte autentiserad.");
            }

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Beställningen hittades inte.");
            }

            if (order.UserId != userId)
            {
                return StatusCode(403, new
                {
                    message = "Du har inte behörighet att se denna order."
                });
            }

            return Ok(new
            {
                order.Id,
                order.UserId,
                order.CreatedAt,
                Items = order.OrderItems.Select(item => new
                
                {
                    item.ProductId,
                    item.Quantity
                })
            });

        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Användaren är inte autentiserad.");
            }

            var orders = await _context.Orders
                .Where(o=> o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

                return Ok(orders.Select(order => new
                {
                    order.Id,
                    order.CreatedAt,
                    Items = order.OrderItems.Select(item => new
                    {
                        item.ProductId,
                        Product = item.Product.Name,
                        item.Quantity
                    })
                }));
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders.Select(order => new
            {
                order.Id,
                order.UserId,
                order.CreatedAt,
                Items = order.OrderItems.Select(item => new
                {
                    item.ProductId,
                    item.Quantity,
                    Product = item.Product.Name
                })
            }));
        }
    }
}