using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Data.Factories;
using TrashInspection.Pn.Infrastructure.Extensions;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace TrashInspection.Pn
{
    public class EformTrashInspectionPlugin
    {
    }
}
