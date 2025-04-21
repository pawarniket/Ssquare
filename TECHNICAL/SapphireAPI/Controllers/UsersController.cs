using DAE.Configuration;
using DAE.DAL.SQL;
using MS.SSquare.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System;
using DAE.Common.EncryptionDecryption;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Numerics;
using System.Diagnostics;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Net;


namespace MS.SSquare.API.Controllers
{
    [ApiController]
       

    public class UsersController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private readonly IWebHostEnvironment _env;
        private ServiceRequestProcessor oServiceRequestProcessor;
        private readonly IJwtAuth jwtAuth;
        private readonly EmailController _emailController;

        public UsersController(IDaeConfigManager configuration, IWebHostEnvironment env)
        {
            _configurationIG = configuration;
            _env = env;
            this.jwtAuth = jwtAuth;
            _emailController = new EmailController(configuration);
        }



        [Route("user/login")]
        [HttpPost]
        public IActionResult Login(Users user)
        {
            try
            {


                ConfigHandler oEncrDec;
                oEncrDec = new ConfigHandler(this._configurationIG.EncryptionDecryptionAlgorithm, this._configurationIG.EncryptionDecryptionKey);

                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@Email", DBUtilDBType.Varchar, DBUtilDirection.In, 50, user.Email);

                //oDBUtility.AddParameters("@Password", DBUtilDBType.Varchar, DBUtilDirection.In, 500, users.Password);

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_LOGIN");


                int status_code = Convert.ToInt32(ds.Tables[0].Rows[0]["status_code"].ToString());


                if (status_code == 100)
                {
                    string password = ds.Tables[0].Rows[0]["PasswordHash"].ToString();

                    if (user.Password == password)
                    {
                        oServiceRequestProcessor = new ServiceRequestProcessor();
                        return Ok(oServiceRequestProcessor.ProcessRequest(ds));
                    }
                    else
                    {
                        oServiceRequestProcessor = new ServiceRequestProcessor();
                        return Ok(oServiceRequestProcessor.onUserNotFound());
                    }
                }
                else if(status_code == 200)
                {

                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return Ok(oServiceRequestProcessor.onUserNotFound());
                }
                else
                {
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    return Ok(oServiceRequestProcessor.onUserNotFound());
                }

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }



        [Route("Users/Get")]
        [HttpPost]
        public IActionResult add(Users user)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                if (user.UserID != 0 && user.UserID != null)
                {
                    oDBUtility.AddParameters("@USERID", DBUtilDBType.Integer, DBUtilDirection.In, 50, user.UserID);
                }
            

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_USER");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }

        }



        [Route("Users/insert")]
        [HttpPost]
        public IActionResult Post(Users user)
        {


            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

                oDBUtility.AddParameters("@FullName", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.FullName);
                oDBUtility.AddParameters("@Role", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Role);
                oDBUtility.AddParameters("@Phone", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Phone);


                if (user.Email != null)
                {
                    oDBUtility.AddParameters("@Email", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Email);
                }

                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_INSERT_USERS");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }


        [Route("users/update")]
        [HttpPost]
        public IActionResult USERUPDATE(Users user)
        {


            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

                if (user.UserID > 0)
                {
                    oDBUtility.AddParameters("@UserID", DBUtilDBType.Integer, DBUtilDirection.In, 10, user.UserID);
                }
                if (user.FullName != null)
                {
                    oDBUtility.AddParameters("@FullName", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.FullName);
                }
           
                if (user.Role != null)
                {
                    oDBUtility.AddParameters("@Role", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Role);
                }
                if (user.Phone != null)
                {
                    oDBUtility.AddParameters("@Phone", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Phone);
                }


                if (user.Email != null)
                {
                    oDBUtility.AddParameters("@Email", DBUtilDBType.Nvarchar, DBUtilDirection.In, 100, user.Email);
                }


                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_UPDATE_USERS");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));

            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }


        [Route("users/delete")]
        [HttpPost]
        public IActionResult delete(Users user)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                {

                    if (user.UserID > 0)
                    {
                        oDBUtility.AddParameters("@UserID", DBUtilDBType.Integer, DBUtilDirection.In, 10, user.UserID);
                    }



                    DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_DELETE_USERS");

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

