using System;

namespace MS.SSquare.API.Models
{
    public class Sales
    {
        public int SaleID { get; set; }

        public int ClientID { get; set; }
        public DateTime? SaleDate { get; set; }
        public decimal TotalAmount { get; set; }

        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }

        public string PaymentStatus { get; set; }
        public string PaymentMode { get; set; }

    }
}
