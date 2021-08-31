//@version=4
study(title="MACD", shorttitle="MACD", resolution="")
// Getting inputs
fast_length = input(title="Fast Length", type=input.integer, defval=12)
slow_length = input(title="Slow Length", type=input.integer, defval=26)
src = input(title="Source", type=input.source, defval=close)
signal_length = input(title="Signal Smoothing", type=input.integer, minval = 1, maxval = 50, defval = 9)
sma_source = input(title="Oscillator MA Type", type=input.string, defval="EMA", options=["SMA", "EMA"])
sma_signal = input(title="Signal Line MA Type", type=input.string, defval="EMA", options=["SMA", "EMA"])
// Plot colors
col_macd = input(#2962FF, "MACD Line  ", input.color, group="Color Settings", inline="MACD")
col_signal = input(#FF6D00, "Signal Line  ", input.color, group="Color Settings", inline="Signal")
col_grow_above = input(#26A69A, "Above   Grow", input.color, group="Histogram", inline="Above")
col_fall_above = input(#B2DFDB, "Fall", input.color, group="Histogram", inline="Above")
col_grow_below = input(#FFCDD2, "Below Grow", input.color, group="Histogram", inline="Below")
col_fall_below = input(#FF5252, "Fall", input.color, group="Histogram", inline="Below")
// Calculating
fast_ma = sma_source == "SMA" ? sma(src, fast_length) : ema(src, fast_length)
slow_ma = sma_source == "SMA" ? sma(src, slow_length) : ema(src, slow_length)
macd = fast_ma - slow_ma
signal = sma_signal == "SMA" ? sma(macd, signal_length) : ema(macd, signal_length)
hist = macd - signal
plot(hist, title="Histogram", style=plot.style_columns, color=(hist>=0 ? (hist[1] < hist ? col_grow_above : col_fall_above) : (hist[1] < hist ? col_grow_below : col_fall_below)))
plot(macd, title="MACD", color=col_macd)
plot(signal, title="Signal", color=col_signal)

//STOCH
periodK = input(14, title="%K Length", minval=1)
smoothK = input(1, title="%K Smoothing", minval=1)
periodD = input(3, title="%D Smoothing", minval=1)
k = sma(stoch(close, high, low, periodK), smoothK)
d = sma(k, periodD)
plot(k, title="%K", color=#2962FF)
plot(d, title="%D", color=#FF6D00)