//@version=3
study("NDQ RSI", shorttitle="RSI", overlay=false, precision=0)

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
color_rsi = current_rsi >= disp_up ? blue : current_rsi <= disp_down ? black : #000000 // Màu RSI hiện tại, tùy thuộc vào vị trí của nó bên trong BB

// Các dòng bổ sung và điền vào các khu vực cho RSI
h1 = hline(70, color=#000000, title="Overbought", linestyle=dotted, linewidth=1)
hline(50, title="Middle Line", color=#000000,  linestyle=dotted, linewidth=1)
h2 = hline(30, title="Oversold", color=#000000, linestyle=dotted, linewidth=1 )
fill (h1, h2)

// Kết quả và vẽ
col=basis >= basis[1] ? blue : black
plot(basis, title="EMA", color=col, linewidth=1,style=line ,transp=0)
plot(current_rsi, color=color_rsi, linewidth=1, transp=0)
