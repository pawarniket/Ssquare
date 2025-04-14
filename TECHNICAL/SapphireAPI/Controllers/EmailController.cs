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
using DAE.Common.EncryptionDecryption;
using System.Net;
using System.Web;

namespace MS.SSquare.API.Controllers
{
 
    [ApiController]
    //[Authorize]

    public class EmailController : ControllerBase
    {
        private readonly IDaeConfigManager _configurationIG;
        private ServiceRequestProcessor oServiceRequestProcessor;

        public EmailController(IDaeConfigManager configuration)
        {
            _configurationIG = configuration;
        }

        [Route("AssessmentAssign/Email")]
        [HttpPost]
        public IActionResult AssignedAssessmentEmail(
            string user_fname, 
            string user_lname,
            string assessment_name,
            string client_name, 
            string due_date 
            )
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@TemplateID", DBUtilDBType.Integer, DBUtilDirection.In, 10, 5);
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_EMAILTEMPLATE");

                if (ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Status = 300, Message = "Email template not found." });
                }

                DataRow templateRow = ds.Tables[0].Rows[0];
                string subject = templateRow["Subject"].ToString();
                string body = templateRow["Body"].ToString();
                //string link = ds.Tables[0].Rows[0]["Url"].ToString() + "=";
                // Encode the EncryptUserID before concatenating it
                //string encodedEncryptUserID = HttpUtility.UrlEncode(user.EncryptUserID);
               // string resetLink = $"{link}{encodedEncryptUserID}";
               // string userName = $"{user.FirstName} {user.LastName}";

                string finalEmailBody = body
                    .Replace("{user_fname}", user_fname)
                    .Replace("{user_lname}", user_lname)
                    .Replace("{assessment_name}", assessment_name)
                    .Replace("{client_name}", client_name)
                    .Replace("{due_date}", due_date);
                //DBUtility oDBUtility = new DBUtility(_configurationIG);
                //DataTable settingTable = oDBUtility.Execute_StoreProc_DataSet("USP_GET_CLIENTAUDIT").Tables[0];

                // Create a new MailMessage instance
                MailMessage message = new MailMessage()
                {
                    From = new MailAddress("nss@grcautomate.com", "Sapphire"),
                    Subject = subject,
                    Body = finalEmailBody,
                    IsBodyHtml = true
                };
                // Set the sender email address
                message.From = new MailAddress("nss@grcautomate.com", "Sapphire");

                // Set the recipient email address
                 message.To.Add("charmimeht03@gmail.com");



                // Set the email body
               // message.Body = htmlBody;
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

      

        [Route("User/SendResetPasswordEmail")]
        [HttpPost]
        public IActionResult SendResetPasswordEmail([FromBody] Users user)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@TemplateID", DBUtilDBType.Integer, DBUtilDirection.In, 10, 1);
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_EMAILTEMPLATE");

                if (ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Status = 300, Message = "Email template not found." });
                }

                DataRow templateRow = ds.Tables[0].Rows[0];
                string subject = templateRow["Subject"].ToString();
                string body = templateRow["Body"].ToString();
                string link = ds.Tables[0].Rows[0]["Url"].ToString()+"=";
                // Encode the EncryptUserID before concatenating it
                string encodedEncryptUserID = HttpUtility.UrlEncode(user.EncryptUserID);
                string resetLink = $"{link}{user.UserID}";
                string userName = $"{user.FirstName} {user.LastName}";

                string finalEmailBody = body
                    .Replace("{userName}", userName)
                    .Replace("{resetLink}", resetLink);

                MailMessage message = new MailMessage
                {
                    From = new MailAddress("nss@grcautomate.com", "Sapphire"),
                    Subject = subject,
                    Body = finalEmailBody,
                    IsBodyHtml = true
                };

                message.To.Add(user.Email);
                SmtpClient smtpClient = new SmtpClient("smtp.stackmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("nss@grcautomate.com", "Bp37aaca8")
                };

                smtpClient.Send(message);
                DBUtility oDBUtility1 = new DBUtility(_configurationIG);
                // Update parameters
                oDBUtility1.AddParameters("@UserID", DBUtilDBType.Integer, DBUtilDirection.In, 10, user.UserID);

                // Execute the update
                DataSet updateResult = oDBUtility1.Execute_StoreProc_DataSet("USP_UPDATE_USERS");
                return Ok(new { StatusCode = 100, Message = "Email sent successfully!" });

            }

            catch (Exception ex)
            {
                return BadRequest(new { Status = 500, Message = ex.Message });
            }
          
        }

        [Route("User/SendUserAddEmail")]
        [HttpPost]
        public IActionResult SendUserAddEmail([FromBody] Users user)
        {
            try
            {
                DBUtility oDBUtility = new DBUtility(_configurationIG);
                oDBUtility.AddParameters("@TemplateID", DBUtilDBType.Integer, DBUtilDirection.In, 10, 2);
                DataSet ds = oDBUtility.Execute_StoreProc_DataSet("USP_GET_EMAILTEMPLATE");

                if (ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Status = 300, Message = "Email template not found." });
                }

                DataRow templateRow = ds.Tables[0].Rows[0];
                string subject = templateRow["Subject"].ToString();
                string body = templateRow["Body"].ToString();
                string link = ds.Tables[0].Rows[0]["Url"].ToString() + "=";
                // Encode the EncryptUserID before concatenating it
                string encodedEncryptUserID = HttpUtility.UrlEncode(user.EncryptUserID);
                string resetLink = $"{link}{user.UserID}";
               

                string finalEmailBody = body
                    
                    .Replace("{resetLink}", resetLink);

                MailMessage message = new MailMessage
                {
                    From = new MailAddress("nss@grcautomate.com", "Sapphire"),
                    Subject = subject,
                    Body = finalEmailBody,
                    IsBodyHtml = true
                };

                message.To.Add(user.Email);
                SmtpClient smtpClient = new SmtpClient("smtp.stackmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("nss@grcautomate.com", "Bp37aaca8")
                };

                smtpClient.Send(message);
                DBUtility oDBUtility1 = new DBUtility(_configurationIG);
                return Ok(new { StatusCode = 100, Message = "Email sent successfully!" });

            }

            catch (Exception ex)
            {
                return BadRequest(new { Status = 500, Message = ex.Message });
            }

        }

    }
}




