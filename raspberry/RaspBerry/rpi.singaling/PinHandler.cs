using System;
using Windows.Devices.Gpio;

namespace rpi.singaling
{
    public static class PinHandler
    {
        public static EventHandler PinStateChangeEvent;

        public static GpioController GpioController = GpioController ?? GpioController.GetDefault();

        private static bool _isWritingHigh = false;

        public static bool IsWritingHigh
        {
            get => _isWritingHigh;
            set
            {
                _isWritingHigh = value;
                PinStateChangeEvent?.Invoke(null, null);
            }
        }

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

            IsWritingHigh = true;
        }

        public static void SetLowOutputOnPin(this object pinAsObject)
        {
            var pin = pinAsObject as GpioPin;

            pin.Write(GpioPinValue.Low);

            IsWritingHigh = false;
        }

        public static object SetHighOutputOnPin(this int pinAsInteger)
        {
            var pin = OpenPin(pinAsInteger);

            (pin as GpioPin).Write(GpioPinValue.High);

            IsWritingHigh = true;

            return pin;
        }

        public static object SetLowOutputOnPin(this int pinAsInteger)
        {
            var pin = OpenPin(pinAsInteger);

            (pin as GpioPin).Write(GpioPinValue.Low);

            IsWritingHigh = false;

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

        public static void CloseDefaultPin()
        {
            ClosePin(3);
        }

        public static object OpenDefaultPin()
        {
            return OpenPin(3);
        }
    }
}
