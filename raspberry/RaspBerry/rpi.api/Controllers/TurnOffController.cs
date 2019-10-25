using rpi.singaling;
using System.Collections.Generic;
using System.Web.Http;

namespace rpi.api.Controllers
{
    public class TurnOffController : ApiController
    {
        // GET: api/TurnOff
        public IEnumerable<string> Get()
        {
            var pin = WebApiConfig.Pin ?? PinHandler.OpenDefaultPin();

            pin.SetLowOutputOnPin();

            pin.ClosePin();

            return new string[] { "Pin is Closed." };
        }
    }
}
