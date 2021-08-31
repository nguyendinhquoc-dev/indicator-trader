//@version=4
study(title="NDQ Pivot Points High Low", shorttitle="Pivots HL", overlay=true, max_labels_count=500)

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
