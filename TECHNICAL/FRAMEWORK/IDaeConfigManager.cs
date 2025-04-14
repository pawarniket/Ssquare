using Microsoft.Extensions.Configuration;

namespace DAE.Configuration
{
    public interface IDaeConfigManager
    {
        string MirajPopExpressCS { get; }

        string EncryptionDecryptionAlgorithm { get; }

        string EncryptionDecryptionKey { get; }

        string EmailID { get; }

        string AccountKey { get; }

        string GetConnectionString(string connectionName);

        IConfigurationSection GetConfigurationSection(string Key);

        string LogDestination { get; }
    }
}