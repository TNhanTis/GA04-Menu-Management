### Tổng quan vai trò

- **Hải (Core & Modifiers):** Phụ trách Kiến trúc DB, Categories (Danh mục) và Modifiers (Món đi kèm/Topping). Đây là người nắm cấu trúc dữ liệu nền tảng.
- **Bảo (Main Items & Admin UI):** Phụ trách quản lý Menu Items (Món ăn) chính, bao gồm hiển thị danh sách, lọc, sắp xếp và Form tạo món chính.
- **Nhân (Media & Guest View):** Phụ trách xử lý ảnh (Upload/Storage), và giao diện phía Khách hàng (Guest Menu) để hiển thị kết quả cuối cùng.

---

### Chi tiết Task cho từng thành viên

#### 👤 Hải: The Architect (Categories + Modifiers)

**Trọng tâm:** Xây dựng khung Database và xử lý logic phức tạp của Modifiers (Size, Topping).

- **Backend (Node.js):**
- [Database] Viết script migration tạo bảng (như mẫu schema): `menu_categories`, `modifier_groups`, `modifier_options`, `menu_item_modifier_groups`.
- [API] **Category CRUD:** Implement các endpoint tạo, sửa, xóa (soft delete), lấy danh sách category.
- [API] **Modifiers CRUD:** Implement endpoint tạo Group (ví dụ: Size, Sugar), tạo Option cho Group.
- [API] Xử lý logic gán Modifier vào Item (Endpoint: `POST .../items/:id/modifier-groups`).

- **Frontend (React):**
- [UI] Màn hình quản lý Category (Table list + Modal/Form thêm sửa xóa).
- [UI] Màn hình quản lý Modifiers (Tạo nhóm topping, set giá tiền cho từng topping).

- **Nhiệm vụ đặc biệt:** Đảm bảo constraint DB (ràng buộc dữ liệu) đúng như yêu cầu (Section 1 & 4).

#### 👤 Bảo: The Manager (Menu Items & Advanced List)

**Trọng tâm:** Xử lý luồng chính của Admin, validate dữ liệu món ăn và làm giao diện bảng dữ liệu phức tạp.

- **Backend (Node.js):**
- [Database] Tạo bảng `menu_items`.
- [API] **Item CRUD:** Tạo, sửa, xóa món ăn. Validate kỹ các field (price > 0, status).
- [API] **Advanced List:** Viết query cho endpoint `GET /items` hỗ trợ Filter (theo tên, category), Sort (giá, ngày tạo) và Pagination.

- **Frontend (React):**
- [UI] **Dashboard Table:** Dựng component bảng hiển thị danh sách món ăn xịn xò (có phân trang, ô tìm kiếm, dropdown lọc status/category) - _Đây là task UI nặng nhất_.
- [UI] **Item Form:** Form tạo/sửa món ăn. Form này cần gọi API lấy danh sách Category từ Hải để đổ vào dropdown chọn.

- **Nhiệm vụ đặc biệt:** Xử lý logic validate form (React Hook Form + Zod/Yup) để đảm bảo không nhập sai giá hoặc tên quá ngắn (Section 2 & 6).

#### 👤 Nhân: The Presenter (Photos + Guest View)

**Trọng tâm:** Xử lý file (ảnh) và làm giao diện phía người dùng cuối (Menu QR).

- **Backend (Node.js):**
- [Database] Tạo bảng `menu_item_photos`.
- [API] **Upload:** Cấu hình `multer` để upload ảnh, validate đuôi file (jpg/png), lưu file vào folder hoặc cloud, lưu path vào DB.
- [API] **Guest Endpoint:** Viết API `GET /api/menu` (Public) trả về cục data JSON khổng lồ gồm: Categories -> Items (Active) -> Photos (Primary) -> Modifiers để hiển thị cho khách.

- **Frontend (React):**
- [UI] **Upload Component:** Làm component cho phép kéo thả ảnh, xem preview, nút xóa ảnh, nút chọn "Set as Primary". Nhúng component này vào Form của Bảo.
- [UI] **Guest Menu Page:** Dựng trang menu cho khách (Mobile view), hiển thị danh sách món theo category, hiển thị ảnh và giá.

- **Nhiệm vụ đặc biệt:** Bảo mật upload file (đổi tên file ngẫu nhiên) và tối ưu query cho Guest Endpoint (tránh lỗi N+1 query) (Section 3 & 5).

---

### 🗓️ Lộ trình phối hợp (Dependency Flow)

Để tránh việc người này ngồi chơi đợi người kia, hãy làm theo thứ tự sau:

1. **Giai đoạn 1 (Setup - 1 ngày):**

- **Hải:** Chốt file `schema.sql` và tạo xong Database. Push code khung dự án.
- **Bảo & Nhân:** Cài đặt môi trường, nghiên cứu thư viện (React Table, Multer).

2. **Giai đoạn 2 (Core API - 2-3 ngày):**

- **Hải:** Làm xong API Categories.
- **Bảo:** Làm xong API Items (lúc này chưa cần ảnh, chưa cần modifiers).
- **Nhân:** Viết xong Middleware Upload ảnh.

3. **Giai đoạn 3 (UI & Integration - 2-3 ngày):**

- **Hải:** Làm UI Category & Modifiers.
- **Bảo:** Làm UI Table danh sách món & Form thêm món cơ bản.
- **Nhân:** Ghép component Upload ảnh vào Form của Bảo.

4. **Giai đoạn 4 (Finishing - 1-2 ngày):**

- **Hải:** Hỗ trợ Bảo ghép API gắn Modifier vào món ăn.
- **Nhân:** Dùng data thật từ DB để hiển thị lên trang Guest Menu.
- **Cả nhóm:** Test luồng: Tạo Category -> Tạo Modifier -> Tạo Món (kèm ảnh + modifier) -> Ra trang Guest xem có hiện không.

### 💡 Mẹo nhỏ cho nhóm

- **Git:** Vì cả 3 cùng làm việc trên file `menu` khá nhiều, hãy chia nhánh rõ ràng: `feature/category-modifier`, `feature/item-management`, `feature/photos-guest`.
- **Data giả:** Trong lúc đợi Bảo làm xong API thêm món, Nhân có thể tự insert dữ liệu cứng vào DB để làm trang Guest Menu trước cho đỡ phí thời gian.
