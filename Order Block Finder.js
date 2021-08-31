//@version=4
study("Order Block Finder", overlay = true)               

colors    = input(title = "Color Scheme", defval="DARK", options=["DARK", "BRIGHT"])
periods   = input(5,     "Relevant Periods to identify OB")                // Required number of subsequent candles in the same direction to identify Order Block
threshold = input(0.0,   "Min. Percent move to identify OB", step = 0.1)   // Required minimum % move (from potential OB close to last subsequent candle to identify Order Block)
usewicks  = input(false, "Use whole range [High/Low] for OB marking?" )    // Display High/Low range for each OB instead of Open/Low for Bullish / Open/High for Bearish
showbull  = input(true,  "Show latest Bullish Channel?")                   // Show Channel for latest Bullish OB?
showbear  = input(true,  "Show latest Bearish Channel?")                   // Show Channel for latest Bearish OB?  
ob_period = periods + 1                                                    // Identify location of relevant Order Block candle
absmove   = ((abs(close[ob_period] - close[1]))/close[ob_period]) * 100    // Calculate absolute percent move from potential OB to last candle of subsequent candles
relmove   = absmove >= threshold                                           // Identify "Relevant move" by comparing the absolute move to the threshold

// Color Scheme
bullcolor = colors == "DARK"? color.white : color.green
bearcolor = colors == "DARK"? color.blue : color.red

// Bullish Order Block Identification
bullishOB = close[ob_period] < open[ob_period]                             // Determine potential Bullish OB candle (red candle)

int upcandles  = 0
for i = 1 to periods
    upcandles := upcandles + (close[i] > open[i]? 1 : 0)                   // Determine color of subsequent candles (must all be green to identify a valid Bearish OB)

OB_bull      = bullishOB and (upcandles == (periods)) and relmove          // Identification logic (red OB candle & subsequent green candles)
OB_bull_high = OB_bull? usewicks? high[ob_period] : open[ob_period] : na   // Determine OB upper limit (Open or High depending on input)
OB_bull_low  = OB_bull? low[ob_period]  : na                               // Determine OB lower limit (Low)
OB_bull_avg  = (OB_bull_high + OB_bull_low)/2                              // Determine OB middle line


// Bearish Order Block Identification
bearishOB = close[ob_period] > open[ob_period]                             // Determine potential Bearish OB candle (green candle)

int downcandles  = 0
for i = 1 to periods
    downcandles := downcandles + (close[i] < open[i]? 1 : 0)               // Determine color of subsequent candles (must all be red to identify a valid Bearish OB)

OB_bear      = bearishOB and (downcandles == (periods)) and relmove        // Identification logic (green OB candle & subsequent green candles)
OB_bear_high = OB_bear? high[ob_period] : na                               // Determine OB upper limit (High)
OB_bear_low  = OB_bear? usewicks? low[ob_period] : open[ob_period] : na    // Determine OB lower limit (Open or Low depending on input)
OB_bear_avg  = (OB_bear_low + OB_bear_high)/2                              // Determine OB middle line

var line linebull1 = na       // Bullish OB average 
var line linebear1 = na       // Bearish OB average


if OB_bull and showbull
    line.delete(linebull1)
    linebull1 := line.new(x1 = bar_index, y1 = OB_bull_avg, x2 = bar_index - 1, y2 = OB_bull_avg, extend = extend.left, color = bullcolor, style = line.style_solid, width = 1)
if OB_bear and showbear
    line.delete(linebear1)
    linebear1 := line.new(x1 = bar_index, y1 = OB_bear_avg, x2 = bar_index - 1, y2 = OB_bear_avg, extend = extend.left, color = bearcolor,  style = line.style_solid, width = 1)

// Print latest Order Blocks in Data Window

var latest_bull_avg  = 0.0         // Variable to keep latest Bull OB average
var latest_bear_avg  = 0.0         // Variable to keep latest Bear OB average

//InfoPanel for latest Order Blocks

draw_InfoPanel(_text, _x, _y, font_size)=>
    var label la_panel = na
    label.delete(la_panel)
    la_panel := label.new(
         x=_x, y=_y, 
         text=_text, xloc=xloc.bar_time, yloc=yloc.price, 
         color=color.new(#383838, 5), style=label.style_label_left, textcolor=color.white, size=font_size)

info_panel_x = time_close + round(change(time) * 100)
info_panel_y = close

title = "LATEST ORDER BLOCKS"
row0 = "-----------------------------------------------------"
row2 = ' Bullish - Avg: ' + tostring(latest_bull_avg, '#.##')
row4 = "-----------------------------------------------------"
row6 = ' Bearish - Avg: ' + tostring(latest_bear_avg, '#.##')
panel_text = '\n' + title + '\n' + row0 + '\n' + row2 + '\n' + row4 + '\n' + row6 + '\n'