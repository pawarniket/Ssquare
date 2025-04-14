using System;

namespace MS.SSquare.API.Controllers
{
    public class Client
    {
        public int? ClientID { get; set; }
        public int? ClientTypId { get; set; }
        public string ClientName { get; set; }
        public string Email { get; set; }

        public string Address { get; set; }
        public string Phone { get; set; }

    }

}
