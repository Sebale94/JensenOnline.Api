using System.ComponentModel.DataAnnotations;

namespace JensenOnline.Api.DTOs;

public class CreateProductDto
{   
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Priset måste vara större än 0.")]
    public decimal Price { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Beskrivningen får inte vara längre än 500 tecken.")]
    public string Description { get; set; } = string.Empty;
}
