

import javax.swing.*;
import java.awt.*;

public class PlotPanel extends JPanel {

	private int history[];
	private int minDBValue = 10;
	
    public PlotPanel(int[] history, int minDBValue){
        setBackground(Color.LIGHT_GRAY);
        this.history = new int[history.length];
        for(int i = 0 ; i < history.length; i++) {
    		this.history[i] = history[i];
    	}
        this.minDBValue=minDBValue;
    }
    
    public void refresh(int[] history, int minDBValue) {
    	for(int i = 0 ; i < history.length; i++) {
    		this.history[i] = history[i];
    	}
    	this.minDBValue=minDBValue;
    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        for (int i = 0; i < history.length; i++) {
        	if (history[i] > minDBValue)
        		g.setColor(Color.ORANGE);
        	else
        		g.setColor(Color.BLUE);
            g.fillRect((int)(1.2*i*10), (-1)*history[i]+200, 10, 2*history[i]);
        }
    }
}
