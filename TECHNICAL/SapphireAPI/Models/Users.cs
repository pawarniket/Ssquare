namespace MS.SSquare.API.Models
{
    public class Users
    {
        public int? UserID { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }    // The new password the user wants to set
        public string ConfirmPassword { get; set; }
        public int RoleID { get; set; }
        public int ClientID { get; set; }

        public int VendorID { get; set; }

        public bool IsActive { get; set; }

        public int CreatedBy {  get; set; }
        public int IsLocked { get; set; }


        public int ModifiedBy { get; set; }
        public string RoleIDs { get; set; }
        public string ClientIDs { get; set; }
        public string EncryptUserID { get; set; }
        public string ResetUrl { get; set; }

    }

}