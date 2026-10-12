using JensenOnline.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace JensenOnline.Api.Data;

public class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!context.Users.Any())
        {
           var passwordHasher = new PasswordHasher<User>();

           var admin = new User
           {
                Email = "admin@example.com",
                Role = "Admin"
           };
            
            admin.Password = passwordHasher.HashPassword(admin, "adminpassword");
           
           var user = new User
           {
                Email = "sebastian@example.com",
                Role = "User"
           };

            user.Password = passwordHasher.HashPassword(user, "userpassword");

            var user2 = new User
            {
                Email = "aleryd@example.com",
                Role = "User"
            };
            
            user2.Password = passwordHasher.HashPassword(user2, "userpassword");
           
           context.Users.AddRange(admin, user, user2);
        }

        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                new() { Name = "Product 1", Description = "Laptop", Price = 10.99m },
                new() { Name = "Product 2", Description = "Tangentbord", Price = 15.49m },
                new() { Name = "Product 3", Description = "Skärm", Price = 7.99m }
            };

            context.Products.AddRange(products);
        }

        await context.SaveChangesAsync();
    }
        
}
