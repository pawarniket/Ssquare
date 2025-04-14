    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using System.Data;
    using DAE.DAL.SQL;
    using DAE.Configuration;
    using System;
    using MS.SSquare.API.Models;
    using MS.SSquare.API;
    using Microsoft.AspNetCore.Authorization;
using System.Net.Mail;

namespace MS.SSquare.API.Controllers
{
   // [Authorize]
    [ApiController]
    public class APILogsController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private ServiceRequestProcessor oServiceRequestProcessor;

        public APILogsController(IDaeConfigManager configuration)
        {
            _configurationIG = configuration;
        }

        [Route("APILogs/get")]
        [HttpPost]
        public IActionResult Get(APILogs aPILogs)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);

             
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_City");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.ProcessRequest(ds));
            }
            catch (Exception ex)
            {
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return BadRequest(oServiceRequestProcessor.onError(ex.Message));
            }
        }
        [Route("Invitations/Team")]
        [HttpPost]
        public IActionResult teamInvitation()
        {
            try
            {
                //DBUtility oDBUtility = new DBUtility(_configurationIG);
                //DataTable settingTable = oDBUtility.Execute_StoreProc_DataSet("MSP_GET_SETTINGS").Tables[0];

                // Create a new MailMessage instance
                MailMessage message = new MailMessage();

                // Set the sender email address
                message.From = new MailAddress("nss@grcautomate.com", "Rishabh");

                // Set the recipient email address
                message.To.Add("rishabhm5474@gmail.com");

                // Set the email subject
                message.Subject = "Rishabh" + ": Invitation from " + "Youngesters";

                string htmlBody = @"
                <html>
                <head>
                    <title>Invitation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #6c757d;
                            background-color: #f8f9fa;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #343a40;
                        }
                        p {
                            margin-bottom: 15px;
                        }
                        ul {
                            margin: 0;
                            padding-left: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: #fff !important;
                            text-decoration: none;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        }
                        .cta{
                            text-align: center;                           
                        }
                        .button:hover {
                            background-color: #0056b3;
                            color: #fff !important;
                        }
                     
                        .button:visited,
                        .button:active {
                            background-color: #007bff;
                            color: #fff !important;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h1>Invitation to Join the Team</h1>
                        <p>Dear " + @" ,</p>
                        <p>You have been invited to join the team <strong>"  + @"</strong>.</p>                                               
                         <br/>
                        <br/>
                        <div class=""cta"">
                            <a href='" + @"/AccetpInvitation/Team?TeamID="  + @"&PlayerID="  + @"' class='button'>Accept Invitation </a>                             
                        </div>
                        
                </body>
                </html>";


                // Set the email body
                message.Body = htmlBody;
                message.IsBodyHtml = true;

                // Create an instance of the SmtpClient class
                SmtpClient smtpClient = new SmtpClient("smtp.stackmail.com", (int)Convert.ToInt64(587));

                // Set your SMTP server credentials if required
                smtpClient.Credentials = new System.Net.NetworkCredential("nss@grcautomate.com", "Bp37aaca8");

                // Enable SSL encryption if required
               // smtpClient.EnableSsl = Convert.ToBoolean(settingTable.Rows[0]["use_ssl_tls"].ToString());

                try
                {
                    // Send the email
                    smtpClient.Send(message);
                }
                catch (Exception ex)
                {
                    oServiceRequestProcessor = new ServiceRequestProcessor();
                    //oDBUtility = new DBUtility(_configurationIG);
                    //oDBUtility.AddParameters("@method_name", DBUtilDBType.Varchar, DBUtilDirection.In, 50, "Invitation/Team");
                    //oDBUtility.AddParameters("@request", DBUtilDBType.Varchar, DBUtilDirection.In, -1, JsonSerializer.Serialize(invite));
                    //oDBUtility.AddParameters("@response", DBUtilDBType.Varchar, DBUtilDirection.In, -1, ex.Message);
                    //DataSet ds = oDBUtility.Execute_StoreProc_DataSet("MSP_INSERT_LOG");

                    return Ok(oServiceRequestProcessor.customeMessge(300, "Failed to Invite"));
                }
                finally
                {
                    // Dispose of the SmtpClient and MailMessage objects
                    smtpClient.Dispose();
                    message.Dispose();
                }

                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.customeMessge(100, "Invite Sent Successfully"));
            }
            catch (Exception ex)
            {
                //DBUtility oDBUtility = new DBUtility(_configurationIG);
                //oDBUtility.AddParameters("@method_name", DBUtilDBType.Varchar, DBUtilDirection.In, 50, "Invitation/Team");
                //oDBUtility.AddParameters("@request", DBUtilDBType.Varchar, DBUtilDirection.In, -1, JsonSerializer.Serialize(invite));
                //oDBUtility.AddParameters("@response", DBUtilDBType.Varchar, DBUtilDirection.In, -1, ex.Message);
                //DataSet ds = oDBUtility.Execute_StoreProc_DataSet("MSP_INSERT_LOG");
                oServiceRequestProcessor = new ServiceRequestProcessor();
                return Ok(oServiceRequestProcessor.customeMessge(300, "Failed to Invite"));
            }
        }
    }
}
