using System;

namespace MS.SSquare.API.Models
{
    public class Vehicle
    {
        public int VehicleID { get; set; }
      
        public string CategoryName { get; set; }

        public string VehicleNumber { get; set; }
        public int? ClientID { get; set; }
        public string? VehicleType { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Color { get; set; }
        public Boolean IsActive { get; set; }

    }
}
