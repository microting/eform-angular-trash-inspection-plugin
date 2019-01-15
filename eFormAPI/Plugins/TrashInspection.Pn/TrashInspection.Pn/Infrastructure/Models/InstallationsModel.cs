using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationsModel
    {
        public int Total { get; set; }
        public List<InstallationModel> InstallationList { get; set; }

    }
}
