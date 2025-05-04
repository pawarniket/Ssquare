using System;

namespace MS.SSquare.API.Models
{
    public class JobCard
    {
        public int? JobCardID { get; set; }
        public int? ProductID { get; set; }
        public int? VehicleID { get; set; }
        public int? ClientID { get; set; }
        public int? KmReading { get; set; }
        public string WorkDescription { get; set; }
        public string Remarks { get; set; }
        public int? MechanicUserID { get; set; }
        public Decimal  ? TotalAmount { get; set; }
        public Decimal? BalanceAmount { get; set; }
        public Decimal ? PaidAmount { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }

        public string PaymentMode { get; set; }
        public DateTime JobCardDate { get; set; }

        public string ProductsXML { get; set; }
        public string ServiceXML { get; set; }
    }
}
