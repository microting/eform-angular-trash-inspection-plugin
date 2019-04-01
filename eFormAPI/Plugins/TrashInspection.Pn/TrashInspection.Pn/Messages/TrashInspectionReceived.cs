using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Messages
{
    public class TrashInspectionReceived
    {
        public TrashInspectionModel TrashInspectionModel { get; protected set; }
        public Fraction Fraction { get; protected set; }
        public Segment Segment { get; protected set; }
        public Installation Installation { get; protected set; }
        
        public TrashInspectionReceived(TrashInspectionModel trashInspectionModel, Fraction fraction, Segment segment, Installation installation)
        {

            TrashInspectionModel = trashInspectionModel;
            Fraction = fraction;
            Segment = segment;
            Installation = installation;
        }
    }
}