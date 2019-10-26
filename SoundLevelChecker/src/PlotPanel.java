

import javax.swing.*;
import java.awt.*;

public class PlotPanel extends JPanel {

	private int history[] = new int[100];
	
    public PlotPanel(int[] history){
        setBackground(Color.LIGHT_GRAY);
        
        for(int i = 0 ; i < history.length; i++) {
    		this.history[i] = history[i];
    	}
    }
    public void refresh(int[] history) {
    	for(int i = 0 ; i < history.length; i++) {
    		this.history[i] = history[i];
    	}
    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        g.setColor(Color.BLUE);
        for (int i = 0; i < history.length; i++) {
            g.fillOval(i*10, (-1)*history[i]+200, 10, 10);
        }
    }
}
