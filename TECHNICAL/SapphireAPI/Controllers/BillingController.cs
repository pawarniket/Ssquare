using DAE.Configuration;
using DAE.DAL.SQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MS.SSquare.API.Models;
using System.Data;
using System;
using System.ServiceModel.Channels;

namespace MS.SSquare.API.Controllers
{
    [ApiController]
    public class BillingController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;


        public BillingController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
        }


        [Route("Billing/insert")]
        [HttpPost]
        public IActionResult Post(Billing billing)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (billing.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, billing.SaleID);
                }

                //  oDBUtility.AddParameters("@InvoiceID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, billing.InvoiceID);
                oDBUtility.AddParameters("@InvoiceDate", DBUtilDBType.DateTime, DBUtilDirection.In, 1, billing.InvoiceDate);
                oDBUtility.AddParameters("@PaymentMethod", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, billing.PaymentMethod);
                oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, billing.TotalAmount);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_Insert_BillingRecord");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Billing/Update")]
        [HttpPost]
        public IActionResult update(Billing billing)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (billing.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, billing.SaleID);
                }
                oDBUtility.AddParameters("@InvoiceID", DBUtilDBType.Integer, DBUtilDirection.In, 8000, billing.InvoiceID);
                oDBUtility.AddParameters("@InvoiceDate", DBUtilDBType.DateTime, DBUtilDirection.In, 1, billing.InvoiceDate);
                oDBUtility.AddParameters("@PaymentMethod", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, billing.PaymentMethod);
                oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, billing.TotalAmount);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_Update_BillingRecord");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }
        [Route("Billing/Delete")]
        [HttpPost]
        public IActionResult Delete(Billing billing)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@InvoiceID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, billing.InvoiceID);
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_Delete_BillingRecord");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Billing/Get")]
        [HttpPost]
        public IActionResult add(Billing billing)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (billing.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, billing.SaleID);
                }

                if (billing.InvoiceID != 0)
                {
                    oDBUtility.AddParameters("@InvoiceID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, billing.InvoiceID);

                }
                //oDBUtility.AddParameters("@InvoiceDate", DBUtilDBType.DateTime, DBUtilDirection.In, 1, billing.InvoiceDate);
                //oDBUtility.AddParameters("@PaymentMethod", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, billing.PaymentMethod);
                //oDBUtility.AddParameters("@TotalAmount", DBUtilDBType.Decimal, DBUtilDirection.In, 10, billing.TotalAmount);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_Get_BillingRecord_byId");
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
