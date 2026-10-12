using System.ComponentModel.DataAnnotations;

namespace JensenOnline.Api.DTOs;

public class CreateOrderDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Antalet måste vara minst 1.")]
    public int Quantity { get; set; }
}
