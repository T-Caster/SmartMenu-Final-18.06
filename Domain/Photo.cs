using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Photo
    {
        //the ID that we'll use will be the public I.D.
        // that we get back from cloudinary and we'll use that
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }

    }
}