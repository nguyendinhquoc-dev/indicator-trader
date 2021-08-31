//@version=4
//Heikin Ashi
study("NDQ keltner - EMA - SAR", shorttitle="keltner - EMA - SAR", overlay=true, resolution="")
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
plot(out, "ParabolicSAR", style = plot.style_cross, color =#26a69a, display = 0)

//kel
length = input(20, minval=1)
mult = input(1.0, "Multiplier")
exp = input(true, "Use Exponential MA")
BandsStyle = input("Average True Range", options = ["Average True Range", "True Range", "Range"], title="Bands Style")
atrlength = input(10, "ATR Length")
esma(source, length)=>
	s = sma(source, length)
	e = ema(source, length)
	exp ? e : s
ma = esma(src, length)
rangema = BandsStyle == "True Range" ? rma(tr(true), length) : BandsStyle == "Average True Range" ? atr(atrlength) : rma(high - low, length)
upper = ma + rangema * mult
lower = ma - rangema * mult
u = plot(upper, color=#26a69a, title="Upper",  display = 0)
plot(ma, color=#2962FF, title="Basis", display = 0)
l = plot(lower, color=#26a69a, title="Lower", display = 0)
fill(u, l, color=color.rgb(33, 150, 243, 100), title="Background")