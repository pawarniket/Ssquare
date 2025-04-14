using Microsoft.Extensions.Configuration;
using DAE.Configuration;

namespace DAE.Configuration
{
    public class DaeConfigManager : IDaeConfigManager
    {
        private readonly IConfiguration _configuration;
        
        public DaeConfigManager(IConfiguration configuration)
        {
            this._configuration = configuration;
        }

        public string MirajPopExpressCS
        {
            get
            {
                return this._configuration["ConnectionStrings:DAECS"];
            }
        }

        public string EncryptionDecryptionAlgorithm
        {
            get
            {
                return this._configuration["AppSeettings:EncryptionDecryptionAlgorithm"];
            }
        }


        public string LogDestination
        {
            get
            {
                return this._configuration["AppSeettings:LogDestination"];
            }
        }


        public string EncryptionDecryptionKey
        {
            get
            {
                return this._configuration["AppSeettings:EncryptionDecryptionKey"];
            }
        }

        public string GetConnectionString(string connectionName)
        {
            return this._configuration.GetConnectionString(connectionName);
        }

        public string EmailID
        {
            get
            {
                return this._configuration["AppSeettings:EmailID"];
            }
        }

        public string AccountKey
        {
            get
            {
                return this._configuration["AppSeettings:AccountKey"];
            }
        }

        public IConfigurationSection GetConfigurationSection(string key)
        {
            return this._configuration.GetSection(key);
        }
    }
}