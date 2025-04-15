using DAE.Configuration;
using DAE.DAL.SQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MS.SSquare.API.Models;
using System.Data;
using System;
using DAE.Common.EncryptionDecryption;

namespace MS.SSquare.API.Controllers
{
    [ApiController]
    public class VehicleController : Controller
    {

        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;
        private readonly IJwtAuth jwtAuth;


        public VehicleController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
            this.jwtAuth = jwtAuth;
        }

        [Route("Vehicle/get")]
        [HttpPost]
        public IActionResult Get(Vehicle vehicle)
        {
            try
            {

                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {
                    if (vehicle.VehicleID > 0)
                    {
                        oDBUtility.AddParameters("@VehicleID", DBUtilDBType.Integer, DBUtilDirection.In, 10, vehicle.VehicleID);
                    }
                    if (vehicle.ClientID > 0 )
                    {
                        oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 10, vehicle.ClientID);
                    }


                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_VEHICLE");

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

        [Route("vehicle/insert")]
        [HttpPost]
        public IActionResult vehiclePost(Vehicle vehicle)
        {


            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

                oDBUtility.AddParameters("@VehicleNumber", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.VehicleNumber);
                oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 100, vehicle.ClientID);
                oDBUtility.AddParameters("@VehicleType", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.VehicleType);
                oDBUtility.AddParameters("@Model", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Model);
                oDBUtility.AddParameters("@Brand", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Brand);
                oDBUtility.AddParameters("@Color", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Color);
                oDBUtility.AddParameters("@IsActive", DBUtilDBType.Boolean, DBUtilDirection.In, 100, vehicle.IsActive);



                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_VEHICLE");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }


        [Route("vehicle/update")]
        [HttpPost]
        public IActionResult vehicleUpdate(Vehicle vehicle)
        {


            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

                if (vehicle.VehicleID > 0 )
                {
                    oDBUtility.AddParameters("@VehicleID", DBUtilDBType.Integer, DBUtilDirection.In, 10, vehicle.VehicleID);
                }
                if ( vehicle.VehicleNumber != null)
                {
                    oDBUtility.AddParameters("@VehicleNumber", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.VehicleNumber);
                }
                if (vehicle.ClientID > 0)
                {
                    oDBUtility.AddParameters("@ClientID", DBUtilDBType.Integer, DBUtilDirection.In, 100, vehicle.ClientID);
                }
                if (vehicle.VehicleType != null)
                {
                    oDBUtility.AddParameters("@VehicleType", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.VehicleType);
                }
                if (vehicle.Model != null)
                {
                    oDBUtility.AddParameters("@Model", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Model);
                }
                if (vehicle.Brand != null)
                {
                    oDBUtility.AddParameters("@Brand", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Brand);
                }
                if (vehicle.Color != null)
                {
                    oDBUtility.AddParameters("@Color", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, vehicle.Color);
                }
                
                    oDBUtility.AddParameters("@IsActive", DBUtilDBType.Boolean, DBUtilDirection.In, 100, vehicle.IsActive);
                


                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_VEHICLE");
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
