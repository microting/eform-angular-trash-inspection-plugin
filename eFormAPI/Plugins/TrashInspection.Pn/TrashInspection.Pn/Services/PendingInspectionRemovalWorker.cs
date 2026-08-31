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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Helpers;

namespace TrashInspection.Pn.Services
{
    /// <summary>
    /// Background worker that performs the device-side eForm removal deferred by the external /
    /// automated weighing-system delete (see TrashInspectionDeleteHandler, ShouldDelete == false).
    ///
    /// The external delete only marks the inspection InspectionDone and stamps UpdatedAt = now.
    /// This worker periodically picks up inspections whose UpdatedAt is older than the configured
    /// delay (default 1800s = 30 min) and only then removes their device-side cases, so a worker
    /// who is still filling in the inspection on their device isn't cut off immediately.
    /// </summary>
    public class PendingInspectionRemovalWorker : BackgroundService
    {
        private const int DefaultDelaySeconds = 1800;
        private const int PollIntervalSeconds = 60;
        private const string DelaySettingName = "TrashInspectionBaseSettings:InspectionRemovalDelaySeconds";

        private readonly string _connectionString;
        private readonly IEFormCoreService _coreHelper;

        public PendingInspectionRemovalWorker(string connectionString, IEFormCoreService coreHelper)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString));
            }

            _connectionString = connectionString;
            _coreHelper = coreHelper;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunCycle();
                }
                catch (Exception exception)
                {
                    Console.WriteLine($"[PendingInspectionRemovalWorker] cycle failed: {exception.Message}");
                }

                try
                {
                    await Task.Delay(TimeSpan.FromSeconds(PollIntervalSeconds), stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    // Shutdown requested.
                }
            }
        }

        private async Task RunCycle()
        {
            TrashInspectionPnDbContext db = new DbContextHelper(_connectionString).GetDbContext();
            await using (db)
            {
                int delaySeconds = await GetDelaySeconds(db);
                Core core = await _coreHelper.GetCore();

                var dueCases = await PendingInspectionRemoval.GetCasesDueForRemoval(
                    db, delaySeconds, DateTime.UtcNow);

                int removed = 0;
                foreach (var trashInspectionCase in dueCases)
                {
                    // Per-case isolation: a single bad SdkCaseId or a failing CaseDelete must not
                    // abandon the rest of the batch (the worker recurs every 60s, so a stuck batch
                    // would permanently stall every due case that follows the bad row).
                    try
                    {
                        if (!int.TryParse(trashInspectionCase.SdkCaseId, out int sdkCaseId))
                        {
                            Console.WriteLine($"[PendingInspectionRemovalWorker] invalid SdkCaseId " +
                                $"'{trashInspectionCase.SdkCaseId}' on case {trashInspectionCase.Id}, skipping");
                            continue;
                        }

                        if (await core.CaseDelete(sdkCaseId))
                        {
                            await trashInspectionCase.Delete(db);
                            removed++;
                        }
                    }
                    catch (Exception exception)
                    {
                        Console.WriteLine($"[PendingInspectionRemovalWorker] failed to remove case " +
                            $"{trashInspectionCase.Id}: {exception.Message}");
                    }
                }

                if (removed > 0)
                {
                    Console.WriteLine($"[PendingInspectionRemovalWorker] removed {removed} deferred case(s)");
                }
            }
        }

        private static async Task<int> GetDelaySeconds(TrashInspectionPnDbContext db)
        {
            string value = (await db.PluginConfigurationValues
                .SingleOrDefaultAsync(x => x.Name == DelaySettingName))?.Value;

            return int.TryParse(value, out int parsed) && parsed > 0 ? parsed : DefaultDelaySeconds;
        }
    }
}
