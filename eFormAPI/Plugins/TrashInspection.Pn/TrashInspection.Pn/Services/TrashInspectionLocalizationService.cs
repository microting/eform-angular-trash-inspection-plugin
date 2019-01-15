using TrashInspection.Pn.Abstractions;
using Microsoft.Extensions.Localization;
using Microting.eFormApi.BasePn.Localization.Abstractions;

namespace TrashInspection.Pn.Services
{
    public class TrashInspectionLocalizationService : ITrashInspectionLocalizationService
    {
        private readonly IStringLocalizer _localizer;

        // ReSharper disable once SuggestBaseTypeForParameter
        public TrashInspectionLocalizationService(IEformLocalizerFactory factory)
        {
            _localizer = factory.Create(typeof(EformTrashInspectionPlugin));
        }

        public string GetString(string key)
        {
            var str = _localizer[key];
            return str.Value;
        }

        public string GetString(string format, params object[] args)
        {
            var message = _localizer[format];
            if (message?.Value == null)
            {
                return null;
            }

            return string.Format(message.Value, args);
        }
    }
}
