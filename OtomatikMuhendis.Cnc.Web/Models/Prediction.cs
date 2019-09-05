using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OtomatikMuhendis.Cnc.Web.Models
{
    public class Prediction
    {
        public double Probability { get; set; }

        public string TagId { get; set; }

        public string TagName { get; set; }

        public BoundingBox BoundingBox { get; set; }
    }

    public class BoundingBox
    {
        public double Left { get; set; }

        public double Top { get; set; }

        public double Width { get; set; }

        public double Height { get; set; }
    }
}
