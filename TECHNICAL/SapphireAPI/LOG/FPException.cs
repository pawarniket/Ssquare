#region HEADER INFO
// Atos Origin India 
// 
// PROJECT       : GSP
// CLIENT        : AO-UK
// MODULE NAME   : Exception
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
using DAE.DAL.SQL;
using System.Configuration;
using DAE.Configuration;

namespace DAE.Common.ExceptionLogging
{
    #region ExceptionClass

    /// <summary>
    /// This class is used for catching exceptions.
    /// </summary>
    [Serializable]
    public class FPException : ApplicationException
    {
        private readonly IDaeConfigManager _configurationIG;
        private DateTime _dErrorDateTime;
        private int _iErrorID;
        private string _sErrorMsg;
        private ErrorType errType;

        /// <summary>
        /// Enumeration defined to determine type of error
        ///  </summary>
        public enum ErrorType
        {
            Error,
            Information,
            Warning,
            Unspecified
        }

        /// <summary>
        /// Property of Date time for the error which is being raised.
        /// </summary>
        public DateTime ErrorDateTime
        {
            get
            {
                return _dErrorDateTime;
            }
            set
            {
                _dErrorDateTime = value;
            }
        }
        /// <summary>
        /// Property of Errr ID for the error which is being raised.
        /// </summary>
        public int ErrorID
        {
            get
            {
                return _iErrorID;
            }
            set
            {
                _iErrorID = value;
            }
        }
        /// <summary>
        /// Property of Error Message for the error which is being raised.
        /// </summary>
        public string ErrorMsg
        {
            get
            {
                return _sErrorMsg;
            }
            set
            {
                _sErrorMsg = value;
            }
        }
        /// <summary>
        /// Property of the error type for the error which is being raised.
        /// </summary>
        public ErrorType ErrType
        {
            get
            {

                return errType;
            }

            set
            {
                errType = value;
            }
        }

        public FPException(IDaeConfigManager configuration)
        {
            _configurationIG = configuration;
        }


        //public GSPException(int iLocalisationId, string sErrorMsg, ErrType et)
        //{
        //    string UserMessage=string.Empty;
        //    try
        //    {
        //        this.ErrorDateTime = System.DateTime.Now;
        //        this.ErrorType = et;

        //        this.ErrorMsg = sErrorMsg;
        //        this.LocalizationID = iLocalisationId;
        //        UserMessage = GetErrorMsg("English", iLocalisationId);
        //        Logger g1 = new Logger();
        //        g1.ExceptionLogger(this, this.ErrorType, UserMessage,false);
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger g1 = new Logger();
        //        g1.ExceptionLogger(this, this.ErrorType, UserMessage,true);
        //    }
        //}
        /// <summary>
        /// Constructor which Calls the logger and initialises the properties of the error which is being raised.
        /// </summary>
        /// <param name="sErrorMsg">System error message</param>
        /// <param name="sInnerException">Inner Exception raised</param>
        /// <param name="et">Error type</param>
        /// <param name="UserMessage">retuns user message by refernce at the calling environment</param>
        public FPException(int iErrorID, string sErrorMsg, ErrorType et, ref string UserMessage)
        {
            try
            {
                this.ErrorDateTime = System.DateTime.Now;
                this.ErrType = et;
                this.ErrorMsg = sErrorMsg;
                this.ErrorID = _iErrorID;
                UserMessage = GetErrorMsg("English", iErrorID);
                Logger log = new Logger(_configurationIG);
                log.ExceptionLogger(this, this.ErrType, UserMessage, false);
            }
            catch (Exception)
            {
                Logger log = new Logger(_configurationIG);
                log.ExceptionLogger(this, this.ErrType, UserMessage, true);
            }
        }


        public FPException(string sErrorMsg, ErrorType eType, IDaeConfigManager configuration)
        {
            try
            {
                this.ErrorDateTime = System.DateTime.Now;
                this.ErrType = eType;
                this.ErrorMsg = sErrorMsg;
                Logger log = new Logger(configuration);
                log.ExceptionLogger(this, this.ErrType, ErrorMsg, false);
            }
            catch (Exception)
            {
                Logger log = new Logger(configuration);
                log.ExceptionLogger(this, this.ErrType, sErrorMsg, true);

            }
        }


        /// get user error message from  GSP_TBL_LANGUAGES_ERRORS depending on your errorID and languageID
        /// </summary>
        /// <param name="sLanguageID">languageID</param>
        /// <param name="sErrorID">ErrorID</param>
        /// <returns></returns>
        /*public string GetErrorMsg(string sLanguageName, int iLocalisationId)
        {
            string sErrMsg = string.Empty; ;
            try
            {
                DataSet dsGsp = new DataSet();
                DBUtility oDbUtil = new DBUtility();
                oDbUtil.AddParameters("@LanguageName", DBUtilDBType.Varchar, DBUtilDirection.In, 50, sLanguageName.ToString());
                oDbUtil.AddParameters("@LocalizationId", DBUtilDBType.Integer, DBUtilDirection.In, 50, iLocalisationId.ToString());
                dsGsp = oDbUtil.Execute_StoreProc_DataSet("GSP_SP_GetErrorMsg");
                if (dsGsp.Tables[0].Rows.Count > 0)
                {
                    sErrMsg = dsGsp.Tables[0].Rows[0][0].ToString();
                }
                else
                {
                    sErrMsg = "No data present";
                }
            }
            catch (System.Exception ex)
            {
               Logger log = new Logger();y
         * 
               log.ExceptionLogger(this, this.ErrType, "", true);
                
            }
            return sErrMsg;
        }*/

        public string GetErrorMsg(string sLanguageName, int iErrorID)
        {
            string sErrMsg = string.Empty;
            try
            {

            }
            catch (Exception)
            {
                Logger log = new Logger(_configurationIG);
                log.ExceptionLogger(this, this.ErrType, "", true);
            }
            return sErrMsg;
        }

    }
    # endregion
}
