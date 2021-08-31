//@version=4
study("NDQ EMA", shorttitle="EMA", overlay=true)
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
alpha       = input(title = "EMA",    type = input.integer, defval = 21)

LL = f_LazyLine(price, alpha)
c_up        = color.new(#00ff0a, 0)
c_down        = color.new(#ff0500, 0)
uptrend     = LL > LL[1]

plot(LL,                "EMA Q",  color = uptrend ? c_up : c_down,  linewidth=2)
