using DAE.Common.EncryptionDecryption;
using DAE.Configuration;
using DAE.DAL.SQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MS.SSquare.API.Models;
using System.Data;
using System.Security.Claims;
using System;
using System.Numerics;

namespace MS.SSquare.API.Controllers
{
    [ApiController]

    public class ProductController : Controller
    {

        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;
        private readonly IJwtAuth jwtAuth;


        public ProductController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
            this.jwtAuth = jwtAuth;
        }



        [Route("Product/Insert")]
        [HttpPost]
        public IActionResult Post(Products product)
        {
            try
            {
       
                    DBUtility oDBUtility = new DBUtility(_configurationIG);
                    oDBUtility.AddParameters("@ProductName", DBUtilDBType.Varchar, DBUtilDirection.In, 250, product.ProductName);
                    oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                    oDBUtility.AddParameters("@Description", DBUtilDBType.Varchar, DBUtilDirection.In, 150, product.Description);
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Decimal, DBUtilDirection.In, 250, product.Price);
                    oDBUtility.AddParameters("@Selling_Price", DBUtilDBType.Decimal, DBUtilDirection.In, 250, product.Selling_Price);
                    oDBUtility.AddParameters("@StockQuantity", DBUtilDBType.Integer, DBUtilDirection.In, 50, product.StockQuantity);
                    oDBUtility.AddParameters("@RackNumber", DBUtilDBType.Varchar, DBUtilDirection.In, 100, product.RackNumber);
                    oDBUtility.AddParameters("@IsActive", DBUtilDBType.Boolean, DBUtilDirection.In, 10, product.IsActive);

      
                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_PRODUCT");
                    return Ok(new { status_code = 100, Message = "Product successfully added." });

                
            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }


        [Route("Product/update")]
        [HttpPost]
        public IActionResult Put(Products product)
        {

            try
            {
                    DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (product.ProductID != 0)
                {
                    oDBUtility.AddParameters("@ProductID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.ProductID);
                }
                if (product.ProductName != null)
                {
                    oDBUtility.AddParameters("@ProductName", DBUtilDBType.Varchar, DBUtilDirection.In, 250, product.ProductName);
                }

                if (product.Description != null)
                {
                    oDBUtility.AddParameters("@Description", DBUtilDBType.Varchar, DBUtilDirection.In, -1, product.Description);
                }

                if (product.CategoryID != 0)
                {
                    oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                }
                if (product.Price != null)
                {
                    oDBUtility.AddParameters("@Price", DBUtilDBType.Decimal, DBUtilDirection.In, 50, product.Price);
                }

                if (product.Selling_Price != null)
                {
                    oDBUtility.AddParameters("@Selling_Price", DBUtilDBType.Decimal, DBUtilDirection.In, 250, product.Selling_Price);
                }

                if (product.StockQuantity !=null)
                {
                    oDBUtility.AddParameters("@StockQuantity", DBUtilDBType.Integer, DBUtilDirection.In, 250, product.StockQuantity);
                }

                if (product.RackNumber != null)
                {
                    oDBUtility.AddParameters("@RackNumber", DBUtilDBType.Varchar, DBUtilDirection.In, 10, product.RackNumber);
                }

                if (product.IsActive != null)
                {
                    oDBUtility.AddParameters("@IsActive", DBUtilDBType.Boolean, DBUtilDirection.In, 10, product.IsActive);
                }





                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_PRODUCT");
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return Ok(oServiceRequestProcessor.ProcessRequest(ds));
                
            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Product/delete")]
        [HttpPost]
        public IActionResult delete(Products product)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {

                    if (product.ProductID != 0)
                    {
                        oDBUtility.AddParameters("@ProductID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.ProductID);
                    }




                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_DELETE_PRODUCT");

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


        [Route("Product/get")]
        [HttpPost]
        public IActionResult Get(Products product)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {

                    if (product.ProductID != 0)
                    {
                        oDBUtility.AddParameters("@ProductID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.ProductID);
                    }
                    if (product.ProductName != null)
                    {
                        oDBUtility.AddParameters("@ProductName", DBUtilDBType.Varchar, DBUtilDirection.In, 250, product.ProductName);
                    }
                    if (product.CategoryID != 0)
                    {
                        oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                    }

                    if (product.RackNumber != null)
                    {
                        oDBUtility.AddParameters("@RackNumber", DBUtilDBType.Varchar, DBUtilDirection.In, 10, product.RackNumber);
                    }



                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_PRODUCT");

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





        [Route("Productcategory/Insert")]
        [HttpPost]
        public IActionResult Productcategory(Products product)
        {
            try
            {

                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@CategoryName", DBUtilDBType.Varchar, DBUtilDirection.In, 250, product.CategoryName);
                if (product.Description != null)
                {
                    oDBUtility.AddParameters("@Description", DBUtilDBType.Varchar, DBUtilDirection.In, 150, product.Description);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_PRODUCTCATEGORY");
                return Ok(new { status_code = 100, Message = "Product Category successfully added." });


            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }




        [Route("Productcategory/update")]
        [HttpPost]
        public IActionResult ProductcategoryUpdate(Products product)
        {

            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
     

                if (product.CategoryID != 0)
                {
                    oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                }
                if (product.CategoryName != null)
                {
                    oDBUtility.AddParameters("@CategoryName", DBUtilDBType.Varchar, DBUtilDirection.In, 100, product.CategoryName);
                }
                if (product.Description != null)
                {
                    oDBUtility.AddParameters("@Description", DBUtilDBType.Varchar, DBUtilDirection.In, -1, product.Description);
                }
            





                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_PRODUCTCATEGORY");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }




        [Route("Productcategory/get")]
        [HttpPost]
        public IActionResult productcategory(Products product)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {

                    if (product.CategoryID != 0)
                    {
                        oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                    }
                    if (product.CategoryName != null)
                    {
                        oDBUtility.AddParameters("@CategoryName", DBUtilDBType.Varchar, DBUtilDirection.In, 250, product.CategoryName);
                    }
       



                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_PRODUCTCATEGORY");

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


        [Route("Productcategory/delete")]
        [HttpPost]
        public IActionResult categorydelete(Products product)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {

                    if (product.CategoryID != 0)
                    {
                        oDBUtility.AddParameters("@CategoryID", DBUtilDBType.Integer, DBUtilDirection.In, 10, product.CategoryID);
                    }




                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_DELETE_PRODUCTCATEGORY");

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


    }
}
