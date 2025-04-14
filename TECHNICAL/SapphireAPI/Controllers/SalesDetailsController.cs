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
    public class SalesDetailsController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;

        public SalesDetailsController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
        }
        [Route("SalesDetails/insert")]
        [HttpPost]
        public IActionResult Post(SalesDetails salesdetails)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (salesdetails.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, salesdetails.SaleID);
                }

                if (salesdetails.SaleDetailID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, salesdetails.SaleDetailID);

                }


                if (salesdetails.Price != 0)
                {
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, salesdetails.Price);
                }

                if (salesdetails.Quantity != 0)
                {
                    oDBUtility.AddParameters("@Quantity", DBUtilDBType.Decimal, DBUtilDirection.In, 10, salesdetails.Quantity);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_InsertSaleDetail");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("SalesDetails/Get")]
        [HttpPost]
        public IActionResult add(SalesDetails salesdetails)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (salesdetails.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, salesdetails.SaleID);
                }

                if (salesdetails.SaleDetailID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, salesdetails.SaleDetailID);

                }


                if (salesdetails.Price != 0)
                {
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, salesdetails.Price);
                }

                if (salesdetails.Quantity != 0)
                {
                    oDBUtility.AddParameters("@Quantity", DBUtilDBType.Decimal, DBUtilDirection.In, 10, salesdetails.Quantity);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GetSaleDetailByIDOrSaleID");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("SalesDetails/Update")]
        [HttpPost]
        public IActionResult update(SalesDetails salesdetails)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (salesdetails.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, salesdetails.SaleID);
                }

                if (salesdetails.SaleDetailID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, salesdetails.SaleDetailID);

                }


                if (salesdetails.Price != 0)
                {
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, salesdetails.Price);
                }

                if (salesdetails.Quantity != 0)
                {
                    oDBUtility.AddParameters("@Quantity", DBUtilDBType.Decimal, DBUtilDirection.In, 10, salesdetails.Quantity);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UpdateSaleDetail");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }
        [Route("SalesDetails/Delete")]
        [HttpPost]
        public IActionResult Delete(SalesDetails salesdetails)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (salesdetails.SaleID != 0)
                {
                    oDBUtility.AddParameters("@SaleID", DBUtilDBType.Integer, DBUtilDirection.In, 50, salesdetails.SaleID);
                }

                if (salesdetails.SaleDetailID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Varchar, DBUtilDirection.In, 8000, salesdetails.SaleDetailID);

                }


                if (salesdetails.Price != 0)
                {
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Nvarchar, DBUtilDirection.In, 5, salesdetails.Price);
                }

                if (salesdetails.Quantity != 0)
                {
                    oDBUtility.AddParameters("@Quantity", DBUtilDBType.Decimal, DBUtilDirection.In, 10, salesdetails.Quantity);
                }
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_DeleteSaleDetail");
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
