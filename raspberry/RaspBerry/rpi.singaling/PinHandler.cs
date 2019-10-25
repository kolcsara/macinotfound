
using Windows.Devices.Gpio;

namespace rpi.singaling
{
    public static class PinHandler
    {
        public static GpioController GpioController => GpioController.GetDefault();

        //this method returns an object for multiple reference avoiding
        public static object OpenPin(int pinNumber)
        {
            var pin = GpioController.OpenPin(pinNumber);

            pin.SetDriveMode(GpioPinDriveMode.Output);

            return pin;
        }

        public static void SetHighOutputOnPin(this object pinAsObject)
        {
            var pin = pinAsObject as GpioPin;

            pin.Write(GpioPinValue.High);
        }

        public static void SetLowOutputOnPin(this object pinAsObject)
        {
            var pin = pinAsObject as GpioPin;

            pin.Write(GpioPinValue.Low);
        }

        public static object SetHighOutputOnPin(this int pinAsInteger)
        {
            var pin = OpenPin(pinAsInteger);

            (pin as GpioPin).Write(GpioPinValue.High);

            return pin;
        }

        public static object SetLowOutputOnPin(this int pinAsInteger)
        {
            var pin = OpenPin(pinAsInteger);

            (pin as GpioPin).Write(GpioPinValue.Low);

            return pin;
        }

        public static void ClosePin(int pinNumber)
        {
            var pin = OpenPin(pinNumber) as GpioPin;

            pin.Dispose();

            pin = null;
        }

        public static void ClosePin(this object pinAsObject)
        {
            var pin = pinAsObject as GpioPin;

            pin.Dispose();

            pin = null;
            pinAsObject = null;
        }
    }
}
