using System;
using TrashInspection.Pn.Infrastructure.Models;
using Newtonsoft.Json.Linq;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    public static class ProducersHelper
    {
        public static ProducerModel ComposeValues(ProducerModel producer, JToken headers, JToken producerObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                producer.Name = producerObj[locationId].ToString(); // NAme
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                producer.Description = producerObj[locationId].ToString(); //Description
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                producer.ForeignId = producerObj[locationId].ToString(); //Foreign Id
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                producer.Address = producerObj[locationId].ToString(); //Address
            }

            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.City = producerObj[locationId].ToString(); //City
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.ZipCode = producerObj[locationId].ToString(); //ZipCode
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.Phone = producerObj[locationId].ToString(); //Phone
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.ContactPerson = producerObj[locationId].ToString(); //Contact Person
            }
            return producer;
        }
    }
}