using System.Linq;
using System.Xml.Linq;
using NUnit.Framework;
using TrashInspection.Pn.Infrastructure.Helpers;

namespace TrashInspection.Pn.Test.Helpers
{
    /// <summary>
    /// Regression tests for the NAV MicrotingWS SOAP envelope construction and response parsing
    /// used by the WeighingFromMicroting2 callback. Needs no database.
    /// </summary>
    [TestFixture]
    public class NavSoapTests
    {
        private const string Ns = "urn:microsoft-dynamics-schemas/codeunit/MicrotingWS";

        [Test]
        public void BuildEnvelope_StartsWithXmlDeclaration()
        {
            var soap = NavSoap.BuildWeighingFromMicroting2Envelope("V250790", true);

            Assert.That(soap, Does.StartWith("<?xml version=\"1.0\" encoding=\"utf-8\"?>"));
        }

        [Test]
        [TestCase(true, "true")]
        [TestCase(false, "false")]
        public void BuildEnvelope_SerializesWeighingNoAndApproved(bool approved, string expectedApproved)
        {
            var soap = NavSoap.BuildWeighingFromMicroting2Envelope("V250790", approved);

            XNamespace svc = Ns;
            var operation = XDocument.Parse(soap).Descendants(svc + "WeighingFromMicroting2").Single();

            Assert.Multiple(() =>
            {
                Assert.That(operation.Element(svc + "_WeighingNo")!.Value, Is.EqualTo("V250790"));
                Assert.That(operation.Element(svc + "_Approved")!.Value, Is.EqualTo(expectedApproved));
            });
        }

        [Test]
        public void BuildEnvelope_EscapesSpecialCharactersInWeighingNo()
        {
            // Would produce invalid XML (and XDocument.Parse would throw) if the value were not escaped.
            var soap = NavSoap.BuildWeighingFromMicroting2Envelope("A&B<C>", true);

            XNamespace svc = Ns;
            Assert.That(XDocument.Parse(soap).Descendants(svc + "_WeighingNo").Single().Value, Is.EqualTo("A&B<C>"));
        }

        [Test]
        public void ParseReturnValue_ExtractsValueFromNavResponse()
        {
            // Response shape observed live from the NAV endpoint.
            var response =
                "<Soap:Envelope xmlns:Soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><Soap:Body>" +
                "<WeighingFromMicroting2_Result xmlns=\"urn:microsoft-dynamics-schemas/codeunit/MicrotingWS\">" +
                "<return_value>Vejenr. V250790 opdateret med Yes</return_value>" +
                "</WeighingFromMicroting2_Result></Soap:Body></Soap:Envelope>";

            Assert.That(NavSoap.ParseReturnValue(response), Is.EqualTo("Vejenr. V250790 opdateret med Yes"));
        }

        [Test]
        public void ParseReturnValue_ReturnsNull_WhenAbsent()
        {
            var response =
                "<Soap:Envelope xmlns:Soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                "<Soap:Body><SomethingElse /></Soap:Body></Soap:Envelope>";

            Assert.That(NavSoap.ParseReturnValue(response), Is.Null);
        }
    }
}
