using rpi.singaling;
using System;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
//using rpi.singaling;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace client.UWP
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private object _pin;
        public MainPage()
        {
            this.InitializeComponent();
            PinHandler.PinStateChangeEvent += OnPinStateChange;
        }

        public void Force_Switch(Object sender, RoutedEventArgs e)
        {
            if (PinHandler.IsWritingHigh)
            {
                _pin = _pin ?? PinHandler.OpenDefaultPin();
                _pin.SetLowOutputOnPin();
                _pin.ClosePin();
                _pin = null;
            }
            else
            {
                _pin = _pin ?? PinHandler.OpenDefaultPin();
                _pin.SetHighOutputOnPin();
            }
        }

        private void OnPinStateChange(object obj, EventArgs e)
        {
            if (PinHandler.IsWritingHigh)
            {
                border.Background = new SolidColorBrush(Colors.Green);
            }
            else
            {
                border.Background = new SolidColorBrush(Colors.Red);
            }
        }
    }
}
