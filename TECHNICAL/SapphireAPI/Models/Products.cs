using System;

namespace MS.SSquare.API.Models
{
    public class Products
    {

        public int ProductID { get; set; }
        public int CategoryID { get; set; }
        public int StockQuantity { get; set; }
        public string CategoryName { get; set; }

        public string ProductName { get; set; }
        public string Description { get; set; }
        public string RackNumber { get; set; }

        public decimal? Price { get; set; }

        public DateTime? CreatedAt { get; set; }
        public bool IsActive { get; set; }





    }
}

