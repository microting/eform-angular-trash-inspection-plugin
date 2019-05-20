namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionBaseSettings
    {
        public string LogLevel { get; set; }
        public string LogLimit { get; set; }
        public string SdkConnectionString { get; set; }
        public string MaxParallelism { get; set; }
        public int NumberOfWorkers { get; set; }
        public string Token { get; set; }
        public string CallBackUrl { get; set; }
        public string CallBackCredentialDomain { get; set; }
        public string CallbackCredentialUserName { get; set; }
        public string CallbackCredentialPassword { get; set; }
        public string CallbackCredentialAuthType { get; set; }
        public int ExtendedInspectioneFormId { get; set; }
    }
}