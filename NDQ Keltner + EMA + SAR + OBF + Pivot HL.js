//@version=4
study("NDQ keltner - EMA - SAR - OBF - Pivot HL", shorttitle="NDQ keltner - EMA - SAR - OBF - Pivot HL", overlay=true)
//EMA Q
f_LazyLine(_data, _length) =>
    e1 = 0, e2 = 0, e3 = 0
    L1 = 0.0, L2 = 0.0, L3 = 0.0
    w = _length / 3
    
    if _length > 2 
        e2 := round(w)
        e1 := round((_length-e2)/2)
        e3 :=   int((_length-e2)/2)
        
        L1 := ema(_data, e1)
        L2 := ema(L1, e2)
        L3 := wma(L2, e3)
    else
        L3 := _data
    L3
//====================================
price       = input(title = "Source",      type = input.source,  defval = close)
alpha       = input(title = "EMA Q",    type = input.integer, defval = 10)

LL = f_LazyLine(price, alpha)

c_up        = color.new(#00ff0a, 0)
c_down        = color.new(#ff0500, 0)
uptrend     = LL > LL[1]

plot(LL,                "EMA Q",  color = uptrend ? c_up : c_down,  linewidth=2)

//4 EMA
EMA1 = input(21, minval = 1)
EMA2 = input(50, minval = 1)
EMA3 = input(100, minval = 1)
EMA4 = input(200, minval = 1)

src = input(close, title = "Source")

media_1 = ema(src, EMA1)
media_2 = ema(src, EMA2)
media_3 = ema(src, EMA3)
media_4 = ema(src, EMA4)

plot(media_1, color =#ffffff)
plot(media_2, color =#4db6ac)
plot(media_3, color =#66bb6a, linewidth=2)
plot(media_4, color =#0097a7, linewidth=2, display=0)

//SAR
start = input(0.02)
increment = input(0.02)
maximum = input(0.2, "Max Value")
out = sar(start, increment, maximum)
plot(out, "ParabolicSAR", style = plot.style_cross, color =#26a69a, display=0)




////////////// ORDER BLOCK FINDER
colors    = input(title = "Color Scheme", defval="BRIGHT", options=["BRIGHT", "DARK"])
periods   = input(5,     "Relevant Periods to identify OB")                // Required number of subsequent candles in the same direction to identify Order Block
threshold = input(0.0,   "Min. Percent move to identify OB", step = 0.1)   // Required minimum % move (from potential OB close to last subsequent candle to identify Order Block)
usewicks  = input(false, "Use whole range [High/Low] for OB marking?" )    // Display High/Low range for each OB instead of Open/Low for Bullish / Open/High for Bearish
showbull  = input(true,  "Show latest Bullish Channel?")                   // Show Channel for latest Bullish OB?
showbear  = input(true,  "Show latest Bearish Channel?")                   // Show Channel for latest Bearish OB?  
ob_period = periods + 1                                                    // Identify location of relevant Order Block candle
absmove   = ((abs(close[ob_period] - close[1]))/close[ob_period]) * 100    // Calculate absolute percent move from potential OB to last candle of subsequent candles
relmove   = absmove >= threshold                                           // Identify "Relevant move" by comparing the absolute move to the threshold

// Color Scheme
bearcolor = colors == "BRIGHT"? color.red : color.blue
bullcolor = colors == "BRIGHT"? color.green : color.white

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

//piot
//INPUTS
gr1="Source / Length Left / Length Right"
srcH = input(high, title="Pivot High", inline="Pivot High", group=gr1)
leftLenH = input(title="", type=input.integer, defval=5, minval=1, inline="Pivot High",group=gr1)
rightLenH = input(title="/", type=input.integer, defval=5, minval=1, inline="Pivot High",group=gr1)
colorH = input(title="", defval=color.new(color.green,50), inline="Pivot High",group=gr1)

srcL = input(low, title="Pivot Low ", inline="Pivot Low", group=gr1)
leftLenL = input(title="", type=input.integer, defval=5, minval=1, inline="Pivot Low", group=gr1)
rightLenL = input(title="/", type=input.integer, defval=5, minval=1, inline="Pivot Low",group=gr1)
colorL = input(title="", defval=color.new(color.red,50), inline="Pivot Low",group=gr1)


gr2="Options"
ShowHHLL = input(true, title="Show HH, LL, LH, HL markers on candles",group=gr2)
// Get High and Low Pivot Points
ph = pivothigh(srcH, leftLenH, rightLenH)
pl = pivotlow(srcL, leftLenL, rightLenL)

// Higher Highs, Lower Highs, Higher Lows, Lower Lows 
valuewhen_1 = valuewhen(ph, srcH[rightLenH], 1)
valuewhen_2 = valuewhen(ph, srcH[rightLenH], 0)
higherhigh = na(ph) ? na : valuewhen_1 < valuewhen_2 ? ph : na
valuewhen_3 = valuewhen(ph, srcH[rightLenH], 1)
valuewhen_4 = valuewhen(ph, srcH[rightLenH], 0)
lowerhigh = na(ph) ? na : valuewhen_3 > valuewhen_4 ? ph : na
valuewhen_5 = valuewhen(pl, srcL[rightLenL], 1)
valuewhen_6 = valuewhen(pl, srcL[rightLenL ], 0)
higherlow = na(pl) ? na : valuewhen_5 < valuewhen_6 ? pl : na
valuewhen_7 = valuewhen(pl, srcL[rightLenL], 1)
valuewhen_8 = valuewhen(pl, srcL[rightLenL ], 0)
lowerlow = na(pl) ? na : valuewhen_7 > valuewhen_8 ? pl : na


drawLabel(_offset, _pivot, _style, _yloc, _color, _text) =>
    if not na(_pivot)
        label.new(bar_index[_offset], _pivot, text = _text+tostring(_pivot, format.mintick)+"]", style=_style, yloc=_yloc, color=_color, textcolor=_color)

plotshape(ShowHHLL ? higherhigh : na, title='HH', style=shape.triangledown, location=location.abovebar, color=colorH, text="HH", textcolor=colorH, offset=-rightLenH)
plotshape(ShowHHLL ? higherlow : na, title='HL', style=shape.triangleup, location=location.belowbar, color=colorL, text="HL", textcolor=colorL, offset=-rightLenH)
plotshape(ShowHHLL ? lowerhigh : na, title='LH', style=shape.triangledown, location=location.abovebar, color=colorH, text="LH", textcolor=colorH, offset=-rightLenL)
plotshape(ShowHHLL ? lowerlow : na, title='LL', style=shape.triangleup, location=location.belowbar, color=colorL, text="LL", textcolor=colorL, offset=-rightLenL)


//Count How many candles for current Pivot Level, If new reset.
countH = 0
countL = 0
countH := na(ph) ? nz(countH[1]) + 1 : 0
countL := na(pl) ? nz(countL[1]) + 1 : 0

pvtH = 0.0
pvtL = 0.0
pvtH := na(ph) ? pvtH[1] : srcH[rightLenH]
pvtL := na(pl) ? pvtL[1] : srcL[rightLenL]

HpC = pvtH != pvtH[1] ? na : colorH
LpC = pvtL != pvtL[1] ? na : colorL

