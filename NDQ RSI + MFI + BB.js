//@version=3
study("NDQ RSI - MFI - BB", shorttitle="RSI - MFI- BB", overlay=false, precision=0)

// Khởi tạo tham số
src = close // Đặt loại giá để tính toán
for_rsi = input(title="RSI Length", type=integer, defval=14) // Giai đoạn cho RSI
for_ema = input(title="BB Length", type=integer, defval=21) // Dấu chấm cho EMA bên trong BB
for_mult = input(title="Stdev", type=integer, defval=2, minval=1, maxval=5) // Số độ lệch chuẩn cho BB
for_sigma = input(title="Dispersion", type=float, defval=0.1, minval=0.01, maxval=1) // Sự phân tán xung quanh MA

// Điều kiện làm việc của tập lệnh
current_rsi = rsi(src, for_rsi) // Vị trí hiện tại của chỉ báo RSI
basis = ema(current_rsi, for_ema)
dev = for_mult * stdev(current_rsi, for_ema)
upper = basis + dev
lower = basis - dev
disp_up = basis + ((upper - lower) * for_sigma) // Ngưỡng chấp nhận tối thiểu trong vùng chuyển động mà RSI phải vượt qua (từ trên xuống)
disp_down = basis - ((upper - lower) * for_sigma) // Ngưỡng tối thiểu có thể chấp nhận được trong vùng chuyển động mà RSI phải vượt qua (từ bên dưới)
color_rsi = current_rsi >= disp_up ? lime : current_rsi <= disp_down ? red : #ffea00 // Màu RSI hiện tại, tùy thuộc vào vị trí của nó bên trong BB

// Các dòng bổ sung và điền vào các khu vực cho RSI
h1 = hline(70, color=#d4d4d4, title="Overbought", linestyle=dotted, linewidth=1)
hline(50, title="Middle Line", color=#ffe500,  linestyle=dotted, linewidth=1)
h2 = hline(30, title="Oversold", color=#d4d4d4, linestyle=dotted, linewidth=1 )
fill (h1, h2, transp=100)

// Cảnh báo và điều kiện kích hoạt
rsi_Green = crossover(current_rsi, disp_up)
rsi_Red = crossunder(current_rsi, disp_down)

alertcondition(condition=rsi_Green, 
     title="RSI cross Above Dispersion Area",
     message="The RSI line closing crossed above the Dispersion area.")

alertcondition(condition=rsi_Red,
     title="RSI cross Under Dispersion Area",
     message="The RSI line closing crossed below the Dispersion area")

// Kết quả và vẽ
col=basis >= basis[1] ? lime : red
plot(basis, title="EMA", color=col, linewidth=3,style=line ,transp=0)

plot(upper, color=#00fff0, linewidth=1,transp=100)
plot(lower, color=#00fff0, linewidth=1, transp=100)
s1 = plot(disp_up, color=white, transp=100)
s2 = plot(disp_down, color=white, transp=100)
plot(current_rsi, color=color_rsi, linewidth=2, transp=0)

//mfi
// length = input(title="Length", type=input.integer, defval=14, minval=1, maxval=2000)
// source = hlc3
source = hlc3
length = input(14, minval=1)

upper_s= sum(volume * (change(source) <= 0 ? 0 : source), length)
lower_s = sum(volume * (change(source) >= 0 ? 0 : source), length)
_rsi(upper_s, lower_s) =>
    100.0 - (100.0 / (1.0 + upper_s / lower_s))
mf = _rsi(upper_s, lower_s)
plot(mf, "MF", color=#00ff13,  transp=50)