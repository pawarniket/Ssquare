namespace MS.SSquare.API.Models
{
    public interface IJwtAuth
    {
        string Authentication(string username, string password);
        string Authentication(string userName, string userID, string roleID);
    }
}
