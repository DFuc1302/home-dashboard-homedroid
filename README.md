# Nhà — Home Dashboard

Dashboard nhẹ dành cho HomeDroid: đồng hồ, thời tiết, trạng thái dịch vụ LAN, lối tắt, danh sách việc và ghi chú nhanh.

## Đặc điểm

- Static site, không dependency và không cần build.
- Tự dùng hostname hiện tại để tạo link tới các cổng HomeDroid.
- Kiểm tra HomeDroid, AdGuard Home, Mộc, Jellyfin, Home Assistant và Local AI.
- Thời tiết từ Open-Meteo; có thể đổi thành phố.
- Việc cần làm, ghi chú, thành phố và theme lưu trong `localStorage` của từng trình duyệt.

## Chạy thử

```bash
python -m http.server 4174
node dashboard.test.mjs
```

Mở `http://localhost:4174`.

## Deploy bằng HomeDroid

Tạo deployment với:

| Trường | Giá trị |
| --- | --- |
| Repository | URL HTTPS của repository này |
| Branch | `main` |
| Port | `4174` |
| Runtime | `Static` hoặc `Auto` |
| Build command | để trống |
| Start command | để trống |

Sau khi deploy, mở `http://<IP-HomeDroid>:4174`.

Các thẻ dịch vụ mặc định dùng cổng chuẩn của HomeDroid. Dịch vụ chưa cài sẽ hiện `Ngoại tuyến`.
