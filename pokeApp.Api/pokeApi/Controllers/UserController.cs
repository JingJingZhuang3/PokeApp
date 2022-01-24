using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using pokeApi.Data;
using pokeApi.Models;

namespace pokeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IRepository _repository;

        public UserController(IRepository repository)
        {
            _repository = repository;
        }
        //============ GET ===============//
        [HttpGet]
        public async Task<IActionResult> GetAllByNameAsync([FromQuery, Required] string name, [Required] string email)
        {
            IEnumerable<dtoUser> Users = await _repository.GetUsersAsync(name, email);
            return new JsonResult(Users);
        }

        //==============POST==============//
        [HttpPost]
        public async Task<IActionResult> AddNewUserAsync([FromQuery, Required] string name, [Required]string pw, [Required] string email)
        {
            IEnumerable<dtoUser> Users = await _repository.AddNewUserAsync(name, pw, email);
            return new JsonResult(Users);
        }


    }
}