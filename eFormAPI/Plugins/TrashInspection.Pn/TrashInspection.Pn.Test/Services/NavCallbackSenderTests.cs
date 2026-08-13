using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using NUnit.Framework;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models.Nav;
using TrashInspection.Pn.Services;

namespace TrashInspection.Pn.Test.Services
{
    /// <summary>
    /// Covers the success predicate of the NAV sender (D2): a 2xx alone is not proof of delivery.
    /// Drives the sender through a stub HttpMessageHandler, so it needs no database and no network.
    /// </summary>
    [TestFixture]
    public class NavCallbackSenderTests
    {
        private const string SuccessBody =
            "<Soap:Envelope xmlns:Soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><Soap:Body>" +
            "<WeighingFromMicroting2_Result xmlns=\"urn:microsoft-dynamics-schemas/codeunit/MicrotingWS\">" +
            "<return_value>Afsl. Vejenr. V243141 opdateret</return_value>" +
            "</WeighingFromMicroting2_Result></Soap:Body></Soap:Envelope>";

        [Test]
        public async Task SendAsync_ReturnsReturnValue_OnSuccessfulResponse()
        {
            var handler = new StubHttpMessageHandler(_ => Respond(HttpStatusCode.OK, SuccessBody));
            var sender = new NavCallbackSender(_ => handler);

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.True);
                Assert.That(result.ReturnValue, Is.EqualTo("Afsl. Vejenr. V243141 opdateret"));
                Assert.That(result.Error, Is.Null);
                Assert.That(handler.LastRequestBody, Does.Contain("<ns:_WeighingNo>V243141</ns:_WeighingNo>"));
                Assert.That(handler.LastSoapAction, Is.EqualTo($"\"{NavSoap.WeighingFromMicroting2Action}\""));
            });
        }

        [Test]
        public async Task SendAsync_Fails_When2xxCarriesNoReturnValue()
        {
            // The mechanism behind the rows flagged as sent but never confirmed by NAV.
            var body =
                "<Soap:Envelope xmlns:Soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                "<Soap:Body><SomethingElse /></Soap:Body></Soap:Envelope>";
            var sender = new NavCallbackSender(_ => new StubHttpMessageHandler(_ => Respond(HttpStatusCode.OK, body)));

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.ReturnValue, Is.Null);
                Assert.That(result.Error, Does.Contain("no return_value"));
            });
        }

        [Test]
        public async Task SendAsync_Fails_When2xxCarriesEmptyReturnValue()
        {
            // An empty element parses to "" rather than null. Treating it as success would set the
            // sent flag, clear the previous error and produce an empty toast, which is the exact
            // "sent but unconfirmed" state this guard exists to prevent.
            var body =
                "<Soap:Envelope xmlns:Soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                "<Soap:Body><WeighingFromMicroting2_Result><return_value /></WeighingFromMicroting2_Result>" +
                "</Soap:Body></Soap:Envelope>";
            var sender = new NavCallbackSender(_ => new StubHttpMessageHandler(_ => Respond(HttpStatusCode.OK, body)));

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.Error, Does.Contain("no return_value"));
            });
        }

        [Test]
        public async Task SendAsync_Fails_When2xxCarriesSoapFault()
        {
            var body =
                "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body>" +
                "<soap:Fault><faultcode>soap:Server</faultcode>" +
                "<faultstring>The Vejehoved does not exist. Vejenr.='V176209'</faultstring>" +
                "</soap:Fault></soap:Body></soap:Envelope>";
            var sender = new NavCallbackSender(_ => new StubHttpMessageHandler(_ => Respond(HttpStatusCode.OK, body)));

            var result = await sender.SendAsync(Settings(), "V176209", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.Error, Does.Contain("SOAP fault"));
                Assert.That(result.Error, Does.Contain("The Vejehoved does not exist"));
            });
        }

        [Test]
        public async Task SendAsync_Fails_WithoutThrowing_WhenBodyIsNotXml()
        {
            var sender = new NavCallbackSender(_ =>
                new StubHttpMessageHandler(_ => Respond(HttpStatusCode.OK, "<html><body>Gateway error</body>")));

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.Error, Does.Contain("non-XML"));
            });
        }

        [Test]
        public async Task SendAsync_CapturesStatusAndWwwAuthenticate_OnUnauthorized()
        {
            var sender = new NavCallbackSender(_ => new StubHttpMessageHandler(_ =>
            {
                var response = Respond(HttpStatusCode.Unauthorized, "Access denied");
                response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("NTLM"));
                return response;
            }));

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.Error, Does.Contain("HTTP 401"));
                Assert.That(result.Error, Does.Contain("WWW-Authenticate: NTLM"));
                Assert.That(result.Error, Does.Contain("Access denied"));
            });
        }

        [Test]
        public async Task SendAsync_Fails_WhenNavDoesNotRespondWithinTimeout()
        {
            var sender = new NavCallbackSender(
                _ => new StubHttpMessageHandler(async token =>
                {
                    await Task.Delay(TimeSpan.FromSeconds(30), token);
                    return Respond(HttpStatusCode.OK, SuccessBody);
                }),
                TimeSpan.FromMilliseconds(50));

            var result = await sender.SendAsync(Settings(), "V243141", true);

            Assert.Multiple(() =>
            {
                Assert.That(result.Success, Is.False);
                Assert.That(result.Error, Does.Contain("did not respond"));
            });
        }

        private static NavCallbackSettings Settings()
        {
            return new NavCallbackSettings
            {
                CallBackUrl = "http://nav.example.invalid:7047/DynamicsNAV/WS/Codeunit/MicrotingWS",
                CallBackCredentialDomain = "...",
                CallbackCredentialUserName = "user",
                CallbackCredentialPassword = "password",
                CallbackCredentialAuthType = "NTLM"
            };
        }

        private static HttpResponseMessage Respond(HttpStatusCode statusCode, string body)
        {
            return new HttpResponseMessage(statusCode) { Content = new StringContent(body) };
        }

        private sealed class StubHttpMessageHandler : HttpMessageHandler
        {
            private readonly Func<CancellationToken, Task<HttpResponseMessage>> _responder;

            public StubHttpMessageHandler(Func<CancellationToken, HttpResponseMessage> responder)
                : this(token => Task.FromResult(responder(token)))
            {
            }

            public StubHttpMessageHandler(Func<CancellationToken, Task<HttpResponseMessage>> responder)
            {
                _responder = responder;
            }

            public string LastRequestBody { get; private set; }

            public string LastSoapAction { get; private set; }

            protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
                CancellationToken cancellationToken)
            {
                if (request.Content != null)
                {
                    LastRequestBody = await request.Content.ReadAsStringAsync(cancellationToken);
                    LastSoapAction = request.Content.Headers.TryGetValues("SOAPAction", out var values)
                        ? string.Join(", ", values)
                        : null;
                }

                return await _responder(cancellationToken);
            }
        }
    }
}
