using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace rpi.webapi
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/");// {*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new
                {
                    controller = "Home",
                    action = "Index",
                    id = UrlParameter.Optional
                });
 

             routes.MapRoute(
                name: "PinOn",
                url: "{controller}/TurnOn",
                defaults: new
                {
                    controller = "Pin",
                    action = "TurnOn"
                }
            );

            routes.MapRoute(
                name: "PinOff",
                url: "{controller}/TurnOff",
                defaults: new
                {
                    controller = "Pin",
                    action = "TurnOFF"
                }
            );
        }
    }
}
