using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using Newtonsoft.Json;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Const;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    public class TrashInspectionController : Controller
    {
        private readonly ITrashInspectionService _trashInspectionService;

        public TrashInspectionController(ITrashInspectionService trashInspectionService)
        {
            _trashInspectionService = trashInspectionService;
        }

        [HttpGet]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationDataResult<TrashInspectionsModel>> Index(TrashInspectionRequestModel requestModel)
        {
            return await _trashInspectionService.Index(requestModel);
        }
        
        [HttpPost]
        [AllowAnonymous]
        [DebuggingFilter]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> Create([FromBody] TrashInspectionModel createModel)
        {
            return await _trashInspectionService.Create(createModel);
        }

        [HttpGet]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationDataResult<TrashInspectionModel>> Read(int id)
        {
            return await _trashInspectionService.Read(id);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/versions/{id}")]
        public async Task<OperationDataResult<TrashInspectionVersionsModel>> ReadVersion(int id)
        {
            return await _trashInspectionService.ReadVersion(id);
        }
        
       

        [HttpPost]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/case-versions/{id}")]
        public async Task<OperationDataResult<TrashInspectionCaseVersionsModel>> IndexVersions(int id)
        {
            return await _trashInspectionService.IndexVersions(id);
        }

        [HttpPut]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> Update([FromBody] TrashInspectionModel updateModel)
        {
            return await _trashInspectionService.Update(updateModel);
        }

        [HttpDelete]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _trashInspectionService.Delete(id);
        }
                
        [HttpDelete]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/inspection-results/{weighingNumber}", Name = "token")]
        public async Task<OperationResult> Delete(string weighingNumber, string token)
        {
            return await _trashInspectionService.Delete(weighingNumber, token);

        }
        
        [HttpGet]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/inspection-results/{weighingNumber}")]
        public async Task<IActionResult> InspectionResults(string weighingNumber, string token, string fileType)
        {
            try
            {
                if (fileType == "result")
                {
                    var result =  await _trashInspectionService.Read(weighingNumber, token);
                    return new JsonResult(result.Model);
                }
                
                if (string.IsNullOrEmpty(fileType))
                {
                    fileType = "pdf";
                }
                string filePath = await _trashInspectionService.DownloadEFormPdf(weighingNumber, token, fileType);
                
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/pdf", Path.GetFileName(filePath));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch 
            {
                return BadRequest();
                
            }

        }
    }
    
    public class DebuggingFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.Method != "POST")
            {
                return;
            }
            
            filterContext.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);

            string text = new StreamReader(filterContext.HttpContext.Request.Body).ReadToEndAsync().Result;

            filterContext.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);
            
            Console.WriteLine(text);

            base.OnActionExecuting(filterContext);
        }
    }
}
