using System.Collections.Generic;
using System.Web.Http;
using rpi.singaling;

namespace rpi.api.Controllers
{
    public class TurnOnController : ApiController
    {
        // GET: api/TurnOn
        public IEnumerable<string> Get()
        {
            var pin = WebApiConfig.Pin ?? PinHandler.OpenDefaultPin();

            pin.SetHighOutputOnPin();

            return new string[] { "Pin is Opened." };
        }
    }
}
