import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;
import javax.sound.sampled.TargetDataLine;
import javax.swing.JButton;
import javax.swing.JFrame;

import org.apache.http.*;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.entity.mime.MultipartEntityBuilder;

public class Capture extends JFrame {
      private ByteArrayOutputStream out;
      private AudioFormat format;
      List<File> filesToSend = new ArrayList<File>();
      int history[] = new int[100];
      int noiseLevel = 0;
      int lastIndex = 0;
      
      public Capture() {
        super("Capture Sound Application");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        try {
			captureAudio();
		} catch (LineUnavailableException e) {
			e.printStackTrace();
		}
        
        for(int i = 0 ;i < 100; i++) {
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
    	  if(lastIndex < 98) {
    		  lastIndex++;
    		  history[lastIndex]=toAdd;
    	  }else {
    		  for(int i = 0; i < 98; i++)history[i] = history[i+1];
    		  history[99] = toAdd;
    	  }
    	  
    	  //for(int i = 0; i< 100; i++)
    		  //System.out.print(history[i]+" ");
    	  //System.out.print("\n");
      }
      
      
      public void send(File toSend) throws IOException {
    	  CloseableHttpClient httpClient = HttpClients.createDefault();
    	  HttpPost uploadFile = new HttpPost("http://192.168.0.75:5500/api/mp3");
    	  MultipartEntityBuilder builder = MultipartEntityBuilder.create();
    	  builder.addBinaryBody(
    	      "mp3",
    	      new FileInputStream(toSend),
    	      ContentType.APPLICATION_OCTET_STREAM,
    	      toSend.getName()
    	  );

    	  HttpEntity multipart = builder.build();
    	  uploadFile.setEntity(multipart);
    	  CloseableHttpResponse response = httpClient.execute(uploadFile);
    	  HttpEntity responseEntity = response.getEntity();
    	  System.out.println(responseEntity.toString());
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
            
            public void run() {
            	out = new ByteArrayOutputStream();
                while (true) {
                	int count = line.read(buffer, 0, buffer.length);
                	int maxim = max(buffer);
                    if(maxim >= 10){
                    	wasNoisy = true;
                    	out.write(buffer, 0, count);
                    }else if(wasNoisy) {
                    	try {
                    		out.write(buffer, 0, count);
                    		wasNoisy = false;
                    		File f = Paths.get("\/Users\/attila.kolcsar\/MaciSandbox"+ System.currentTimeMillis() +".wav").toFile();
                    		filesToSend.add(f);
							save(f);
							System.out.println("File saved..."+filesToSend.size());
						} catch (IOException e) {
							e.printStackTrace();
						}
                    }
                    logToHistory(maxim);
                }
            }
          };
          
          Runnable sender = new Runnable() {
			@Override
			public void run() {
				
				while(true) {
					System.out.println(filesToSend.size()+"");
					if(!filesToSend.isEmpty()) {
						try {
							System.out.println("File sent...");
							send(filesToSend.get(0));
						} catch (IOException e) {
							e.printStackTrace();
						}
						filesToSend.remove(0);
					}
				}
			}
          };
          
          Thread senderThread = new Thread(sender);
          senderThread.start();
          
          Thread captureThread = new Thread(runner);
          captureThread.start();
      }
      
      
      private AudioFormat getFormat() {
        float sampleRate = 16000;
        int sampleSizeInBits = 8;
        int channels = 1;
        boolean signed = true;
        boolean bigEndian = true;
        return new AudioFormat(sampleRate, sampleSizeInBits, channels, signed, bigEndian);
      }
      
    public static void main(String args[]) {
       new Capture().setVisible(true);
      }  
}