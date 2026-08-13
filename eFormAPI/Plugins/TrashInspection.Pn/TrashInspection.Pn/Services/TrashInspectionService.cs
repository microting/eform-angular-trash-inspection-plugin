/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Handlers;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Infrastructure.Models.Nav;
using TrashInspection.Pn.Messages;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace TrashInspection.Pn.Services
{
    using TrashInspection = Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection;

    public class TrashInspectionService : ITrashInspectionService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TrashInspectionService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        private readonly IUserService _userService;
        private readonly TrashInspectionReceivedHandler _trashInspectionReceivedHandler;
        private readonly TrashInspectionDeleteHandler _trashInspectionDeleteHandler;
        private readonly IPluginDbOptions<TrashInspectionBaseSettings> _options;
        private readonly INavCallbackSender _navCallbackSender;

        /// <summary>
        /// ErrorFromCallBack carries the raw remote response, which can be a multi-KB HTML error
        /// page. The client auto-toasts the message of every response, so it is capped.
        /// </summary>
        private const int ErrorFromCallBackMaxLength = 200;

        public TrashInspectionService(ILogger<TrashInspectionService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            IUserService userService,
            ITrashInspectionLocalizationService trashInspectionLocalizationService,
            IPluginDbOptions<TrashInspectionBaseSettings> options,
            TrashInspectionReceivedHandler trashInspectionReceivedHandler,
            TrashInspectionDeleteHandler trashInspectionDeleteHandler,
            INavCallbackSender navCallbackSender)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
            _userService = userService;
            _trashInspectionReceivedHandler = trashInspectionReceivedHandler;
            _trashInspectionDeleteHandler = trashInspectionDeleteHandler;
            _options = options;
            _navCallbackSender = navCallbackSender;
        }

        public async Task<OperationDataResult<Paged<TrashInspectionModel>>> Index(TrashInspectionRequestModel pnRequestModel)
        {
            try
            {
                var trashInspectionSettings = _options.Value;

                var trashInspectionsQuery = _dbContext.TrashInspections
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsNoTracking()
                    .AsQueryable();

                if (!string.IsNullOrEmpty(pnRequestModel.NameFilter))
                {
                    if (int.TryParse(pnRequestModel.NameFilter, out var i))
                    {
                        trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                            x.Id == i);
                    }
                    else
                    {
                        if (DateTime.TryParse(pnRequestModel.NameFilter, out var dateTime))
                        {
                            trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                                x.Date.Year == dateTime.Year &&
                                x.Date.Month == dateTime.Month &&
                                x.Date.Day == dateTime.Day);
                        }
                        else
                        {
                            trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                                x.Comment.Contains(pnRequestModel.NameFilter) ||
                                x.WeighingNumber.Contains(pnRequestModel.NameFilter));
                        }
                    }
                }

                switch (pnRequestModel.NavStatusFilter)
                {
                    case "notSent":
                        trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                            !x.ResponseSendToCallBackUrl && string.IsNullOrEmpty(x.ErrorFromCallBack));
                        break;
                    case "failed":
                        trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                            !x.ResponseSendToCallBackUrl && !string.IsNullOrEmpty(x.ErrorFromCallBack));
                        break;
                    case "unconfirmed":
                        trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                            x.ResponseSendToCallBackUrl && string.IsNullOrEmpty(x.SuccessMessageFromCallBack));
                        break;
                    case "sent":
                        trashInspectionsQuery = trashInspectionsQuery.Where(x =>
                            x.ResponseSendToCallBackUrl && !string.IsNullOrEmpty(x.SuccessMessageFromCallBack));
                        break;
                }

                trashInspectionsQuery = QueryHelper.AddSortToQuery(trashInspectionsQuery, pnRequestModel.Sort, pnRequestModel.IsSortDsc);

                var total = await trashInspectionsQuery.Select(x => x.Id).CountAsync();

                trashInspectionsQuery = trashInspectionsQuery
                    .Skip(pnRequestModel.Offset)
                    .Take(pnRequestModel.PageSize);

                var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

                var trashInspections = await AddSelectToQuery(trashInspectionsQuery, timeZoneInfo, trashInspectionSettings.Token, true)
                    .ToListAsync();

                var navEnabled = IsNavConfigured(trashInspectionSettings.CallBackUrl);

                var core = await _coreHelper.GetCore();
                var eFormIds = new List<KeyValuePair<int, int>>(); // <FractionId, eFormId>

                foreach (var trashInspectionModel in trashInspections)
                {
                    trashInspectionModel.NavEnabled = navEnabled;

                    var fractionEFormId = await _dbContext.Fractions
                        .Where(y => y.Id == trashInspectionModel.FractionId)
                        .Select(x => x.eFormId)
                        .FirstOrDefaultAsync();

                    if (trashInspectionModel.Status == 100)
                    {
                        var result = await _dbContext.TrashInspectionCases
                            .Where(x => x.TrashInspectionId == trashInspectionModel.Id)
                            .Where(x => x.Status == 100)
                            .ToListAsync();
                        if (result.Any())
                        {
                            trashInspectionModel.SdkCaseId = int.Parse(result.First().SdkCaseId);

                            trashInspectionModel.SdkCaseId =
                                (int) core.CaseLookupMUId(trashInspectionModel.SdkCaseId).Result.CaseId;
                        }

                        if (eFormIds.Any(x => x.Key == trashInspectionModel.FractionId))
                        {
                            trashInspectionModel.SdkeFormId = eFormIds.First(x => x.Key == trashInspectionModel.FractionId).Value;
                        }
                        else
                        {
                            try
                            {
                                var locale = await _userService.GetCurrentUserLocale();
                                var language = core.DbContextHelper.GetDbContext().
                                    Languages
                                    .Single(x => x.LanguageCode == locale);
                                var eForm = await core.TemplateItemRead(fractionEFormId, language);
                                trashInspectionModel.SdkeFormId = eForm.Id;
                                var kvp =
                                    new KeyValuePair<int, int>(fractionEFormId, eForm.Id);
                                eFormIds.Add(kvp);
                            }
                            catch
                            {
                               // KeyValuePair<int, int> kvp = new KeyValuePair<int, int>(fraction.eFormId, "");
                               // eFormIds.Add(kvp);
                            }
                        }
                    }
                }

                var trashInspectionsModel = new Paged<TrashInspectionModel>
                {
                    Total = total,
                    Entities = trashInspections
                };


                return new OperationDataResult<Paged<TrashInspectionModel>>(true, trashInspectionsModel);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<Paged<TrashInspectionModel>>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspections"));

            }
        }

        public async Task<OperationDataResult<TrashInspectionCaseVersionsModel>> IndexVersions(
            int trashInspectionId)
        {
            try
            {
                var trashInspectionCaseVersionsModel = new TrashInspectionCaseVersionsModel();

                var trashInspectionCaseVersionsQuery = _dbContext.TrashInspectionCaseVersions.AsQueryable();

                var trashInspectionCaseVersions = await trashInspectionCaseVersionsQuery
                    .Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                if (trashInspectionCaseVersions == null)
                {
                    return new OperationDataResult<TrashInspectionCaseVersionsModel>(false,
                        _trashInspectionLocalizationService.GetString($"TrashInspectionWithID:{trashInspectionId}DoesNotExist"));
                }

                trashInspectionCaseVersionsModel.Total = trashInspectionCaseVersions.Count;
                trashInspectionCaseVersionsModel.TrashInspectionCaseVersionList = trashInspectionCaseVersions;

                return new OperationDataResult<TrashInspectionCaseVersionsModel>(true, trashInspectionCaseVersionsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionCaseVersionsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }

        public async Task<OperationResult> Create(TrashInspectionModel createModel)
        {
            var dateTime = DateTime.UtcNow;
            var pluginConfiguration = await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            if (pluginConfiguration == null)
            {
                return new OperationResult(false);
            }

            if (createModel.Token == pluginConfiguration.Value && createModel.WeighingNumber != null)
            {
                try
                {
// Handling the situation, where incoming timestamp is not in UTC.
                var utcAdjustment = await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:UtcAdjustment");

                if (utcAdjustment.Value == "true")
                {
                    if (createModel.Time.Hour > dateTime.Hour)
                    {
                        var timeSpan = createModel.Time.Subtract(dateTime);
                        var minutes = timeSpan.Hours * 60.0 + timeSpan.Minutes;
                        var hours = minutes / 60.0;
                        var fullHours = Math.Round(hours);
                        createModel.Time = createModel.Time.AddHours(-fullHours);
                    }
                }

                TrashInspection trashInspection = await _dbContext.TrashInspections.FirstOrDefaultAsync(x =>
                    x.WeighingNumber == createModel.WeighingNumber);

                if (trashInspection != null)
                {
                    return new OperationResult(true, trashInspection.Id.ToString());
                }

                trashInspection =
                    new TrashInspection
                    {
                        WeighingNumber = createModel.WeighingNumber,
                        Date = createModel.Date,
                        Time = createModel.Time,
                        EakCode = createModel.EakCode,
                        ExtendedInspection = createModel.ExtendedInspection,
                        RegistrationNumber = createModel.RegistrationNumber,
                        TrashFraction = createModel.TrashFraction,
                        Producer = createModel.Producer,
                        Transporter = createModel.Transporter,
                        MustBeInspected = createModel.MustBeInspected,
                        InspectionDone = false,
                        Status = 0,
                        UpdatedByUserId = _userService.UserId,
                        CreatedByUserId = _userService.UserId,
                    };

                await trashInspection.Create(_dbContext);

                var segment = _dbContext.Segments.FirstOrDefault(x => x.Name == createModel.Segment);
                var installation =
                    _dbContext.Installations.FirstOrDefault(x => x.Name == createModel.InstallationName);
                var fraction =
                    _dbContext.Fractions.FirstOrDefault(x => x.ItemNumber == createModel.TrashFraction);

                _coreHelper.LogEvent($"CreateTrashInspection: Segment: {createModel.Segment}, InstallationName: {createModel.InstallationName}, TrashFraction: {createModel.TrashFraction} ");
                if (segment != null && installation != null && fraction != null)
                {
                    trashInspection.SegmentId = segment.Id;
                    trashInspection.FractionId = fraction.Id;
                    trashInspection.InstallationId = installation.Id;
                    await trashInspection.Update(_dbContext);
                    createModel.SegmentId = segment.Id;
                    createModel.FractionId = fraction.Id;
                    createModel.InstallationId = installation.Id;
                    createModel.Id = trashInspection.Id;

                    await UpdateProducerAndTransporter(trashInspection, createModel);

                    _coreHelper.LogEvent($"CreateTrashInspection: Segment: {segment.Name}, InstallationName: {installation.Name}, TrashFraction: {fraction.Name} ");
                    await _trashInspectionReceivedHandler.Handle(new TrashInspectionReceived(createModel, fraction.Id, segment.Id, installation.Id));
                }

                return new OperationResult(true, createModel.Id.ToString());
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return new OperationResult(false);
                }
            }

            return new OperationResult(false);
        }

        public async Task<OperationDataResult<TrashInspectionModel>> Read(int trashInspectionId)
        {
            try
            {
                var trashInspectionQuery = _dbContext.TrashInspections
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Id == trashInspectionId)
                    .AsNoTracking()
                    .AsQueryable();

                var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

                var trashInspection = await AddSelectToQuery(trashInspectionQuery, timeZoneInfo, "", true)
                .FirstOrDefaultAsync();

                if (trashInspection == null)
                {
                    return new OperationDataResult<TrashInspectionModel>(false,
                        _trashInspectionLocalizationService.GetString($"TrashInspectionWithID:{trashInspectionId}DoesNotExist"));
                }

                return new OperationDataResult<TrashInspectionModel>(true, trashInspection);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }

        public async Task<OperationDataResult<TrashInspectionModel>> Read(string weighingNumber, string token)
        {
            var trashInspectionSettings =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            _coreHelper.LogEvent($"DownloadEFormPdf: weighingNumber is {weighingNumber} token is {token}");
            if (token == trashInspectionSettings.Value && weighingNumber != null)
            {
                try
                {
                    var trashInspectionQuery = _dbContext.TrashInspections
                        .Where(x => x.WeighingNumber == weighingNumber)
                        .AsNoTracking()
                        .AsQueryable();

                    var timeZone = "Europe/Copenhagen";

                    TimeZoneInfo timeZoneInfo;
                    try
                    {
                        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                    }
                    catch
                    {
                        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
                    }

                    // This path is reachable unauthenticated with only the weighing number and the
                    // shared token, so the NAV messages - which carry internal hostnames, IPs and
                    // raw remote response bodies - are deliberately left out (D4).
                    var trashInspection = await AddSelectToQuery(trashInspectionQuery, timeZoneInfo, "", false)
                        .FirstOrDefaultAsync();

                    if (trashInspection == null)
                    {
                        return new OperationDataResult<TrashInspectionModel>(false,
                            _trashInspectionLocalizationService.GetString($"WeighingNumber:{weighingNumber}DoesNotExist"));
                    }

                    return new OperationDataResult<TrashInspectionModel>(true, trashInspection);
                }
                catch(Exception e)
                {
                    Trace.TraceError(e.Message);
                    _logger.LogError(e.Message);
                    return new OperationDataResult<TrashInspectionModel>(false,
                        _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
                }
            }

            throw new UnauthorizedAccessException();
        }

        public async Task<OperationDataResult<TrashInspectionVersionsModel>> ReadVersion(int trashInspectionId)
        {
            try
            {
                var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

                var trashInspectionVersionsModel = new TrashInspectionVersionsModel
                {
                    TrashInspectionId = trashInspectionId
                };

                var trashInspectionVersionsQuery = _dbContext.TrashInspectionVersions.AsQueryable();

                var trashInspectionVersions =
                    await trashInspectionVersionsQuery.Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                trashInspectionVersionsModel.TrashInspectionVersionList = new List<TrashInspectionVersionModel>();

                foreach (var trashInspectionVersion in trashInspectionVersions)
                {
                    var trashInspectionVersionModel = new TrashInspectionVersionModel
                    {
                        Id = trashInspectionVersion.Id,
                        UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionVersion.UpdatedAt, timeZoneInfo),
                        Version = trashInspectionVersion.Version,
                        WeighingNumber = trashInspectionVersion.WeighingNumber,
                        Date = trashInspectionVersion.Date,
                        Time = TimeZoneInfo.ConvertTimeFromUtc(trashInspectionVersion.Time, timeZoneInfo),
                        RegistrationNumber = trashInspectionVersion.RegistrationNumber,
                        TrashFraction = trashInspectionVersion.TrashFraction,
                        FractionId = trashInspectionVersion.FractionId,
                        EakCode = trashInspectionVersion.EakCode,
                        Producer = trashInspectionVersion.Producer,
                        Transporter = trashInspectionVersion.Transporter,
                        InstallationId = trashInspectionVersion.InstallationId,
                        MustBeInspected = trashInspectionVersion.MustBeInspected,
                        Status = trashInspectionVersion.Status,
                        TrashInspectionId = trashInspectionVersion.TrashInspectionId,
                        SegmentId = trashInspectionVersion.SegmentId,
                        ExtendedInspection = trashInspectionVersion.ExtendedInspection,
                        InspectionDone = trashInspectionVersion.InspectionDone,
                        IsApproved = trashInspectionVersion.IsApproved,
                        ApprovedValue = trashInspectionVersion.ApprovedValue,
                        Comment = trashInspectionVersion.Comment,
                        ProducerId = trashInspectionVersion.ProducerId,
                        TransporterId = trashInspectionVersion.TransporterId,
                        FirstWeight = trashInspectionVersion.FirstWeight,
                        SecondWeight = trashInspectionVersion.SecondWeight,
                        ErrorFromCallBack = trashInspectionVersion.ErrorFromCallBack,
                        ResponseSendToCallBackUrl = trashInspectionVersion.ResponseSendToCallBackUrl,
                        SuccessMessageFromCallBack = trashInspectionVersion.SuccessMessageFromCallBack
                    };
                    trashInspectionVersionsModel.TrashInspectionVersionList.Add(trashInspectionVersionModel);
                }

                foreach (var trashInspectionVersionModel in trashInspectionVersionsModel.TrashInspectionVersionList)
                {
                    var installation = await _dbContext.Installations
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.InstallationId);
                    if (installation != null)
                    {
                        trashInspectionVersionModel.InstallationName = installation.Name;
                    }

                    var fraction = await _dbContext.Fractions
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.FractionId);
                    if (fraction != null)
                    {
                        trashInspectionVersionModel.TrashFraction = $"{fraction.ItemNumber} {fraction.Name}";
                    }
                    var segment = await _dbContext.Segments
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.SegmentId);
                    if (segment != null)
                    {
                        trashInspectionVersionModel.Segment = segment.Name;
                    }
                }

                var trashInspectionCaseQuery = _dbContext.TrashInspectionCases.AsQueryable();

                 var trashInspectionCases = await trashInspectionCaseQuery
                     .Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                 var statusModels = new List<TrashInspectionCaseStatusModel>();
                 foreach (var trashInspectionCase in trashInspectionCases)
                 {
                     var trashInspectionCaseStatusModel = new TrashInspectionCaseStatusModel();

                     trashInspectionCaseStatusModel.SdkSiteId = trashInspectionCase.SdkSiteId;
                     try
                     {
                         trashInspectionCaseStatusModel.SdkSiteName =
                             _coreHelper.GetCore().Result.Advanced_SiteItemRead(trashInspectionCase.SdkSiteId).Result.SiteName;
                     }
                     catch (Exception ex)
                     {
                         Trace.TraceError(ex.Message);

                     }

                     trashInspectionCaseStatusModel.Status = trashInspectionCase.Status;

                     var lists = await _dbContext.TrashInspectionCaseVersions.Where(x =>
                         x.TrashInspectionCaseId == trashInspectionCase.Id).ToListAsync();
                     foreach (var trashInspectionCaseVersion in lists)
                     {
                         switch (trashInspectionCaseVersion.Status)
                         {
                             case 0:
                                 trashInspectionCaseStatusModel.CreatedLocally =
                                     TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 break;
                             case 66:
                             {
                                 if (trashInspectionCaseVersion.WorkflowState == Constants.WorkflowStates.Removed)
                                 {
                                     trashInspectionCaseStatusModel.Removed =
                                         TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 }
                                 else
                                 {
                                     trashInspectionCaseStatusModel.SentToMicroting =
                                         TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 }
                                 break;
                             }
                             case 70:
                             {
                                 trashInspectionCaseStatusModel.ReadyAtMicroting =
                                     TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 break;
                             }
                             case 77:
                             {
                                 trashInspectionCaseStatusModel.ReceivedOnTablet =
                                     TimeZoneInfo.ConvertTimeFromUtc((DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 break;
                             }
                             case 100:
                             {
                                 if (trashInspectionCaseVersion.WorkflowState == Constants.WorkflowStates.Removed)
                                 {
                                     trashInspectionCaseStatusModel.Removed =
                                         TimeZoneInfo.ConvertTimeFromUtc(
                                             (DateTime) trashInspectionCaseVersion.UpdatedAt, timeZoneInfo);
                                 }
                                 else
                                 {
                                     var core = await _coreHelper.GetCore();
                                     using (var dbContext = core.DbContextHelper.GetDbContext())
                                     {
                                         var result = dbContext.Cases.Single(x =>
                                             x.MicrotingUid == int.Parse(trashInspectionCaseVersion.SdkCaseId));
                                         trashInspectionCaseStatusModel.Answered =
                                             TimeZoneInfo.ConvertTimeFromUtc((DateTime) result.DoneAt, timeZoneInfo);
                                     }
                                 }
                                 break;
                             }
                         }
                     }
                     statusModels.Add(trashInspectionCaseStatusModel);
                 trashInspectionVersionsModel.TrashInspectionCaseStatusModels = statusModels;

                 }

                 return new OperationDataResult<TrashInspectionVersionsModel>(true, trashInspectionVersionsModel);


            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionVersionsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }

        public async Task<OperationResult> Update(TrashInspectionModel updateModel)
        {
            var selectedTrashInspection =
                new Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection
                {
                    Id = updateModel.Id,
                    Date = updateModel.Date,
                    EakCode = updateModel.EakCode,
                    InstallationId = updateModel.InstallationId,
                    MustBeInspected = updateModel.MustBeInspected,
                    Producer = updateModel.Producer,
                    RegistrationNumber = updateModel.RegistrationNumber,
                    Time = updateModel.Time,
                    Transporter = updateModel.Transporter,
                    TrashFraction = updateModel.TrashFraction,
                    WeighingNumber = updateModel.WeighingNumber,
                    Status = updateModel.Status,
                    Version = updateModel.Version,
                    WorkflowState = updateModel.WorkflowState,
                    ExtendedInspection = updateModel.ExtendedInspection,
                    InspectionDone = updateModel.InspectionDone
                };

            await selectedTrashInspection.Update(_dbContext);
            return new OperationResult(true);
        }

        public async Task<OperationResult> Delete(int trashInspectionId)
        {
            var trashInspection = await _dbContext.TrashInspections.Select(x => new TrashInspectionModel
                {
                    Id = x.Id,
                    Date = x.Date,
                    EakCode = x.EakCode,
                    InstallationId = x.InstallationId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = x.Time,
                    Transporter = x.Transporter,
                    TrashFraction = x.TrashFraction,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone
                })
                .FirstOrDefaultAsync(x => x.Id == trashInspectionId);
            await _trashInspectionDeleteHandler.Handle(new TrashInspectionDeleted(trashInspection, true));
            //trashInspection.Delete(_dbContext);
            return new OperationResult(true);

        }

        public async Task<OperationResult> Delete(string weighingNumber, string token)
        {
            var trashInspectionSettings = _options.Value.Token;

            if (trashInspectionSettings != token)
            {
                return new OperationResult(false, "Unauthorized Access");
            }

            if (weighingNumber == null)
            {
                return new OperationResult(false);
            }

            var trashInspection = await _dbContext.TrashInspections
                .Select(x => new TrashInspectionModel
                {
                    Id = x.Id,
                    Date = x.Date,
                    EakCode = x.EakCode,
                    InstallationId = x.InstallationId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = x.Time,
                    Transporter = x.Transporter,
                    TrashFraction = x.TrashFraction,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone
                })
                .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);

            if (trashInspection != null)
            {
                await _trashInspectionDeleteHandler.Handle(new TrashInspectionDeleted(trashInspection, false));

                return new OperationResult(true);
            }

            return new OperationResult(false);
        }

        public async Task<OperationResult> SendToNav(int trashInspectionId)
        {
            // D1: there is no optimistic concurrency on the entity, so "check the flag then send"
            // is a TOCTOU race - a double click or two operators would each post a real weighing
            // to NAV. A named lock is fail-fast (0 second timeout), and unlike SELECT ... FOR UPDATE
            // it does not pin a row lock for the whole NAV call. The connection is opened
            // explicitly because MySQL named locks are scoped to a connection.
            //
            // LIMITATION: this is best effort, not a cluster-wide guarantee. Named locks are not
            // replicated by Galera, and the API connects through a service that load balances over
            // all three nodes, so two requests landing on different nodes can both acquire it.
            // It does reliably stop the common case (one operator double clicking). Closing the
            // gap properly needs a claim column on the entity, which means a migration in the base
            // repo - out of scope here. The lock name is schema qualified because named locks live
            // in a server-wide namespace shared by every tenant on the instance.
            var connectionOpened = false;
            var lockAcquired = false;

            try
            {
                await _dbContext.Database.OpenConnectionAsync();
                connectionOpened = true;

                lockAcquired = await ExecuteNavLockCommandAsync(
                    "SELECT GET_LOCK(CONCAT(DATABASE(), '_ti_nav_', @id), 0)",
                    trashInspectionId);

                if (!lockAcquired)
                {
                    return new OperationResult(false,
                        _trashInspectionLocalizationService.GetString("TrashInspectionIsAlreadyBeingSentToNav"));
                }

                return await SendToNavWhileLocked(trashInspectionId);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileSendingTrashInspectionToNav"));
            }
            finally
            {
                if (lockAcquired)
                {
                    try
                    {
                        await ExecuteNavLockCommandAsync(
                            "SELECT RELEASE_LOCK(CONCAT(DATABASE(), '_ti_nav_', @id))",
                            trashInspectionId);
                    }
                    catch (Exception e)
                    {
                        Trace.TraceError(e.Message);
                        _logger.LogError(e.Message);
                    }
                }

                if (connectionOpened)
                {
                    await _dbContext.Database.CloseConnectionAsync();
                }
            }
        }

        private async Task<bool> ExecuteNavLockCommandAsync(string sql, int trashInspectionId)
        {
            using var command = _dbContext.Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;

            var idParameter = command.CreateParameter();
            idParameter.ParameterName = "@id";
            idParameter.Value = trashInspectionId;
            command.Parameters.Add(idParameter);

            var result = await command.ExecuteScalarAsync();

            return result != null && result != DBNull.Value && Convert.ToInt64(result) == 1;
        }

        private async Task<OperationResult> SendToNavWhileLocked(int trashInspectionId)
        {
            // Re-read inside the lock: whatever the caller saw in the list may be stale.
            var trashInspection = await _dbContext.TrashInspections
                .FirstOrDefaultAsync(x => x.Id == trashInspectionId);

            if (trashInspection == null)
            {
                // The interpolated "TrashInspectionWithID:{id}DoesNotExist" form used elsewhere in
                // this file is not a real key - IStringLocalizer echoes the key back, so the user
                // sees the raw string. The actual key takes {0}.
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionWithIdNotExist", trashInspectionId));
            }

            if (trashInspection.WorkflowState == Constants.WorkflowStates.Removed)
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionIsRemoved"));
            }

            if (trashInspection.Status != 100)
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionIsNotCompleted"));
            }

            if (string.IsNullOrEmpty(trashInspection.WeighingNumber))
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionHasNoWeighingNumber"));
            }

            if (trashInspection.ResponseSendToCallBackUrl &&
                !string.IsNullOrEmpty(trashInspection.SuccessMessageFromCallBack))
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionIsAlreadySentToNav"));
            }

            // D7: rows that predate the handler populating ApprovedValue would silently deliver
            // "not approved" for an old load, so they are never resent.
            if (string.IsNullOrEmpty(trashInspection.ApprovedValue))
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("TrashInspectionHasNoApprovedValue"));
            }

            var settings = _options.Value;

            if (!IsNavConfigured(settings.CallBackUrl))
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("NavIsNotConfigured"));
            }

            // D8: the background service uses a WCF BasicHttpBinding for "basic". This sender is
            // NTLM shaped only, so anything else is rejected rather than silently sent over a
            // different transport than the one the customer is configured for.
            if (settings.CallbackCredentialAuthType != "NTLM")
            {
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("NavAuthTypeIsNotSupported"));
            }

            _coreHelper.LogEvent($"SendToNav: user {_userService.UserId} is sending trash inspection " +
                                 $"{trashInspection.Id} to NAV, weighing number {trashInspection.WeighingNumber}, " +
                                 $"approved {trashInspection.IsApproved}");

            var navCallResult = await _navCallbackSender.SendAsync(new NavCallbackSettings
            {
                CallBackUrl = settings.CallBackUrl,
                CallBackCredentialDomain = settings.CallBackCredentialDomain,
                CallbackCredentialUserName = settings.CallbackCredentialUserName,
                CallbackCredentialPassword = settings.CallbackCredentialPassword,
                CallbackCredentialAuthType = settings.CallbackCredentialAuthType
            }, trashInspection.WeighingNumber, trashInspection.IsApproved);

            // D9: UpdateInternal only writes when the change tracker has changes, so an identical
            // repeated failure would produce no version row at all. Always stamping the user and
            // the timestamp guarantees the version row that is the audit trail for this action.
            trashInspection.UpdatedByUserId = _userService.UserId;
            trashInspection.UpdatedAt = DateTime.UtcNow;

            if (navCallResult.Success)
            {
                trashInspection.ResponseSendToCallBackUrl = true;
                trashInspection.SuccessMessageFromCallBack = navCallResult.ReturnValue;
                trashInspection.ErrorFromCallBack = null;
                await trashInspection.Update(_dbContext);

                _coreHelper.LogEvent($"SendToNav: trash inspection {trashInspection.Id} was accepted by NAV: " +
                                     $"{navCallResult.ReturnValue}");

                return new OperationResult(true, navCallResult.ReturnValue);
            }

            // The full NAV response is kept in the database - the column is longtext and support
            // needs the whole 401 body or SOAP fault. Only what is shown to the user is capped:
            // the projection truncates for the grid tooltip, and this truncates for the toast.
            trashInspection.ErrorFromCallBack = navCallResult.Error;
            await trashInspection.Update(_dbContext);

            _coreHelper.LogException($"SendToNav: trash inspection {trashInspection.Id} was rejected by NAV: " +
                                     $"{navCallResult.Error}");

            return new OperationResult(false, Truncate(navCallResult.Error, ErrorFromCallBackMaxLength));
        }

        /// <summary>
        /// The callback url seeds to "...", so a tenant without a NAV integration must not see the
        /// NAV column, the NAV filter or the resend button at all (D11).
        /// </summary>
        private static bool IsNavConfigured(string callBackUrl)
        {
            return !string.IsNullOrEmpty(callBackUrl) && callBackUrl != "...";
        }

        private static string Truncate(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            {
                return value;
            }

            return value.Substring(0, maxLength);
        }

        public async Task<string> DownloadEFormPdf(string weighingNumber, string token, string fileType)
        {
            var trashInspectionSettings = _options.Value.Token;
            _coreHelper.LogEvent($"DownloadEFormPdf: weighingNumber is {weighingNumber} token is {token}");
            if (token == trashInspectionSettings && weighingNumber != null)
            {
                try
                {
                    var core = await _coreHelper.GetCore();
                    string microtingUId;
                    string microtingCheckUId;
                    var caseId = 0;
                    var eFormId = 0;
                    var trashInspection = await _dbContext.TrashInspections.Select(x => new TrashInspectionModel
                        {
                            Id = x.Id,
                            Date = x.Date,
                            EakCode = x.EakCode,
                            InstallationId = x.InstallationId,
                            MustBeInspected = x.MustBeInspected,
                            Producer = x.Producer,
                            RegistrationNumber = x.RegistrationNumber,
                            Time = x.Time,
                            Transporter = x.Transporter,
                            TrashFraction = x.TrashFraction,
                            WeighingNumber = x.WeighingNumber,
                            Status = x.Status,
                            Version = x.Version,
                            WorkflowState = x.WorkflowState,
                            ExtendedInspection = x.ExtendedInspection,
                            InspectionDone = x.InspectionDone,
                            SegmentId = x.SegmentId
                        })
                        .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);

                    var fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.ItemNumber == trashInspection.TrashFraction);
                    if (fraction == null)
                    {
                        fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Name == trashInspection.TrashFraction);
                    }
                    _coreHelper.LogEvent($"DownloadEFormPdf: fraction is {fraction.Name}");

                    var segmentName = "";

                    var segment = await _dbContext.Segments.SingleOrDefaultAsync(x => x.Id == trashInspection.SegmentId);
                    if (segment != null)
                    {
                        segmentName = segment.Name;
                    }
                    _coreHelper.LogEvent($"DownloadEFormPdf: segmentName is {segmentName}");

                    var xmlContent = new XElement("TrashInspection",
                        new XElement("EakCode", trashInspection.EakCode),
                        new XElement("Producer", trashInspection.Producer),
                        new XElement("RegistrationNumber", trashInspection.RegistrationNumber),
                        new XElement("Transporter", trashInspection.Transporter),
                        new XElement("WeighingNumber", trashInspection.WeighingNumber),
                        new XElement("Segment", segmentName),
                        new XElement("noImageTitle", "true"),
                        new XElement("TrashFraction", $"{fraction.ItemNumber} {fraction.Name}")
                    ).ToString();
                    _coreHelper.LogEvent($"DownloadEFormPdf: xmlContent is {xmlContent}");

                    foreach (var trashInspectionCase in _dbContext.TrashInspectionCases.Where(x => x.TrashInspectionId == trashInspection.Id).ToList())
                    {
                        if (trashInspectionCase.Status == 100)
                        {
                            var caseDto = await core.CaseLookupMUId(int.Parse(trashInspectionCase.SdkCaseId));
                            microtingUId = caseDto.MicrotingUId.ToString();
                            microtingCheckUId = caseDto.CheckUId.ToString();
                            caseId = (int)caseDto.CaseId;
                            eFormId = caseDto.CheckListId;
                        }
                    }

                    if (caseId != 0 && eFormId != 0)
                    {
                        _coreHelper.LogEvent($"DownloadEFormPdf: caseId is {caseId}, eFormId is {eFormId}");
                        await using var sdkDbContext = core.DbContextHelper.GetDbContext();
                        var language = await sdkDbContext.Languages.SingleAsync(x => x.LanguageCode == "da");
                        var filePath = await core.CaseToPdf(caseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, xmlContent, language);
                        if (!File.Exists(filePath))
                        {
                            throw new FileNotFoundException();
                        }

                        return filePath;
                    }

                    throw new Exception("could not find case of eform!");

                }
                catch (Exception exception)
                {
                    _coreHelper.LogException($"DownloadEFormPdf: We got the following exception: {exception.Message}");
                    throw new Exception("Something went wrong!", exception);
                }
            }

            throw new UnauthorizedAccessException();
        }

        private async Task UpdateProducerAndTransporter(TrashInspection trashInspection, TrashInspectionModel createModel)
        {
            var producer = _dbContext.Producers
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .SingleOrDefault(x => x.Name == createModel.Producer);

            if (producer == null)
            {
                producer = new Producer
                {
                    Name = createModel.Producer,
                    Address = createModel.ProducerAddress,
                    City = createModel.ProducerCity,
                    ContactPerson = createModel.ProducerContact,
                    Phone = createModel.ProducerPhone,
                    ZipCode = createModel.ProducerZip,
                    ForeignId = createModel.ProducerForeignId,
                    UpdatedByUserId = _userService.UserId,
                    CreatedByUserId = _userService.UserId,
                };

                await producer.Create(_dbContext);
            }
            else
            {
                producer.Address = createModel.ProducerAddress;
                producer.City = createModel.ProducerCity;
                producer.ContactPerson = createModel.ProducerContact;
                producer.Phone = createModel.ProducerPhone;
                producer.ZipCode = createModel.ProducerZip;
                producer.ForeignId = createModel.ProducerForeignId;
                producer.UpdatedByUserId = _userService.UserId;
                await producer.Update(_dbContext);
            }

            trashInspection.ProducerId = producer.Id;

            var transporter = _dbContext.Transporters
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .SingleOrDefault(x => x.Name == createModel.Transporter);

            if (transporter == null)
            {
                transporter = new Transporter
                {
                    Name = createModel.Transporter,
                    Address = createModel.TransporterAddress,
                    City = createModel.TransporterCity,
                    ZipCode = createModel.TransporterZip,
                    Phone = createModel.TransporterPhone,
                    ContactPerson = createModel.TransporterContact,
                    ForeignId = createModel.TransporterForeignId,
                    UpdatedByUserId = _userService.UserId,
                    CreatedByUserId = _userService.UserId,
                };

                await transporter.Create(_dbContext);
            }
            else
            {
                transporter.Address = createModel.TransporterAddress;
                transporter.City = createModel.TransporterCity;
                transporter.ZipCode = createModel.TransporterZip;
                transporter.Phone = createModel.TransporterPhone;
                transporter.ContactPerson = createModel.TransporterContact;
                transporter.ForeignId = createModel.TransporterForeignId;
                transporter.UpdatedByUserId = _userService.UserId;
                await transporter.Update(_dbContext);
            }

            trashInspection.TransporterId = transporter.Id;
            transporter.UpdatedByUserId = _userService.UserId;

            await trashInspection.Update(_dbContext);
        }

        private static IQueryable<TrashInspectionModel> AddSelectToQuery(IQueryable<TrashInspection> query, TimeZoneInfo timeZoneInfo, string token, bool includeNavMessages)
        {
            return query
                .Select(x => new TrashInspectionModel
                {
                    Id = x.Id,
                    Date = x.Date,
                    EakCode = x.EakCode,
                    InstallationId = x.InstallationId,
                    SegmentId = x.SegmentId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = TimeZoneInfo.ConvertTimeFromUtc(x.Time, timeZoneInfo),
                    Transporter = x.Transporter,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone,
                    FractionId = x.FractionId,
                    IsApproved = x.IsApproved,
                    Comment = x.Comment,
                    Token = token,
                    ResponseSendToCallBackUrl = x.ResponseSendToCallBackUrl,
                    SuccessMessageFromCallBack = includeNavMessages ? x.SuccessMessageFromCallBack : null,
                    ErrorFromCallBack = includeNavMessages
                        ? (x.ErrorFromCallBack.Length > ErrorFromCallBackMaxLength
                            ? x.ErrorFromCallBack.Substring(0, ErrorFromCallBackMaxLength)
                            : x.ErrorFromCallBack)
                        : null,
                    InstallationName = x.Installation.Name,
                    TrashFraction = $"{x.Fraction.ItemNumber} {x.Fraction.Name}",
                    Segment = x.Segment.Name,
                });
        }
    }
}
