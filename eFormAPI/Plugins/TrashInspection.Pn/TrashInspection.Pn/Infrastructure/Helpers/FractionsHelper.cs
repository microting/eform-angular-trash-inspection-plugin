using System;
using Newtonsoft.Json.Linq;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    public static class FractionsHelper
    {
        public static FractionModel ComposeValues(FractionModel fraction, JToken headers, JToken fractionObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                fraction.ItemNumber = fractionObj[locationId].ToString(); // Number
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                fraction.Name = fractionObj[locationId].ToString(); //Name
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                fraction.LocationCode = fractionObj[locationId].ToString(); //Location Code
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                fraction.eFormId = (int)fractionObj[locationId]; //eFormId
            }
//                        if (int.TryParse(headers[4]["headerValue"].ToString(), out locationId))
//                        {
//                            fraction.Statutoryeform = fractionObj[locationId].ToString(); //CustomerNumber
//                        }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                fraction.Description = fractionObj[locationId].ToString();
            }
            return fraction;
        }
    }
}