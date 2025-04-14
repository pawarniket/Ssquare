using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;



namespace MS.SSquare.API.Models
{
    public class APIResult
    {
        //private DataSet _Request = null;
        //public DataSet RequestDS { get; set; }

        public int status_code { get; set; }


        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        private JsonResult messageJson { get; set; }

        public string message { get; set; }


    }
    public class ServiceRequestProcessor
    {
        APIResult oAPIResult;

        public object ProcessRequest(DataSet ds)
        {
            oAPIResult = new APIResult();
            oAPIResult.status_code = Convert.ToInt32(ds.Tables[0].Rows[0]["status_code"].ToString());
            ds.Tables[0].Columns.Remove("status_code");
            oAPIResult.message = JsonConvert.SerializeObject(ds.Tables[0]);//new JsonResult(ds.Tables[0]);
            return oAPIResult;
        }

        public object onError(string errorMsg)
        {
            oAPIResult = new APIResult();
            oAPIResult.status_code = 400;
            oAPIResult.message = "Server Error";
            return oAPIResult;
        }

        public object onUserNotFound()
        {
            oAPIResult = new APIResult();
            oAPIResult.status_code = 500;
            oAPIResult.message = "User not found or password is incorrect";
            return oAPIResult;
        }

        //For Mobile
        public object customeMessge(int code, string msg)
        {
            oAPIResult = new APIResult();
            oAPIResult.status_code = code;
            oAPIResult.message = msg;
            return oAPIResult;
        }



    }
}
