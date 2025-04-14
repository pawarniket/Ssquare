#region HEADER INFO

// 4P FZ LLC 
// PROJECT       : DM V2.0
// CLIENT        : DCH
// MODULE NAME   : SQL Data Access Library
// ENVIRONMENT   : .NET 2.0 Windows 2003 - XP
// CATEGORY      : C# 2.0
// DEVELOPER     : ABHIJEET VARTAK
// EMAIL-ID      : abhijeet@4power.biz
// Created Date  : 29 Oct 2009

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


namespace DAE.DAL.SQL
{

    #region Enum Declaration


   
    /// <summary>
    /// Enum for the datatypes 
    /// </summary>
    /// 
    public enum DBUtilDBTypeConnection
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
        XML=SqlDbType.Xml,
        Nvarchar=SqlDbType.NVarChar
    }

    /// <summary>
    /// Direction of the parameters
    /// </summary>
    public enum DBUtilDirectionConnection
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
    public class DBUtilityConnection
    {

        private Hashtable _htParamCollection; //Stores the parameters added
        private Hashtable _htParamOutPut; //Stores the Output Parameters
        private IDbTransaction _oTransaction;
        private IDbConnection _oCnnConnection;
       // DAE.Common.Common oCommon = new DAE.Common.Common();
        /// <summary>
        /// Constructor of the class
        /// </summary>
        public DBUtilityConnection()
        {
            _htParamCollection = new Hashtable();
            _htParamOutPut = new Hashtable();
        }

        /// <summary>
        /// Starts the transaction if requried
        /// </summary>
        public void StartTransaction(string ConnectionString)
        {
            try
            {
                if (_oCnnConnection == null)
                {
                    _oCnnConnection = GetConnection(ConnectionString);
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
        public void AddParameters(string psParamName, DBUtilDBType puType,
            DBUtilDirection puDirection, int piSize, object psValue)
        {
            try
            {
                UtilParams objParams = new UtilParams();
                objParams.ParamName = psParamName;
                objParams.ParamType = (SqlDbType)puType;
                objParams.Direction = (ParameterDirection)puDirection;
                if (puDirection == DBUtilDirection.Out)
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
                        AddParameters(psParamName, DBUtilDBType.Boolean, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "byte")
                        AddParameters(psParamName, DBUtilDBType.Byte, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "date")
                        AddParameters(psParamName, DBUtilDBType.Date, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "datetime")
                        AddParameters(psParamName, DBUtilDBType.DateTime, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "char")
                        AddParameters(psParamName, DBUtilDBType.Char, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "decimal")
                        AddParameters(psParamName, DBUtilDBType.Decimal, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "numeric")
                        AddParameters(psParamName, DBUtilDBType.Numeric, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "integer")
                        AddParameters(psParamName, DBUtilDBType.Integer, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "guid")
                        AddParameters(psParamName, DBUtilDBType.Guid, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "text")
                        AddParameters(psParamName, DBUtilDBType.Text, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "varchar")
                        AddParameters(psParamName, DBUtilDBType.Varchar, DBUtilDirection.In, Convert.ToInt32(piSize), psValue);
                }
                else if (psDirection.ToLower() == "out")
                {
                    if (psType.ToLower() == "boolean")
                        AddParameters(psParamName, DBUtilDBType.Boolean, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "byte")
                        AddParameters(psParamName, DBUtilDBType.Byte, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "date")
                        AddParameters(psParamName, DBUtilDBType.Date, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "datetime")
                        AddParameters(psParamName, DBUtilDBType.DateTime, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "char")
                        AddParameters(psParamName, DBUtilDBType.Char, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "decimal")
                        AddParameters(psParamName, DBUtilDBType.Decimal, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "numeric")
                        AddParameters(psParamName, DBUtilDBType.Numeric, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "integer")
                        AddParameters(psParamName, DBUtilDBType.Integer, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "guid")
                        AddParameters(psParamName, DBUtilDBType.Guid, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "text ")
                        AddParameters(psParamName, DBUtilDBType.Text, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
                    if (psType.ToLower() == "varchar")
                        AddParameters(psParamName, DBUtilDBType.Varchar, DBUtilDirection.Out, Convert.ToInt32(piSize), psValue);
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
        public XmlDocument Execute_StoreProc_DataSetForBTS(string psStoreProcName, string ConnectionString)
        {
            DataSet dsResult = new DataSet();
            UtilParams objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;
            SqlDataAdapter objSqlDataAdapter = null;

            try
            {
                objConnection = GetConnection(ConnectionString);
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;

                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();

                while (en.MoveNext())
                {
                    objParams = (UtilParams)en.Value;
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
            UtilParams objParams;
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
                    objParams = (UtilParams)en.Value;
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
                    objParams = (UtilParams)en.Value;
                    if (objParams.Direction == (ParameterDirection)DBUtilDirection.Out)
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
        private SqlConnection GetConnection(string ConnectionString)
        {
            try
            {
                //FPCommon oFPCommon = new FPCommon();
                //oFPCommon = (FPCommon)ConfigurationManager.GetSection("DAECommon");
                string sConnectString = ConnectionString;

               // string sConnectString = ConfigurationSettings.AppSettings["ConnectionString"].ToString();
                
                SqlConnection conObjConnect = new SqlConnection(sConnectString);
                conObjConnect.Open();
                return conObjConnect;
            }
            catch(Exception ex)
            {
                //oCommon.IsDBConnectionError = true;
                throw ex;
            }
        }

        /// <summary>
        /// Returns a dataset for the stored procedure name passed
        /// </summary>
        /// <param name="psStoreProcName">Name of the Stored Procedure to be executed</param>
        /// <returns></returns>
        public DataSet Execute_StoreProc_DataSet(string psStoreProcName, string ConnectionString)
        {
            DataSet dsResult = new DataSet();
            UtilParams objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;
            SqlDataAdapter objSqlDataAdapter = null;

            try
            {
                objConnection = GetConnection(ConnectionString);
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;

                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();

                while (en.MoveNext())
                {
                    objParams = (UtilParams)en.Value;
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
        public bool Execute_StoreProc(string psStoreProcName,string ConnectionString)
        {
            string sOutValue;
            UtilParams objParams;
            SqlConnection objConnection = null;
            SqlParameter objSqlParams = null;
            SqlCommand objCommand = null;

            try
            {
                objConnection = GetConnection(ConnectionString);
                objCommand = new SqlCommand(psStoreProcName, objConnection);
                objCommand.CommandType = CommandType.StoredProcedure;
                IDictionaryEnumerator en = _htParamCollection.GetEnumerator();
                while (en.MoveNext())
                {
                    objParams = (UtilParams)en.Value;
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
                    objParams = (UtilParams)en.Value;
                    if (objParams.Direction == (ParameterDirection)DBUtilDirection.Out)
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
    public class UtilParamsConnection
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
