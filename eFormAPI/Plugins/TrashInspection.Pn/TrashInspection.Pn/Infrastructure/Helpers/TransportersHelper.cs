using Newtonsoft.Json.Linq;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    public static class TransportersHelper
    {
        public static TransporterModel ComposeValues(TransporterModel transporter, JToken headers,
            JToken transporterObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                transporter.Name = transporterObj[locationId].ToString(); // Number
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                transporter.Description = transporterObj[locationId].ToString(); //Name
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                transporter.ForeignId = transporterObj[locationId].ToString(); //Location Code
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                transporter.Address = transporterObj[locationId].ToString(); //eFormId
            }

            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.City = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.ZipCode = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.Phone = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.ContactPerson = transporterObj[locationId].ToString();
            }

            return transporter;
        }
    }
}