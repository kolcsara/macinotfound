import javax.swing.*;
import java.awt.*;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.TargetDataLine;


public class Capture extends JFrame {
	
	private JPanel contentPanel;
	private JPanel northPanel;
	private JButton captureButton;
	private JTextField dBField;
	
	private ByteArrayOutputStream out;
	private AudioFormat format;
	
	private String path = "C:\\Users\\Istvan\\Desktop\\sound";
	private int history[] = new int[100];
	
	private int lastIndex = 0;
	
	public Capture() {
		
		super("Capture Sound Demo");
		
		captureButton = new JButton("Start Capture");
		captureButton.setEnabled(true);
		
		dBField = new JTextField("");
		dBField.setBackground(Color.LIGHT_GRAY);
		
        northPanel = new JPanel();
        northPanel.setLayout(new BorderLayout());
        
        northPanel.add(captureButton,BorderLayout.WEST);
        northPanel.add(dBField,BorderLayout.CENTER);
        
        contentPanel = new JPanel();
        contentPanel.setLayout(new BorderLayout());
        contentPanel.add(northPanel,BorderLayout.NORTH);
        
        this.setBounds(10, 10, 600, 400);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
        
        this.setContentPane(contentPanel);
		
		captureButton.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				captureButton.setEnabled(false);
				try {
					captureAudio();
				} catch (LineUnavailableException e) {
					e.printStackTrace();
				}
			}
		});
		        
		for(int i = 0 ; i < 100; i++) {
			history[i] = 0;
		}
	}
		      
	private int max(byte[] arr) {
		int giveBack = 0;
		for(int i = 0; i<arr.length;i++ )
		if(arr[i]> giveBack) giveBack = arr[i];
		return giveBack;
	}
	      
	public void save(File file) throws IOException {
		format = getFormat();
		byte[] audioData = out.toByteArray();
		ByteArrayInputStream bais = new ByteArrayInputStream(audioData);
		AudioInputStream audioInputStream = new AudioInputStream(bais, format,audioData.length / format.getFrameSize());
		AudioSystem.write(audioInputStream, AudioFileFormat.Type.WAVE, file);
		
		audioInputStream.close();
		out.close();
		out = new ByteArrayOutputStream();
	}
	      
	private void logToHistory(int toAdd) {
		if (lastIndex < 99) {
			lastIndex++;
			history[lastIndex] = toAdd;
		} else {
			for(int i = 0; i < 99; i++) history[i] = history[i+1];
			history[100] = toAdd;
		}
		    	  
		for(int i = 0; i< 100; i++)
			System.out.print(history[i] + " ");
		System.out.print("\n");
	}
	      
	      
	private void captureAudio() throws LineUnavailableException {
		
		final AudioFormat format = getFormat();
		DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
		final TargetDataLine line = (TargetDataLine)
		AudioSystem.getLine(info);
		line.open(format);
		line.start();
		          
		Runnable runner = new Runnable() {
			int bufferSize = (int)format.getSampleRate() * format.getFrameSize();
			byte buffer[] = new byte[bufferSize];
			boolean wasNoisy = false;
			
			@Override
			public void run() {
				out = new ByteArrayOutputStream();
				while (true) {
					int count = line.read(buffer, 0, buffer.length);
					int maxim = max(buffer);
					if(maxim >= 10){
						wasNoisy = true;
						out.write(buffer, 0, count);
					} else if(wasNoisy) {
						try {
							wasNoisy = false;
							out.write(buffer, 0, count);
							save(Paths.get(path+ System.currentTimeMillis() +".wav").toFile());
							} catch (IOException e) {
								e.printStackTrace();
							}
					    }
					    logToHistory(maxim);
				}
			}
		};
		  
		Thread captureThread = new Thread(runner);
		captureThread.start();
	}
	
	private AudioFormat getFormat() {
		float sampleRate = 8000;
		int sampleSizeInBits = 8;
		int channels = 1;
		boolean signed = true;
		boolean bigEndian = true;
		return new AudioFormat(sampleRate, sampleSizeInBits, channels, signed, bigEndian);
		}
	
	@SuppressWarnings("deprecation")
	public static void main(String args[]) {
		new Capture().show();
	}  
}