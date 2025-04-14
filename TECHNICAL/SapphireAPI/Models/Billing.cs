using System;

namespace MS.SSquare.API.Models
{
    public class Billing
    {
        public int SaleID { get; set; }

        public int InvoiceID { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
    }
}
