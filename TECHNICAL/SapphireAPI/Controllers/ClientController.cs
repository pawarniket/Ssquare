using DAE.Configuration;
using DAE.DAL.SQL;
using MS.SSquare.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System;
using DAE.Common.EncryptionDecryption;
using System.Numerics;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MS.SSquare.API.Controllers
{
    [ApiController]

    public class ClientController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;
            
        public ClientController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
        }

        [Route("Client/add")]
        [HttpPost]
        public IActionResult Post(Client client)
        {
            try
            {

                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@ClientName", DBUtilDBType.Varchar, DBUtilDirection.In, 100, client.ClientName);
                oDBUtility.AddParameters("@Email", DBUtilDBType.Varchar, DBUtilDirection.In, 100, client.Email);
                oDBUtility.AddParameters("@Address", DBUtilDBType.Varchar, DBUtilDirection.In, -1, client.Address);
                oDBUtility.AddParameters("@Phone", DBUtilDBType.Varchar, DBUtilDirection.In, 50, client.Phone);


                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_CLIENT");
                return Ok(new { status_code = 100, Message = "Product successfully added." });


            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }

        [Route("Client/update")]
        [HttpPost]
        public IActionResult Put(Client client)
        {

            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (client.ClientID != 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 10, client.ClientID);
                }
                if (client.ClientName != null)
                {
                    oDBUtility.AddParameters("@ClientName", DBUtilDBType.Varchar, DBUtilDirection.In, 100, client.ClientName);
                }
                if (client.Email != null)
                {
                    oDBUtility.AddParameters("@Email", DBUtilDBType.Varchar, DBUtilDirection.In, 100, client.Email);
                }

                if (client.Address != null)
                {
                    oDBUtility.AddParameters("@Address", DBUtilDBType.Varchar, DBUtilDirection.In, -1, client.Address);
                }

                if (client.Phone != null)
                {
                    oDBUtility.AddParameters("@Phone", DBUtilDBType.Varchar, DBUtilDirection.In, 50, client.Phone);
                }





                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_CLIENT");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }



        [Route("Client/get")]
        [HttpPost]
        public IActionResult Get(Client client)
        {
            try
            {

                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {
                    if (client.ClientID != 0 && client.ClientID != null)
                    {
                        oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 10, client.ClientID);
                    }



                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_CLIENT");

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