
#region HEADER INFO
// Atos Origin India 
// 
// PROJECT       : GSP
// CLIENT        : AO-UK
// MODULE NAME   : Logging
// ENVIRONMENT   : .NET 2.0 Windows XP
// CATEGORY      : C# 2.0
// DEVELOPER     : V.Kartik
// Email-Id      : Kartik.V@atosorigin.com

/* Change History:

ChangeID        Date of change      Developer           Description
-------------------------------------------------------------------------------------------------
 */
#endregion



using System;
using System.Collections.Generic;
using System.Text;

using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Diagnostics;
using DAE.DAL.SQL;
using System.Xml;
using DAE.Configuration;
using System.Configuration;
using System.Collections;
using Microsoft.Extensions.Configuration;
using System.Configuration;

namespace DAE.Common.ExceptionLogging
{
    #region Logger Class

    /// <summary>
    /// This is the class that is used for logging the exceptions
    /// </summary>
    class Logger
    {

        private FPException _oFPException;
        private FPException.ErrorType ErrType;
        private string _sUserMessage;
        protected string FileNameFromConfig;

        private readonly IConfiguration Configuration;
        private readonly IDaeConfigManager _configuration;

        

        //CustomConfiguration oCustomConfiguration = new CustomConfiguration();
        //private FileStream fs;

        /// <summary>
        /// Enum for deciding where to log exception
        /// </summary>
        public enum LogDestination
        {
            Seperate,
            FILE,
            DB,
            EVTVWR
        }

        /// <summary>
        /// Property set for GSPException raised
        /// </summary>
        public FPException FpException
        {
            set
            {
                _oFPException = value;
            }
            get
            {
                return _oFPException;
            }
        }
        public Logger(IDaeConfigManager configuration)
        {
            //oGspCommon = (CommonSettings)System.Configuration.ConfigurationManager.GetSection("CustomConfiguration");
            //this.oCustomConfiguration = new CustomConfiguration();
            //this.oCustomConfiguration = (CustomConfiguration)ConfigurationManager.GetSection("CustomConfiguration");


            this._configuration = configuration;
        }
            /// <summary>
        /// Method to initaialize values raise from Exception class
        /// and call ReadConfigurations method
        /// </summary>
        /// <param name="oGSPEx">Exception instance that is thrown by the system</param>
        /// <param name="eErrorType">Error type of the exception thrown</param>
        /// <param name="sMessage">Message displayed to user on exception</param>
        public void ExceptionLogger(FPException oFpException, FPException.ErrorType eErrorType, string sMessage, Boolean bSqlError)
        {
            FpException = oFpException;
            ErrType = eErrorType;
            _sUserMessage = sMessage;
            XmlRead(bSqlError);
        }
        /// <summary>
        /// This Function reads xml file for loacation where error has to be logged.
        /// </summary>
        /*public void XmlRead(Boolean bSqlError)
        {
            string sDestinationValue;
            if (oGspCommon.CommonSettings.LoggingSettings.IsSeperate == false)
            {
                int iCntLogDestination=0;
                while (iCntLogDestination < oGspCommon.CommonSettings.LoggingSettings.LogDestination.Length)
                {
                    if (oGspCommon.CommonSettings.LoggingSettings.LogDestination[iCntLogDestination].Active == true)
                    {
                        sDestinationValue = oGspCommon.CommonSettings.LoggingSettings.LogDestination[iCntLogDestination].value.ToString();
                        if (sDestinationValue == LogDestination.FILE.ToString())
                        {
                            FileNameFromConfig = oGspCommon.CommonSettings.LoggingSettings.LogDestination[iCntLogDestination].FileName.ToString();
                        }
                        if (bSqlError == false)
                        {
                            CheckLoggingCondition(sDestinationValue);
                        }
                        else
                        {
                            LogToEventViewer();
                        }
                    }
                    iCntLogDestination++;
                }
            }*/
            //string sDestinationValue;
            //XmlTextReader oXmlReader = new XmlTextReader("C:\\GSP\\GSPCODE\\SRC1.1\\Configuration\\GSP.Common.config");
            //Boolean flag = true;
            //while (flag)
            //{
            //    oXmlReader.Read();
            //    if (oXmlReader.Name == "LoggingSettings")
            //    {
            //        flag = false;
            //        oXmlReader.MoveToNextAttribute();
            //        if (oXmlReader.Name == "IsSeperate" && oXmlReader.Value == "false")
            //        {
            //            while (!oXmlReader.EOF)
            //            {
            //                oXmlReader.Read();

            //                if (oXmlReader.Name == "LogDestination")
            //                {
            //                    oXmlReader.MoveToNextAttribute();
            //                    if (oXmlReader.Name == "Active" && oXmlReader.Value == "true")
            //                    {
            //                        oXmlReader.MoveToNextAttribute();
            //                        sDestinationValue = oXmlReader.Value.ToString();

            //                        if (sDestinationValue == LogDestination.FILE.ToString())
            //                        {
            //                            oXmlReader.MoveToNextAttribute();
            //                            FileNameFromConfig = oXmlReader.Value;
            //                        }
            //                        if (bSqlError == false)
            //                        {
            //                            CheckLoggingCondition(sDestinationValue);
            //                        }
            //                        else
            //                        {
            //                            LogToEventViewer();
            //                        }
            //                    }
            //                }
            //            }
            //        }
            //    }


            //}
       // }
            //string loggingSeparatevalue = ConfigurationSettings.AppSettings["IsLoggingSeperate"];
            //string sDestinationValue = ConfigurationSettings.AppSettings["LoggingDestination"];
            //if (bSqlError == false)
            //{
            //    if (loggingSeparatevalue == "false")
            //    {
            //        CheckLoggingCondition(sDestinationValue);
            //    }
            //    else
            //    {
            //        IsLoggingSeperate();
            //    }
            //}
            //else
            //{
            //    LogToEventViewer();
            //}


        /// <summary>
        /// Method to determine where to log depending on error type
        /// </summary>
        public void IsLoggingSeperate()
        {
            string errorTypeValue;

            if (ErrType == FPException.ErrorType.Information)
            {
                errorTypeValue = "Information";
                CheckLoggingCondition(errorTypeValue);
            }
            else if (ErrType == FPException.ErrorType.Warning)
            {
                errorTypeValue = "Warning";
                CheckLoggingCondition(errorTypeValue);
            }
            else
            {
                errorTypeValue = "Error";
                CheckLoggingCondition(errorTypeValue);
            }
        }

        /// <summary>
        /// method to log to destination depending on choice
        /// </summary>
        /// <param name="value"></param>
        public void CheckLoggingCondition(string value)
        {
            switch (value)
            {
                case "DB":
                    LogToDatabase();
                    break;
                case "FILE":
                    LogToFile();
                    break;
                case "EVTVWR":
                    LogToEventViewer();
                    break;
                default:
                    break;
            }
        }


        /// <summary>
        /// method to log exception information into database
        /// </summary>
        public void LogToDatabase()
        {
            try
            {
                /* DataSet dsGsp = new DataSet();
                 DBUtility oDbUtil = new DBUtility();
                 oDbUtil.AddParameters("@ErrorID", DBUtilDBType.Varchar, DBUtilDirection.In, 50, FpException.ErrorID.ToString());
                 oDbUtil.AddParameters("@InnerException", DBUtilDBType.Varchar, DBUtilDirection.In, 250, FpException.ErrorMsg.Replace("'", "''"));
                 dsGsp = oDbUtil.Execute_StoreProc_DataSet("GSP_SP_LogToDB");*/
            }
            catch (Exception)
            {
                LogToEventViewer();
            }
        }

        /// <summary>
        ///  method to log exception information into EventViewer
        /// </summary>
        public void LogToEventViewer()
        {
            //EventLog eLog = new EventLog("Application");
            //eLog.Source = "FPExceptionProject.dll";
            // eLog.WriteEntry(" " + FpException.ErrType + " " + FpException.ErrorMsg + " " + FpException.ErrorID + " " + FpException.ErrorDateTime);
        }


        /// <summary>
        ///  method to log exception information into File
        /// </summary>
        public void LogToFile()
        {
           
            FileStream fStream;
            //FileNameFromConfig = ConfigurationSettings.AppSettings["DestinationFileName"];
            try
            {
                fStream = new FileStream(FileNameFromConfig, FileMode.Append, FileAccess.Write);
                StreamWriter sWriter = new StreamWriter(fStream);
                sWriter.BaseStream.Seek(0, SeekOrigin.End);
                sWriter.WriteLine(" " + FpException.ErrType + " " + _sUserMessage + " " + FpException.ErrorID + " " + FpException.ErrorDateTime + " " + FpException.ErrorMsg);
                sWriter.Close();
            }
            catch (Exception ex)
            {
                LogToEventViewer();
                throw ex;
                
            }
        }

        public void XmlRead(Boolean bSqlError)
        {
            if (!false)
             {
                string LogDestination = this._configuration.LogDestination;


                this.FileNameFromConfig = this._configuration.LogDestination;
                this.CheckLoggingCondition("FILE"); 
             //   for (int iCntLogDestination = 0; iCntLogDestination < LogDestination.Length; iCntLogDestination++)
             //    {
             //        if (true)
             //        {
             //           // string sDestinationValue = this.oCustomConfiguration.CommonSettings.LoggingSettings.LogDestination[iCntLogDestination].value.ToString();
             //            if (true)
             //            {
             //               this.FileNameFromConfig = this._configuration.LogDestination;
             //            }
             //            //if (!bSqlError)
             //            //{
             //            //    this.CheckLoggingCondition(sDestinationValue);
             //            //}
             //            //else
             //            //{
             //            //    this.CheckLoggingCondition(sDestinationValue);

             //            //   // this.LogToEventViewer();
             //            //}
             //        }
             //    }
             }
        }
    }
    #endregion
}
