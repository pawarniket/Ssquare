using System;

namespace MS.SSquare.API.Models
{
    public class APILogs
    {
        public int APILogID { get; set; }
        public int ServiceProviderID { get; set; }
        public int ServiceProviderServicesID { get; set; }
        public int RequestUserID { get; set; }
        public string APIMethodName { get; set; }
        public string APIRequest { get; set; }
        public string APIResponse { get; set; }
        public DateTime? APIRequestDateTime { get; set; }
        public DateTime? APIResponseDateTime { get; set; }
    }
}
