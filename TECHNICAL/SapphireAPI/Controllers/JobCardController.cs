using DAE.Configuration;
using DAE.DAL.SQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MS.SSquare.API.Models;
using System.Data;
using System;

namespace MS.SSquare.API.Controllers
{
    [ApiController]
    public class JobCardController : Controller
    {
      

            private readonly IDaeConfigManager _configurationIG;
            private readonly IWebHostEnvironment _env;
            private ServiceRequestProcessor oServiceRequestProcessor;
            private readonly IJwtAuth jwtAuth;


            public JobCardController(IDaeConfigManager configuration, IWebHostEnvironment env)
            {
                _configurationIG = configuration;
                _env = env;
                this.jwtAuth = jwtAuth;
            }

            [Route("jobcard/get")]
            [HttpPost]
            public IActionResult Get(JobCard jobcard)
            {
                try
                {

                    DBUtility oDBUtility = new DBUtility(_configurationIG);
                    {
                        if (jobcard.VehicleID > 0)
                        {
                            oDBUtility.AddParameters("@JobCardID", DBUtilDBType.Integer, DBUtilDirection.In, 10, jobcard.JobCardID);
                        }
                        if (jobcard.ClientID > 0)
                        {
                            oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 10, jobcard.ClientID);
                        }
                    if (jobcard.JobCardID > 0)
                    {
                        oDBUtility.AddParameters("@JobCardID", DBUtilDBType.Integer, DBUtilDirection.In, 10, jobcard.JobCardID);
                    }

                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_JobCard");

                        oServiceRequestProcessor = new ServiceRequestProcessor();
                        return Ok(oServiceRequestProcessor.ProcessRequest(ds));


                    }
                }
                catch (Exception ex)
                {
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return BadRequest(oServiceRequestProcessor.onError(ex.Message));
                }
            }

        //[Route("jobcard/insert")]
        //[HttpPost]
        //public IActionResult vehiclePost(JobCard jobcard)
        //{


        //    try
        //    {
        //        DBUtility oDBUtility = new DBUtility(_configurationIG);

        //        oDBUtility.AddParameters("@VehicleID", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.VehicleID);
        //        oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.ClientID);
        //        oDBUtility.AddParameters("@JobCardID", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.JobCardID);
        //        oDBUtility.AddParameters("@WorkDescription", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.WorkDescription);
        //        oDBUtility.AddParameters("@Remarks", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.Remarks);
        //        DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_JobCard");
        //        oServiceRequestProcessor = new ServiceRequestProcessor();
        //        return Ok(oServiceRequestProcessor.ProcessRequest(ds));

        //    }
        //    catch (Exception ex)
        //    {
        //        oServiceRequestProcessor = new ServiceRequestProcessor();
        //        return BadRequest(oServiceRequestProcessor.onError(ex.Message));
        //    }
        //}

        [Route("jobcard/insert")]
        [HttpPost]
        public IActionResult vehiclePost(JobCard jobcard)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

                // Insert JobCard
                oDBUtility.AddParameters("@VehicleID", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.VehicleID);
                oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.ClientID);
                oDBUtility.AddParameters("@KmReading", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.KmReading);
                oDBUtility.AddParameters("@WorkDescription", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.WorkDescription);
                oDBUtility.AddParameters("@MechanicName", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.MechanicName);
                oDBUtility.AddParameters("@Status", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.Status);
                oDBUtility.AddParameters("@PaymentMode", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.PaymentMode);
                oDBUtility.AddParameters("@Remarks", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.Remarks);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_JobCard");

                int newJobCardID = 0;

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    var val = ds.Tables[0].Rows[0]["JobCardID"];
                    if (val != DBNull.Value)
                        newJobCardID = Convert.ToInt32(val);
                }

                // Now Insert JobCard Products
                if (newJobCardID > 0 && !string.IsNullOrWhiteSpace(jobcard.ProductsXML))
                {
                    DBUtility oProductUtility = new DBUtility(_configurationIG);
                    oProductUtility.AddParameters("@JobCardID", DBUtilDBType.Integer, DBUtilDirection.In, 100, newJobCardID);
                    oProductUtility.AddParameters("@ProductXML", DBUtilDBType.Nvarchar, DBUtilDirection.In, int.MaxValue, jobcard.ProductsXML);
                    oProductUtility.Execute_StoreProc_DataSet("USP_INSERT_JOBCARD_PRODUCTS");
                }
                else
                {
                    // Optional logging or debugging
                     Console.WriteLine("JobCardID or ProductsXML missing");
                  }

                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));
            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }



        [Route("jobcard/update")]
            [HttpPost]
            public IActionResult vehicleUpdate(JobCard jobcard)
            {


                try
                {
                    DBUtility oDBUtility = new DBUtility(_configurationIG);

                    if (jobcard.VehicleID > 0)
                    {
                        oDBUtility.AddParameters("@VehicleID", DBUtilDBType.Integer, DBUtilDirection.In, 10, jobcard.VehicleID);
                    }
                    if (jobcard.ClientID > 0)
                    {
                        oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.ClientID);
                    }
                     if (jobcard.JobCardID > 0)
                    {
                        oDBUtility.AddParameters("@JobCardID", DBUtilDBType.Integer, DBUtilDirection.In, 100, jobcard.JobCardID);
                    }
                    if (jobcard.WorkDescription != null)
                    {
                        oDBUtility.AddParameters("@WorkDescription", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.WorkDescription);
                    }
                    if (jobcard.Remarks != null)
                    {
                        oDBUtility.AddParameters("@Remarks", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, jobcard.Remarks);
                    }
                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_JobCard");
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return Ok(oServiceRequestProcessor.ProcessRequest(ds));

                }
                catch (Exception ex)
                {
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return BadRequest(oServiceRequestProcessor.onError(ex.Message));
                }
            }

        }
    
}
