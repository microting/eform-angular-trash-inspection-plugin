/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System.Linq;
using System.Xml.Linq;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    /// <summary>
    /// Builds and parses the SOAP messages for the NAV MicrotingWS codeunit. This is a copy of
    /// the helper in eform-service-trash-inspection-plugin: the duplication is deliberate, since
    /// the base package is consumed as NuGet and would need a publish to be shared. Unify when
    /// the WCF path in the service plugin is retired.
    /// </summary>
    public static class NavSoap
    {
        /// <summary>urn/namespace of the NAV MicrotingWS codeunit.</summary>
        public const string MicrotingWsNamespace = "urn:microsoft-dynamics-schemas/codeunit/MicrotingWS";

        /// <summary>SOAPAction for the WeighingFromMicroting2 operation.</summary>
        public const string WeighingFromMicroting2Action = MicrotingWsNamespace + ":WeighingFromMicroting2";

        /// <summary>
        /// Builds the SOAP 1.1 request body for the WeighingFromMicroting2 operation.
        /// </summary>
        public static string BuildWeighingFromMicroting2Envelope(string weighingNo, bool approved)
        {
            XNamespace soapNs = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace svcNs = MicrotingWsNamespace;

            XDocument envelope = new XDocument(
                new XDeclaration("1.0", "utf-8", null),
                new XElement(soapNs + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soap", soapNs.NamespaceName),
                    new XAttribute(XNamespace.Xmlns + "ns", svcNs.NamespaceName),
                    new XElement(soapNs + "Body",
                        new XElement(svcNs + "WeighingFromMicroting2",
                            new XElement(svcNs + "_WeighingNo", weighingNo),
                            new XElement(svcNs + "_Approved", approved)))));

            return envelope.Declaration + envelope.ToString(SaveOptions.DisableFormatting);
        }

        /// <summary>
        /// Extracts the &lt;return_value&gt; text from a WeighingFromMicroting2 SOAP response,
        /// or null when absent. Throws when the body is not XML.
        /// </summary>
        public static string ParseReturnValue(string responseBody)
        {
            return ParseReturnValue(XDocument.Parse(responseBody));
        }

        /// <summary>
        /// Extracts the &lt;return_value&gt; text from an already parsed WeighingFromMicroting2
        /// SOAP response, or null when absent.
        /// </summary>
        public static string ParseReturnValue(XDocument response)
        {
            return response.Descendants()
                .FirstOrDefault(x => x.Name.LocalName == "return_value")?.Value;
        }
    }
}
