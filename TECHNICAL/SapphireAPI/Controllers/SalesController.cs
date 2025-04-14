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
    public class SalesController : ControllerBase
    {

        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;

        public SalesController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
        }
        [Route("Sales/insert")]
        [HttpPost]
        public IActionResult Post(Sales sale)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (sale.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, sale.SaleID);
                }

                if (sale.ClientID!=0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, sale.ClientID);

                }


                if (!string.IsNullOrEmpty(sale.PaymentStatus))
                {
                    oDBUtility.AddParameters("@PaymentStatus", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, sale.PaymentStatus);
                }

                if (sale.TotalAmount != 0)
                {
                    oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, sale.TotalAmount);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_InsertSale");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Sales/Get")]
        [HttpPost]
        public IActionResult add(Sales sale)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (sale.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, sale.SaleID);
                }
                if(sale.ClientID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, sale.ClientID);

                }
                //oDBUtility.AddParameters("@SaleDate", DBUtilDBType.DateTime, DBUtilDirection.In, 1, sale.SaleDate);
                //oDBUtility.AddParameters("@PaymentStatus", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, sale.PaymentStatus);
                //oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, sale.TotalAmount);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GetSale");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Sales/Update")]
        [HttpPost]
        public IActionResult update(Sales sale)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (sale.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, sale.SaleID);
                }
                oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 8000, sale.ClientID);
                oDBUtility.AddParameters("@SaleDate", DBUtilDBType.DateTime, DBUtilDirection.In, 1, sale.SaleDate);
                oDBUtility.AddParameters("@PaymentStatus", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, sale.PaymentStatus);
                oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, sale.TotalAmount);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UpdateSale");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }
        [Route("Sales/Delete")]
        [HttpPost]
        public IActionResult Delete(Sales sale)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, sale.ClientID);
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_DeleteSale");
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
