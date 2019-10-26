using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace rpi.webapi.Controllers
{
    public class PinController : Controller
    {
        public int TurnOn()
        {
            return 1;
        }

        public int TurnOff()
        {
            return 0;
        }
    }
}
