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

    public class DashboardController : Controller
    {

        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;


        public DashboardController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
            
        }


        [Route("Dashboard/get")]
        [HttpPost]
        public IActionResult Get(Sales sale)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                
                if (sale.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, sale.SaleID);
                }


                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_Get_Dashboard");
                return new JsonResult(ds);

                //oServiceRequestProcessor = new ServiceRequestProcessor();
                //return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }


    }
}
