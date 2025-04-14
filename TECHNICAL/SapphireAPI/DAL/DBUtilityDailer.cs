#region HEADER INFO

// 4P FZ LLC 
// PROJECT       : DM V2.0
// CLIENT        : DCH
// MODULE NAME   : SQL Data Access Library
// ENVIRONMENT   : .NET 2.0 Windows 2003 - XP
// CATEGORY      : C# 2.0

/* Change History:

ChangeID            Date of change          Developer           Description
-------------------------------------------------------------------------------------------------
   

 */
#endregion

using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Configuration;
using System.Diagnostics;
using System.Xml;
using DAE.Configuration;

namespace DAE.DAL.SQL
{

    #region Enum Declaration



    /// <summary>
    /// Enum for the datatypes 
    /// </summary>
    /// 
    public enum DBUtilDBTypeDailer
    {
        Boolean = SqlDbType.Bit,
        Byte = SqlDbType.TinyInt,
        Date = SqlDbType.SmallDateTime,
        DateTime = SqlDbType.DateTime,
        Varchar = SqlDbType.VarChar,
        Char = SqlDbType.Char,
        Decimal = SqlDbType.Decimal,
        Numeric = SqlDbType.Float,
        Integer = SqlDbType.Int,
        Guid = SqlDbType.UniqueIdentifier,
        Text = SqlDbType.Text,
        XML = SqlDbType.Xml
    }

    /// <summary>
    /// Direction of the parameters
    /// </summary>
    public enum DBUtilDirectionDailer
    {

        In = ParameterDirection.Input,
        Out = ParameterDirection.Output,
    }

    #endregion


    #region DBUtility Class

    /// <summary>
    /// This is the class that is used for SQL Data operations
    /// </summary>
    [Serializable]
    public class DBUtilityDailer
    {

        private Hashtable _htParamCollection; //Stores the parameters added
        private Hashtable _htParamOutPut; //Stores the Output Parameters
        private IDbTransaction _oTransaction;
        private IDbConnection _oCnnConnection;

        private readonly IDaeConfigManager _configuration;

        //DAE.Common.Common oCommon = new DAE.Common.Common();
        /// <summary>
        /// Constructor of the class
        /// </summary>
        public DBUtilityDailer(IDaeConfigManager configuration)
        {
            _htParamCollection = new Hashtable();
            _htParamOutPut = new Hashtable();
            this._configuration = configuration;
        }

        /// <summary>
        /// Starts the transaction if requried
        /// </summary>
        public void StartTransaction()
        {
            try
            {
                if (_oCnnConnection == null)
                {
                    _oCnnConnection = GetConnection();
                    _oTransaction = _oCnnConnection.BeginTransaction();
                }
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-StartTransaction(): " +  Ex.Message.ToString() , Environment.UserName);
                throw;
            }

        }

        /// <summary>
        /// Rolls back a transaction if error occurs.
        /// </summary>
        public void RollBackTransaction()
        {
            try
            {
                if (_oTransaction != null)
                {
                    _oTransaction.Rollback();
                }
                if (_oCnnConnection != null)
                {
                    if (_oCnnConnection.State == ConnectionState.Open)
                    {
                        _oCnnConnection.Close();
                    }
                }
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-RollBackTransaction(): " +  Ex.Message.ToString() , Environment.UserName);
                throw;
            }
            finally
            {
                _oTransaction.Dispose();
                if (_oCnnConnection.State == ConnectionState.Open)
                {
                    _oCnnConnection.Close();
                }
            }

        }

        /// <summary>
        /// Commits a Transaction
        /// </summary>
        public void CommitTransaction()
        {
            try
            {
                if (_oCnnConnection != null)
                {
                    _oTransaction.Commit();
                    _oCnnConnection.Close();
                }
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-CommitTransaction(): " +  Ex.Message.ToString() , Environment.UserName);
                throw;
            }
            finally
            {
                _oTransaction.Dispose();
                if (_oCnnConnection.State == ConnectionState.Open)
                {
                    _oCnnConnection.Close();
                }
            }
        }

        /// <summary>
        /// Adds paramater to local hastable
        /// </summary>
        /// <param name="psParamName">Actual name of the paramter</param>
        /// <param name="puType">Type if Parameter</param>
        /// <param name="puDirection">Direction of Parameter</param>
        /// <param name="piSize">Size of the Parameter</param>
        /// <param name="psValue">The actual value that is passed for the parameter</param>
        public void AddParameters(string psParamName, DBUtilDBTypeDailer puType,
            DBUtilDirectionDailer puDirection, int piSize, object psValue)
        {
            try
            {
                UtilParamsDailer objParams = new UtilParamsDailer();
                objParams.ParamName = psParamName;
                objParams.ParamType = (SqlDbType)puType;
                objParams.Direction = (ParameterDirection)puDirection;
                if (puDirection == DBUtilDirectionDailer.Out)
                {
                    _htParamOutPut.Add(psParamName, "");
                }
                objParams.ParamSize = piSize;
                objParams.ParamValue = psValue.ToString();
                _htParamCollection.Add(psParamName, objParams);
            }
            catch
            {
                throw;
            }
        }


        public void AddParametersForBTS(string psParamName, string psType, string psDirection, string piSize, string psValue)
        {

            try
            {
                if (psDirection.ToLower() == "in")
                {
                    if (psType.ToLower() == "boolean")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Boolean, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "byte")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Byte, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "date")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Date, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "datetime")
                        AddParameters(psParamName, DBUtilDBTypeDailer.DateTime, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "char")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Char, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "decimal")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Decimal, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "numeric")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Numeric, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "integer")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Integer, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "guid")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Guid, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "text")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Text, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "varchar")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Varchar, DBUtilDirectionDailer.In, Convert.ToInt32(piSize), psValue);
                }
                else if (psDirection.ToLower() == "out")
                {
                    if (psType.ToLower() == "boolean")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Boolean, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "byte")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Byte, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "date")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Date, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "datetime")
                        AddParameters(psParamName, DBUtilDBTypeDailer.DateTime, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "char")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Char, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "decimal")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Decimal, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "numeric")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Numeric, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "integer")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Integer, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "guid")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Guid, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "text ")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Text, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "varchar")
                        AddParameters(psParamName, DBUtilDBTypeDailer.Varchar, DBUtilDirectionDailer.Out, Convert.ToInt32(piSize), psValue);
                }


            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Returns a dataset for the stored procedure name passed
        /// </summary>
        /// <param name="psStoreProcName">Name of the Stored Procedure to be executed</param>
        /// <returns></returns>
        public XmlDocument Execute_StoreProc_DataSetForBTS(string psStoreProcName)
        {
            DataSet dsResult = new DataSet();
            UtilParamsDailer objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;
            SqlDataAdapter objSqlDataAdapter = null;

            try
            {
                objConnection = GetConnection();
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;

                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();

                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    objSqlParams = new SqlParameter();
                    objSqlParams.ParameterName = objParams.ParamName;
                    objSqlParams.SqlDbType = (SqlDbType)objParams.ParamType;
                    objSqlParams.Direction = objParams.Direction;
                    if (objParams.Direction == ParameterDirection.Output)
                    {
                        objSqlParams.Size = objParams.ParamSize;

                    }

                    objSqlParams.Value = objParams.ParamValue;
                    objCommand.Parameters.Add(objSqlParams);
                }
                objSqlDataAdapter = new SqlDataAdapter(objCommand);
                objSqlDataAdapter.Fill(dsResult);
                XmlDocument oXMLDoc = new XmlDocument();
                oXMLDoc.LoadXml(dsResult.GetXml());
                return oXMLDoc;
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-Execute_StoreProc_DataSet(): " +  Ex.Message.ToString() + " " + Environment.UserName, Environment.UserName);
                throw Ex;


            }
            finally
            {
                objCommand.Dispose();
                objSqlDataAdapter.Dispose();
                if (objConnection.State == ConnectionState.Open)
                    objConnection.Close();

            }

        }

        /// <summary>
        /// This method executes a Transactional code.
        /// </summary>
        /// <param name="psStoreProcName">Name of the Stored Procedure to be executed</param>
        /// <returns></returns>
        public bool Execute_StoreProc_Transactional(string psStoreProcName)
        {
            string sOutValue;
            UtilParamsDailer objParams;
            SqlParameter objSqlParams;
            SqlCommand objCommand = null;
            try
            {
                // StartTransaction();
                objCommand = new SqlCommand(psStoreProcName, (SqlConnection)_oCnnConnection);
                objCommand.CommandType = CommandType.StoredProcedure;
                objCommand.Transaction = (SqlTransaction)_oTransaction;
                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();
                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    objSqlParams = new SqlParameter();
                    objSqlParams.ParameterName = objParams.ParamName;
                    objSqlParams.SqlDbType = (SqlDbType)objParams.ParamType;
                    objSqlParams.Direction = objParams.Direction;
                    objSqlParams.Size = objParams.ParamSize;
                    objSqlParams.Value = objParams.ParamValue;
                    objCommand.Parameters.Add(objSqlParams);
                }
                objCommand.ExecuteNonQuery();
                en = _htParamCollection.GetEnumerator();
                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    if (objParams.Direction == (ParameterDirection)DBUtilDirectionDailer.Out)
                    {
                        sOutValue = objCommand.Parameters[en.Key.ToString()].Value.ToString();
                        _htParamOutPut[en.Key.ToString()] = sOutValue;
                    }
                }
                //CommitTransaction();
                return true;
            }
            catch (Exception Ex)
            {
                RollBackTransaction();
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-Execute_StoreProc(): " +  Ex.Message.ToString() + " " + Environment.UserName, Environment.UserName);
                throw;
            }
            finally
            {
                objCommand.Dispose();
            }
        }

        /// <summary>
        /// Returns the active open connection
        /// </summary>
        /// <returns>SQLConnection</returns>
        private SqlConnection GetConnection()
        {
            try
            {
                // CustomConfiguration oCustomConfiguration = new CustomConfiguration();
                //oCustomConfiguration = (CustomConfiguration)ConfigurationManager.GetSection("CustomConfiguration");
                // string sConnectString = this._oCnnConnection

                // string sConnectString = ConfigurationSettings.AppSettings["ConnectionString"].ToString();
                string sConnectString = this._configuration.MirajPopExpressCS;
                    ;
                SqlConnection conObjConnect = new SqlConnection(sConnectString);
                conObjConnect.Open();
                return conObjConnect;
            }
            catch (Exception ex)
            {
               // oCommon.IsDBConnectionError = true;
                throw ex;
            }
        }

        /// <summary>
        /// Returns a dataset for the stored procedure name passed
        /// </summary>
        /// <param name="psStoreProcName">Name of the Stored Procedure to be executed</param>
        /// <returns></returns>
        public DataSet Execute_StoreProc_DataSet(string psStoreProcName)
        {
            DataSet dsResult = new DataSet();
            UtilParamsDailer objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;
            SqlDataAdapter objSqlDataAdapter = null;

            try
            {
                objConnection = GetConnection();
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;

                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();

                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    objSqlParams = new SqlParameter();
                    objSqlParams.ParameterName = objParams.ParamName;
                    objSqlParams.SqlDbType = (SqlDbType)objParams.ParamType;
                    objSqlParams.Direction = objParams.Direction;
                    if (objParams.Direction == ParameterDirection.Output)
                    {
                        objSqlParams.Size = objParams.ParamSize;

                    }

                    objSqlParams.Value = objParams.ParamValue;
                    objCommand.Parameters.Add(objSqlParams);
                }
                objSqlDataAdapter = new SqlDataAdapter(objCommand);
                objSqlDataAdapter.Fill(dsResult);
                return dsResult;
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-Execute_StoreProc_DataSet(): " +  Ex.Message.ToString() + " " + Environment.UserName, Environment.UserName);
                throw Ex;


            }
            finally
            {
                objCommand.Dispose();
                objSqlDataAdapter.Dispose();
                if (objConnection.State == ConnectionState.Open)
                    objConnection.Close();

            }

        }

        /// <summary>
        /// Returns a boolean value after executing a stored procedure
        /// </summary>
        /// <param name="psStoreProcName">Name of the Stored Procedure to be executed</param>
        /// <returns>Boolean</returns>
        public bool Execute_StoreProc(string psStoreProcName)
        {
            string sOutValue;
            UtilParamsDailer objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;

            try
            {
                objConnection = GetConnection();
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;
                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();
                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    objSqlParams = new SqlParameter();
                    objSqlParams.ParameterName = objParams.ParamName;
                    objSqlParams.SqlDbType = (SqlDbType)objParams.ParamType;
                    objSqlParams.Direction = objParams.Direction;
                    objSqlParams.Size = objParams.ParamSize;
                    objSqlParams.Value = objParams.ParamValue;
                    objCommand.Parameters.Add(objSqlParams);
                }
                objCommand.ExecuteNonQuery();

                en = _htParamCollection.GetEnumerator();
                while (en.MoveNext())
                {
                    objParams = (UtilParamsDailer)en.Value;
                    if (objParams.Direction == (ParameterDirection)DBUtilDirectionDailer.Out)
                    {
                        sOutValue = objCommand.Parameters[en.Key.ToString()].Value.ToString();
                        _htParamOutPut[en.Key.ToString()] = sOutValue;
                    }
                }
                if (objConnection != null && objConnection.State == ConnectionState.Open)
                {
                    objConnection.Close();
                }
                return true;
            }
            catch (Exception Ex)
            {

                //ErrorHandler objERR = new ErrorHandler();
                ///objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-Execute_StoreProc(): " +  Ex.Message.ToString() + " " + Environment.UserName, Environment.UserName);
                throw;
            }
            finally
            {
                objCommand.Dispose();
                if (objConnection.State == ConnectionState.Open)
                    objConnection.Close();

            }
        }

        /// <summary>
        /// Returns the output value of the parameter after the execution of the stored procedure
        /// </summary>
        /// <param name="psOutputParamName">Actual name of the Output parameter</param>
        /// <returns>Output value returned by the Stored procedure</returns>
        public string getOutputParameterValue(string psOutputParamName)
        {
            try
            {
                return _htParamOutPut[psOutputParamName].ToString();
            }
            catch (Exception Ex)
            {
                //ErrorHandler objERR = new ErrorHandler();
                //objERR.WriteError(DateTime.Now +  ", DAL.DBUtility-getOutputParameterValue(): " +  Ex.Message.ToString() + " " + Environment.UserName, Environment.UserName);
                throw;
            }
        }

        /// <summary>
        /// Clears all the parameters in the hastable collection
        /// </summary>
        public void ClearTransactionalParams()
        {
            _htParamCollection.Clear();
            _htParamOutPut.Clear();
        }

    }

    #endregion


    #region UtilParams Class


    /// <summary>
    /// Class deals with the parameters collection to be passed
    /// </summary>
    [Serializable]
    public class UtilParamsDailer
    {
        string sParamName;
        SqlDbType oParamType;
        ParameterDirection oDirection;
        int iParamSize;
        string sParamValue;

        /// <summary>
        /// Name of the parameter
        /// </summary>
        public string ParamName
        {
            get { return sParamName; }
            set { sParamName = value; }
        }

        /// <summary>
        /// Type of the parameter
        /// </summary>
        public SqlDbType ParamType
        {
            get { return oParamType; }
            set { oParamType = value; }
        }

        /// <summary>
        /// Direction of the parameter (IN/OUT)
        /// </summary>
        public ParameterDirection Direction
        {
            get { return oDirection; }
            set { oDirection = value; }
        }

        /// <summary>
        /// Size of the parameter
        /// </summary>
        public int ParamSize
        {
            get { return iParamSize; }
            set { iParamSize = value; }
        }

        /// <summary>
        /// Actual value of the parameter
        /// </summary>
        public string ParamValue
        {
            get { return sParamValue; }
            set { sParamValue = value; }
        }
    }
    #endregion

}
