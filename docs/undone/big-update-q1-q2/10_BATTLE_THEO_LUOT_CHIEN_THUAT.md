# Battle nâng cấp — Đấu trí bằng cổ, ra đòn có sức nặng

**Trạng thái 01/10/2026:** đã có lát cắt chơi thật BATTLE-01 và phần lõi BATTLE-02 trong `index.html`; BATTLE-03–06 chưa triển khai. Kế thừa yêu cầu giữ khung game trong [09_UI_POLISH_GIU_KHUNG_HIEN_TAI.md](09_UI_POLISH_GIU_KHUNG_HIEN_TAI.md). Tài liệu này vừa là định hướng dài hạn, vừa ghi rõ phần nào đã qua kiểm chứng.

### Lát cắt hiện đã chạy

- Mode **Đấu trí** theo lượt, đứng chờ người chơi; save mới dùng mode này, preference `turn`/`rt` cũ vẫn được giữ.
- HUD vòng, phase, chân nguyên tuần hoàn, ý đồ và khoảng sát thương dùng chung công thức với resolver.
- Thủ thế cơ bản, kết quả vòng, lý do thiếu chân nguyên, hấp thu mở trần tuần hoàn, khóa input khi đang giải quyết và phục hồi đúng phase sau reload.
- Prototype sơ hở: địch dùng đòn nặng sẽ lộ sơ hở cho một hành động công kích kế tiếp, tăng 30% sát thương và giảm nửa giáp. Đây mới là cầu nối để preview cảm giác; pattern/pha có điều kiện của BATTLE-03 vẫn chưa làm.
- Preview game thật: [previews/battle-b01-b02](../../done/PREVIEW_UI_VA_BATTLE.md#source-previews-battle-b01-b02-readme-md).

Nguồn chuẩn thế giới, nhân vật và công dụng cổ: [Q1](../../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [Q2](../../reference/CHI_TIET_NGUYEN_TAC_Q2.md). Các chỉ số, nhịp và hệ chiến thuật mới dưới đây là **đề xuất chuyển thể gameplay**, cần kiểm chứng; không tự coi là cơ chế nguyên tác.

## 1. Quyết định cốt lõi

**Lấy chiến đấu theo lượt làm trải nghiệm chính: có thời gian quyết định, nhưng diễn biến đòn đánh vẫn sống động.**

Vòng chơi muốn đạt:

> Đọc ý đồ → chọn cổ và cách đối phó → tạo lợi thế → ép đối thủ lộ sơ hở → tung sát chiêu hoặc đạt mục tiêu trận.

Người chơi giỏi vì biết dùng cổ, quản lý chân nguyên, hiểu đối thủ và chuẩn bị từ trước. Họ không cần phản xạ trong nửa giây để thực hiện một quyết định đúng. Battle phải có những khoảnh khắc đáng nhớ: đỡ một đòn tưởng chết, ép địch tiêu hết chân nguyên, mở đường thoát trước cường giả, hoặc tung sát chiêu đúng lúc.

Ba trụ cột phát triển cùng nhau:

1. **Quyết định có giá trị:** thường có 2–3 phương án khả thi với cái giá khác nhau.
2. **Đòn có bản sắc:** nhìn hình, nghe âm, thấy tác động là phân biệt được cổ vừa dùng.
3. **Trận có câu chuyện:** mở đầu, thay đổi thế trận, cao trào, kết quả; không chỉ HP nhiều hơn và một nền khác.

Giữ khung hiện tại và vị trí điều khiển quen thuộc. Không thêm bản đồ ô vuông, rút bài, tốc độ hành động hoặc nhiều thanh tài nguyên cùng lúc. Độ sâu trước hết đến từ các cổ, trạng thái và ý đồ đã có.

## 2. Hiện trạng đọc từ code

Đây là khảo sát code, không phải số đo playtest mới.

| Đã có | Bằng chứng | Điều cần phát triển |
|---|---|---|
| Theo lượt: người chơi hành động rồi địch đáp trả | `playerAct()` trong `js/engine.js` | Làm rõ một vòng, thứ tự effect và hậu quả trước khi chọn |
| Ý đồ tấn công, đòn mạnh, thế thủ, kỹ năng | `nextIntent()`, `intentText()` | Hiện chủ yếu chọn theo trọng số; cần tính cách/pattern đối thủ và tín hiệu ổn định |
| Hộ thể, choáng, độc, chảy máu, băng phong, uy áp | `enemyHit()`, `enemySkill()`, `guReady()` | Định nghĩa thời hạn dễ hiểu; phản hồi khắc chế rõ |
| Giáp, nhanh nhẹn, cả bầy, hàn khí, tái tụ | `FOE_TR` trong `js/auto.js` | Biến thành bài toán có nhiều cách giải và tutorial nhỏ |
| Sát chiêu và lực đạo | `COMBOS`, `lucStrike()` | Tạo nhịp chuẩn bị → dồn sát thương; tránh chỉ chọn đòn có damage/cost cao nhất |
| Theo lượt cuồng nộ từ mốc cấu hình 8 | `DIFF.furyTurn`, `fury()` | Có thể ép người mới quá sớm; cần thiết kế riêng theo encounter và báo trước |
| Boss đổi pha dưới nửa HP, xóa choáng và tăng lực | Trong `playerAct()` trước lượt địch | Có nguy cơ phủ nhận tính toán vừa chọn; cần hợp đồng báo pha rõ ràng |
| Realtime mặc định khi chưa bật `opt.turn` | `rtOn()` | Ưu tiên theo lượt cho người mới |
| RT: đòn thường vận 1,1s; đỡ chuẩn 0,45s; GCD 0,95s | `RT` trong `js/rt.js` | Áp lực phản xạ trong khi người mới còn đọc tên/chi phí cổ |
| RT tăng HP địch ×2,2 và có hệ số đánh ×1,8 | `RT.hpMul`, `RT.atkMul` | Đổi chế độ không chỉ là đổi tốc độ; không thể chuyển trận đang đánh bằng một boolean |
| RT có ba tầm, địa hình, mục tiêu riêng, đồng minh và cổ bị thương | `RT_OBJ`, `RT_TERRAIN`, `RT_ALLY`, `guWear()` | Chuyển những ý tưởng tốt sang theo lượt, có chọn lọc |
| Đấu trường PixiJS, hiệu ứng và âm đã có | `battle.js`, `living.js`, `sound.js` | Nâng dàn dựng trên nền hiện hữu, không bắt đầu bằng thay renderer |

## 3. Một lượt mới nên diễn ra thế nào?

### A. Quan sát — không có đồng hồ thúc ép

Màn trận hiển thị: mục tiêu, ý đồ địch sắp thực hiện, trạng thái đáng chú ý và hành động đang dùng được. Đọc tooltip, kho cổ, nhật ký hoặc đứng yên không làm HP, cooldown hay mục tiêu chạy tiếp.

### B. Chọn — một hành động chính

Mỗi vòng mặc định chọn **một** hành động chính. Cổ thụ động vẫn hoạt động như luật hiện có. Không thêm 3 AP hay chuỗi click dài ngay từ đầu.

- Đánh tay: không tiêu chân nguyên, sát thương thấp hơn; vẫn có vai trò khi tiết kiệm hoặc kết liễu.
- Thúc cổ/sát chiêu: tiêu tài nguyên, chịu hồi chiêu, tạo hoặc tận dụng thế trận.
- Hộ thể: đầu tư chân nguyên để chịu đòn và giữ nhịp; loại cổ quyết định chống được gì.
- **Thủ thế cơ bản — đề xuất mới:** tiêu một hành động, không tốn chân nguyên; giảm một phần đòn trực tiếp kế tiếp, không phản kích/giải độc/chống mọi kỹ năng. Mục đích là cho người chưa có cổ thủ một lựa chọn sinh tồn, không vượt hiệu quả cổ chuyên dụng. Thử khoảng giảm 25–35%, chốt sau cân bằng.
- Linh dược/hấp thu: vẫn tiêu một hành động; phải chọn đúng lúc địch thủ hoặc hồi chiêu.
- Rút lui: xác suất hoặc tiến độ tùy encounter; luôn giải thích thất bại sẽ bị gì, không hứa thoát chắc khi chưa đủ điều kiện.

Mặc định vẫn chọn trực tiếp bằng nút để nhịp chơi gọn. Có tùy chọn “chọn rồi xác nhận” cho người mới/mobile; không bắt mọi người xác nhận hai lần mỗi lượt. Xem thông tin không tiêu lượt.

### C. Thi triển — một chuỗi đọc được

Logic giải quyết đúng một lần, sinh danh sách sự kiện trình bày theo thứ tự: hành động của ta → phản ứng hợp lệ → hành động của địch → trạng thái cuối vòng. Effect không tự trừ HP, áp choáng hay phát thưởng.

Khóa nhập lệnh mới trong lúc đang giải quyết vòng; cho rút gọn animation. Không phát hai lượt do double-click, giữ phím hoặc reload. Chỉ chọn ý đồ tiếp theo sau khi xử lý xong state của vòng hiện tại.

### D. Hệ quả — biết vì sao thắng hoặc mất máu

Một dòng ngắn ngay tại trận, ví dụ: **“Ngọc Bì chặn một nửa đòn nặng · mất 8 chân nguyên · nhận 14 sát thương.”** Số là dữ liệu kết quả thật, không hard-code theo đoạn văn mẫu. Log đầy đủ vẫn nằm ở panel hiện tại.

### E. Chân nguyên là energy tuần hoàn theo vòng

Đây nên là nhịp tài nguyên chính của chế độ theo lượt: người chơi không chỉ hỏi “đòn nào mạnh nhất”, mà phải chọn lúc **tích — giữ — bùng nổ**. Dùng thẳng chân nguyên hiện có, không tạo thêm một loại energy tách rời khiến giao diện và nguyên tác rối hơn.

**Luật đề xuất cho bản thử đầu:**

1. Khi vào trận, ghi `essCycleCap` bằng lượng chân nguyên người chơi đang có. Đây là lượng có thể tuần hoàn trong trận, không tự lấy `maxEss()` làm trần.
2. Lượt đầu không cộng thêm. Từ đầu mỗi lượt chọn lệnh tiếp theo, bản preview hồi cố định **1 chân nguyên** ở mọi cảnh giới, tối đa `essCycleCap`. Mốc 4/6/8/10 ban đầu đã bị loại sau simulation vì làm tỷ lệ thắng chiến dịch tăng quá mạnh trước khi có pattern BATTLE-03.
3. Đánh tay và thủ thế cơ bản tốn 0. Cổ thường hiện có giá 6–20; sát chiêu khoảng 12–30. Hồi +1 hiện đóng vai trò hoàn vốn chậm và giúp tránh tài nguyên hoàn toàn đứng yên; cần playtest người thật trước khi tăng.
4. Chân nguyên chưa dùng được giữ sang vòng sau. Không có cơ chế “hết vòng thì mất”, vì mục tiêu là cho người chơi chuẩn bị một lượt bùng nổ.
5. Bị choáng vẫn hồi vì một vòng thời gian đã trôi qua; hiệu ứng phong tỏa không khiếu có thể giảm hoặc chặn hồi nếu mô tả kỹ năng nói rõ và UI báo trước.
6. Hấp thu 5 nguyên thạch vẫn tiêu một hành động, tăng cả chân nguyên hiện tại lẫn `essCycleCap` thêm 20, không vượt `maxEss()`. Như vậy nguyên thạch còn giá trị như cách mở rộng nguồn lực khẩn cấp trong trận.
7. Kết thúc trận giữ lượng chân nguyên thực tế. Không thưởng thêm chỉ vì thắng và không cho vượt trần lúc vào trận nếu chưa dùng nguyên thạch.

Ví dụ: vào trận với **32/50**, `essCycleCap = 32`. Dùng Nguyệt Quang Cổ tốn 6 còn 26; đầu lượt sau hồi 1 thành 27. Người chơi có thể đánh tay để hồi chậm về 32 rồi mới ghép sát chiêu, nhưng không thể kéo dài trận yếu để hồi từ 32 lên 50 miễn phí. Nếu hấp thu nguyên thạch, trần tuần hoàn mới có thể tăng lên 50.

Nhịp này cần áp lực từ pattern và mục tiêu trận: địch dồn lực, cuồng nộ có báo trước, đồng minh cần bảo vệ hoặc cửa thoát sắp đóng. Người chơi được phép tiết kiệm chân nguyên, nhưng phải trả bằng HP, vị thế hoặc tiến độ; không dùng bộ đếm thời gian thực để ép bấm nhanh.

**UI/effect:** thanh chân nguyên hiển thị đồng thời `hiện tại / trần tuần hoàn`; đầu vòng chạy một luồng sáng ngắn từ không khiếu vào thanh và hiện `+1`, không khóa thao tác lâu. Kỹ năng đang thiếu tài nguyên ghi số vòng phải chờ hoặc yêu cầu hấp thu nguyên thạch nếu đã chạm trần tuần hoàn.

**Không đưa vào bản đầu:** hồi theo phần trăm, random lượng hồi, energy riêng, nút điều tức cộng dồn thêm, hoặc nhiều cổ cùng sửa tốc độ hồi. Các biến số đó chỉ nên mở sau khi vòng cơ bản đã dễ đọc và có dữ liệu cân bằng.

## 4. Ý đồ địch trở thành trung tâm chiến thuật

- Hiện **hành động sắp xảy ra**, mục tiêu và đặc tính: đòn nặng, xuyên hộ thể, gây độc, hồi máu, thủ phản kích.
- Khi chọn cổ, hiển thị khoảng tác động dự kiến cùng nguyên nhân: giáp, đói, khắc chế bầy, hộ thể, né đòn. Không dùng số sát thương cơ bản để giả làm damage cuối.
- Forecast là hàm chỉ đọc, không dùng RNG hoặc sửa state. Tách kết quả chắc chắn, khoảng ngẫu nhiên và xác suất trượt.
- Không hiện toàn bộ kế hoạch nhiều lượt của đối thủ chưa hiểu. Ký ức/trinh sát có thể mở pattern hoặc điểm yếu đã biết.
- Khi đòn đặc biệt xuyên thủ, cảnh báo rõ: “Hộ thể này không chặn được”; không gợi ý người mới dùng đúng nút nhưng sai tương tác.

**Pattern thay random thuần:** mỗi đối thủ có một nhịp có thể học, xen biến thể có điều kiện. Ví dụ địch dồn lực → đòn mạnh → hồi thế; thấy hồi thế là cơ hội hồi phục hoặc phản công. Biến thể vẫn cần tín hiệu, không đổi âm thầm sau khi người chơi xác nhận.

Boss vượt ngưỡng HP: báo pha mới sau vòng hiện tại, áp nhịp mới từ vòng sau. Nếu một boss có phản ứng lập tức, phải ghi đặc tính đó trước khi người chơi ra đòn; không dùng việc xóa choáng giữa vòng làm bất ngờ vô điều kiện.

## 5. “Tạo thế — phá thế” là hệ chiến thuật mới trọng tâm

Đề xuất bổ sung **thế phòng bị/sơ hở** theo encounter, kế thừa ý tưởng `poise/stag` của RT nhưng tính bằng hành động.

- Trận thường lúc đầu dùng trạng thái đơn giản: **bình thường / đang dồn lực / lộ sơ hở**. Chưa cần thêm một thanh mới.
- Boss có thể dùng 2–3 nấc thế phòng bị. Mỗi boss nêu rõ điều kiện mất một nấc sau khi đã khám phá; không bắt mọi đòn đều trừ cùng một “thanh break”.
- Sơ hở đến từ hành động hợp lý: khắc chế, ngắt chiêu bằng cổ có khả năng, phá mục tiêu phụ, hoặc địch tự lộ sau đòn nặng.
- **Đỡ đúng lượt** thay **bấm đúng 0,45 giây**. Hộ thể hiệu quả có thể giữ lợi thế trước một đòn cụ thể, nhưng không phải cứ thủ là nhận thưởng phá thế.
- Sơ hở tồn tại trong một cửa sổ hành động rõ ràng, tạo cơ hội dùng sát chiêu hoặc rút lui. Không mặc định cho người chơi thêm một lượt miễn phí.
- Boss có thời gian chống phá thế liên tiếp; giới hạn giữ choáng, nhưng dùng lại khống chế vẫn phải có tác dụng hợp lý được mô tả, không âm thầm miễn nhiễm.
- Không gán “ngắt vận chiêu” cho cổ chỉ tăng sát thương trong nguồn chuẩn. Mỗi tương tác mới ghi rõ là chuyển thể và kiểm tra công dụng cổ trước khi duyệt.

**Mục tiêu:** có lúc nên dùng một cổ ít sát thương để mở cơ hội cho lượt sau. Nếu đòn gây damage lớn nhất vẫn luôn tối ưu, hệ chưa đạt yêu cầu.

## 6. Bộ cổ phải tạo ra cách chơi khác nhau

Không thêm class cứng. Bộ cổ đang sở hữu và cách phối hợp tạo phong cách:

| Cách chơi | Quyết định nổi bật | Điểm phải đánh đổi |
|---|---|---|
| Nguyệt đạo | Tiết kiệm chân nguyên bằng đòn ổn định, giữ sát chiêu khi địch hở | Có thể bị giáp/đặc tính khắc chế |
| Hộ thể và phản kích | Đọc đòn lớn, dùng đúng loại phòng ngự | Tiêu chân nguyên và mất nhịp công |
| Huyết đạo | Chảy máu, ngăn hồi phục, hút sinh lực theo cổ thật | Cần thiết lập; không hồi vô hạn qua mục tiêu đã chết |
| Băng/khống chế | Giảm lực hoặc khóa nhịp nguy hiểm | Hồi chiêu, khả năng chống khống chế của boss |
| Lực đạo Q2 | Tích lũy cơ hội, thú ảnh, đánh mạnh trong cửa sổ thuận lợi | Chấp nhận áp lực/chi phí chuẩn bị tùy bộ cổ |
| Ẩn thân và thoát hiểm | Chuẩn bị trước trận, bỏ qua hoặc mở đường lui khi hợp lệ | Không phải encounter nào cũng cho trốn |

Chỉ hiện kỹ năng từ cổ thật và sát chiêu đã ngộ; không cấp bộ mẫu chỉ để tutorial đẹp. Sắp xếp thanh kỹ năng theo công/thủ/hỗ trợ; có thể ghim nút thường dùng nhưng chưa đặt giới hạn ô trang bị mới.

## 7. Trận đáng nhớ có điều kiện thắng riêng

Hiện `RT_OBJ` được khởi tạo trong RT. Đưa định nghĩa encounter/mục tiêu ra dữ liệu dùng chung rồi viết resolver theo lượt; không đơn giản chia số giây cho `secPerTurn`.

| Loại trận | Mục tiêu theo lượt đề xuất | Điều người chơi cần tính |
|---|---|---|
| Dã thú thường | Hạ hoặc rút lui | Giá trị chiến lợi phẩm so với HP/chân nguyên đã mất |
| Cầm chân Lang Vương | Giữ tuyến một số vòng được cân riêng, hoặc điều kiện thay thế hợp lệ | Hộ thể, cắt nhịp, tài nguyên dài hạn |
| Đối đầu Bạch Ngưng Băng | Trụ được hoặc tạo sơ hở theo encounter hiện có | Đọc khả năng, không cần hạ cường giả bằng HP |
| Thoát trước Thần bổ | Hoàn thành các bước mở đường thoát | Chọn cơ hội, dùng chuẩn bị/ẩn thân, chịu cái giá |
| Huyết Cương/Nhất Đại | Phá mục tiêu phụ hoặc sống tới biến cố theo nhánh | Ưu tiên mục tiêu, gián đoạn nguồn lực |
| Cổ sư có nguồn chân nguyên | Hạ hoặc ép cạn nguồn lực khi encounter cho phép | Bào mòn và thời điểm phòng thủ |
| Trận có đồng minh | Đồng minh can thiệp theo mốc hoặc chu kỳ hữu hạn | Chuẩn bị cho nhịp hỗ trợ; không tự nhiên hồi sinh người đã chết |

Số vòng, tiến độ và sức mạnh phải được cân theo mục tiêu, không giữ nguyên HP/ATK RT. Các đường kết thúc phải đi qua kết quả **hạ gục / cầm chân / thoát / được tha / thất bại**, bảo toàn `sceneWin`, `sceneFlee`, `after` và phần thưởng đúng kiểu. Không gọi `win()` có thưởng hạ gục cho mọi lần sống sót nếu thiết kế không cho phép.

Mục tiêu tiêu hao chân nguyên địch cần thêm resource model cho theo lượt; hiện chưa có sẵn tương đương `r.fess`. Đưa vào PR riêng, không giả bằng một thanh trang trí.

## 8. Một trận mẫu để cảm nhận hướng mới

**Trận dã thú hiện hữu ở Q1**, dùng save có bộ cổ hợp lệ; không viết thêm sự kiện canon chỉ để trình diễn. Pattern dưới đây là ví dụ chuyển thể, chưa phải dữ liệu đã cân.

1. **Vào trận:** mục tiêu và đặc tính hiện gọn. Game đứng chờ; người chơi biết địch sắp đánh thường.
2. **Lượt đầu:** có thể công kích để giảm HP hoặc giữ chân nguyên bằng đánh tay. Chọn xong thấy nhân vật thi triển, đường đòn trúng mục tiêu và HP phản ứng.
3. **Địch dồn lực:** lựa chọn dùng cổ thủ, thủ thế cơ bản hoặc mạo hiểm kết liễu. UI cho thấy hậu quả dự kiến khác nhau.
4. **Sau đòn nặng:** đối thủ lộ sơ hở theo pattern đã báo. Người chơi quyết định dồn cổ công hay tận dụng hồi phục; không bị ép phải bấm trong vài giây.
5. **Kết trận:** đòn cuối có nhịp dừng ngắn, âm kết thúc, kết quả gọn. Hiện chi phí trận và một nhận xét dựa trên sự kiện thật: “Đã chặn đòn nặng”, không chấm điểm người chơi bằng tiêu chí bí mật.

Sau khi trận nhỏ đạt cảm giác tốt, làm **một encounter cầm chân** để chứng minh thiết kế còn hay khi không đua damage. Đây là hai bản chơi thật cần có trước khi phủ toàn Q1–Q2.

## 9. VFX và âm thanh: mỗi đòn có ba nhịp

**Khởi chiêu → va chạm → dư âm.** Không chỉ lóe màn hình rồi trừ số.

| Nhóm | Hình và chuyển động | Âm/va chạm | Thông tin phải đọc được |
|---|---|---|---|
| Đánh tay/lực đạo | Lấy thế, thân lao ngắn, bụi; thú ảnh khi điều kiện cổ cho phép | Va chạm trầm, địch lùi nhẹ | Có trúng không, lực tăng do đâu |
| Nguyệt nhận | Ánh cổ khởi lên, lưỡi cong đi đúng hướng, vết cắt tan nhanh | Gió sắc → tiếng cắt | Nguồn, đích, xuyên/giáp |
| Hộ thể | Lớp ngọc/kim loại/khí bám quanh người, phản ứng ngay tại điểm trúng | Vang ngọc hoặc tiếng kim loại phù hợp | Chặn được bao nhiêu, còn hiệu lực không |
| Băng | Hàn khí, rạn băng hoặc đóng băng trên mục tiêu hợp lệ | Tiếng nứt ngắn | Giảm lực, choáng và băng phong cổ là các trạng thái khác nhau |
| Huyết | Vệt huyết, dòng hồi về nếu có hút máu, dấu chảy máu tại mục tiêu | Xung trầm, âm hút ngắn | Damage, hồi phục và DOT không nhập làm một |
| Sát chiêu | Ghép dấu hiệu của các cổ thành một chuỗi riêng | Khoảng nhấn rồi âm chủ đạo | Vì sao mạnh ở lượt này, không chỉ thêm hạt |
| Sơ hở/ngắt chiêu | Dấu phòng bị vỡ; animation vận chiêu bị cắt | Âm ngắt và khoảng lặng | Kỹ năng địch nào bị hủy, cửa sổ còn bao lâu |

Ngân sách thử: đòn thường khoảng 0,45–0,8s; cổ nổi bật 0,8–1,2s; sát chiêu 1,2–1,8s; nhấn kết liễu thêm 0,3–0,6s. Đây là mục tiêu dàn dựng, không là thời gian người chơi phải phản ứng. Có tốc độ phát nhanh và reduced motion; không chờ animation dài sau mỗi con quái yếu.

- Dừng hình va chạm thử 40–70ms, chỉ ở lớp hình ảnh theo lượt; không dùng để ngầm thay luật RT.
- Camera rung/zoom nhẹ trong đấu trường, HUD và nút không rung theo. Lần đầu xem có lực; xem hàng trăm lần không mệt.
- Bóng chân, vị trí đứng, hướng đánh và chiều sâu nền thống nhất. Không kéo giãn ảnh vuông thành nhân vật toàn thân; ảnh thay cần kiểm tra rig `living.js`.
- Không bắt buộc mua/tạo nhiều sprite trước. Một đòn tay, một nguyệt nhận, một hộ thể và một sát chiêu được làm tốt là bộ kiểm chứng đầu tiên.
- Âm báo ý đồ, chọn kỹ năng, chặn, trúng, sơ hở và kết thúc có chức năng khác nhau; điều chỉnh âm lượng riêng. Tắt âm vẫn hiểu đầy đủ.

## 10. UI battle trong khung game đang có

Giữ arena giữa, thanh kỹ năng bên dưới và hai panel hiện tại. Nâng đúng các vùng sau:

```text
[Mục tiêu trận]                      [Vòng 3 · Chờ ngươi quyết định]
[Ý đồ địch: Đòn nặng · có thể hộ thể · mức nguy hiểm]

        Phương Nguyên          Địch / mục tiêu phụ
        HP · chân nguyên       HP · trạng thái · sơ hở

[Kết quả vòng vừa rồi: đã chặn… / chịu… / tiêu hao…]
[Công kích] [Hộ thể] [Hỗ trợ]          [Linh dược] [Rút lui]
[Kỹ năng thật: hiệu quả dự kiến · chi phí · hồi chiêu]
```

- Hover desktop hoặc mở chi tiết trên touch để xem forecast; không để thao tác xem bị hiểu là thi triển.
- Chữ “Hồi chiêu 2 lượt” thống nhất với luật thực tế, nêu thời điểm dùng lại. Hộ thể đang được `enemyHit()` giảm theo đòn trúng, nên phải phân biệt **số đòn** với **số vòng**, không đổi nhãn thành “lượt” khi logic khác.
- Kỹ năng khóa giải thích do chân nguyên/đói/băng phong/hồi chiêu. Lý do vẫn đủ tương phản.
- Quan sát lịch sử, mở menu hoặc chuyển tab không làm battle theo lượt tiến lên; auto chỉ chạy khi được người chơi bật.

## 11. Trải nghiệm người mới và cân bằng

- Người chơi mới mặc định theo lượt. Lần đầu có mô tả một câu “Chọn một hành động, rồi đối thủ đáp trả”; không bắt đọc một hướng dẫn dài.
- Trận đầu chỉ dạy ý đồ và công kích. Trận sau dạy hộ thể, rồi mới tài nguyên/khắc chế. Đưa gợi ý khi tình huống xảy ra; cho tắt và xem lại.
- Không bắt có cổ hiếm để vượt bài học cơ bản. Dùng thủ thế, đánh tay và vật phẩm hợp lệ làm phương án dự phòng.
- Tutorial dựa vào encounter/save thật phù hợp; nếu cần sân tập thì ghi rõ là mô phỏng riêng, không tiêu tài nguyên và không phát thưởng. Không bí mật thay kết quả trận truyện.
- Theo lượt không có timeout vì đọc chậm. Cuồng nộ chỉ theo vòng đã hành động, có báo trước và lý do encounter; thử bỏ áp lực cuồng nộ ở trận dạy chơi, cân riêng boss thay mốc 8 toàn cục.
- Mục tiêu thử ban đầu: trận thường 3–6 vòng, tinh anh 5–9, boss 8–14; điều chỉnh theo bộ cổ, mục tiêu trận và playtest. Không ép boss dài bằng HP khổng lồ.
- Kiểm tra chiến thuật công liên tục, thủ/hồi vô hạn, spam choáng, câu giờ tới trần tuần hoàn và sát chiêu áp đảo. Ghi riêng số vòng chờ chân nguyên, lượng hồi bị tràn và tỷ lệ dùng đòn 0 chi phí. Tăng độ khó bằng ý đồ/tương tác trước khi tăng chỉ số.
- Tự đánh dùng cùng luật/forecast và biết mục tiêu trận; dừng khi có pha mới hoặc nguy hiểm đã định nghĩa. Không lấy bot thắng làm bằng chứng người mới hiểu game.

## 12. Realtime sẽ ở đâu?

Giữ như tùy chọn nâng cao; ưu tiên nguồn lực cho theo lượt trước. Không bắt người dùng học RT để tiếp cận content hoặc kết cục riêng.

Nếu tiếp tục nâng RT sau này: vào trận ở trạng thái tạm dừng, chế độ chậm rõ, tự dừng khi mở bảng/đổi pha/có đòn nguy hiểm, cho chọn lệnh khi pause. Giảm phản xạ bắt buộc trước khi tăng tính năng.

Rà pause theo toàn bộ timer: `rtTick()` đang kiểm tra `paused`, trong khi loop còn gọi `rtSuppressTick()` riêng; không được chỉ dừng HP mà uy áp/cooldown hoặc auto vẫn chạy. `rtRun()` chủ động bỏ pause khi bot chạy cũng phải tuân quyền điều khiển của người chơi.

Đổi default chỉ áp dụng save mới/chưa chọn rõ. Giữ preference đã lưu; save cũ thiếu preference được hỏi lựa chọn ở lần vào trận thích hợp. Trận đang có `c.rt` tiếp tục đúng mode hoặc cho đổi từ trận sau, không xóa `c.rt` khiến HP ×2,2 và mục tiêu bị sai.

## 13. Kiến trúc để nâng sâu mà không phá game

1. **Encounter dùng chung:** mục tiêu, pattern, pha, đồng minh, điều kiện kết thúc và mapping scene. Mode không quyết định nguyên tác nào được chơi.
2. **Resolver theo lượt:** validate action → resolve một vòng → trả state và combat events. UI preview và auto đọc cùng công thức; không gọi hàm có RNG để xem trước.
3. **Trình bày:** `battle.js`/Arena nhận events theo thứ tự, không áp logic. Có thể phát nhanh, skip hoặc giảm VFX.
4. **Lưu trữ:** combat có version/phase/round/action ID và kết quả đã commit. Commit logic một lần trước khi phát hình; reload tiếp từ state đã giải quyết, không phát thưởng hoặc resolve lại. Animation có thể bỏ qua khi load.
5. **Migration:** phân biệt save theo lượt cũ, RT cũ, combat mới; không tự nhân/chia lại HP. Feature flag cho các encounter mới trong giai đoạn thử.

Thống nhất một hợp đồng thời gian: vòng = một hành động chính hợp lệ và phản ứng của encounter; choáng bỏ qua hành động nào; cooldown giảm lúc nào; shield đếm đòn hay vòng; DOT tick trước/sau ai. Viết bảng đó trước khi chỉnh cân bằng để không phát sinh lệch một lượt.

Những điểm audit trước khi quảng bá forecast: sát thương cổ đói, né, giáp, xuyên giáp, phản kích, buff/phase, heal cap và xác suất trốn. Chẳng hạn UI trốn hiện không cộng đầy đủ các bonus mà resolver dùng; phải gom về một hàm tính chung.

## 14. Chia PR và làm mẫu battle thật trước

| PR | Nội dung | Nghiệm thu |
|---|---|---|
| **BATTLE-01 — Đã có lát cắt** | Trận Q1 thật đứng chờ; ý đồ và kết quả vòng; giữ arena/effect hiện có | Smoke test desktop/mobile; input khóa trong phase giải quyết; reload tiếp tục đúng vòng |
| **BATTLE-02 — Đã có phần lõi** | Hồi +1 và trần tuần hoàn; hấp thu; thủ thế; forecast damage địch dùng công thức chung; lý do thiếu tài nguyên; default/migration | Logic đã qua smoke; 300 chiến dịch seed `20261001`: Đấu trí thắng 35,0%, đúng trần cân bằng. Tutorial và forecast sát thương của mọi cổ vẫn còn |
| BATTLE-03 — Pattern, pha, sơ hở | Một nhóm địch thường và một boss có nhịp; báo pha; tạo/phá thế có điều kiện | Công liên tục không luôn tối ưu; không spam khóa boss; không thay ý đồ sau xác nhận |
| BATTLE-04 — Mục tiêu và kết quả trận | Encounter dùng chung; cầm chân/thoát/phá mục tiêu; đồng minh; sau đó nguồn lực địch | Hoàn thành bằng nhiều cách hợp lệ; scene/flag/thưởng đúng; Q1/Q2 không mất nhánh |
| BATTLE-05 — Bộ cổ và sát chiêu | Phong cách chiến đấu, tương tác cổ, VFX/audio riêng, thuật toán auto theo objective | Có nhiều bộ khả thi; không gán cổ tác dụng trái nguồn; auto không bỏ qua luật |
| BATTLE-06 — Phủ nội dung và cân bằng | Q1/Q2, hướng dẫn, boss cao trào, save cũ, tốc độ phát, hiệu năng | Playtest và thống kê có seed; không khóa tiến trình; tùy chọn RT hoạt động độc lập |

**BATTLE-01 là mẫu cần làm đầu tiên**, không gom toàn bộ hệ mới vào PR mở màn. Nó phải trả lời: cùng một bộ cổ và cùng một trận, người chơi có thấy rõ ràng, chủ động và đã tay hơn không? Sau đó BATTLE-03/04 chứng minh chiều sâu bằng một boss cầm chân thật.

## 15. Cổng kiểm tra chất lượng

- Regression: hành động không hợp lệ không tốn lượt; double-click một lần resolve; chân nguyên chỉ hồi đúng một lần ở đầu vòng và không vượt `essCycleCap`; hấp thu tăng đúng hai giá trị; DOT/choáng/hộ thể/cooldown đúng thời hạn; đổi pha; thắng/thua đồng thời theo quy tắc công khai; flee/spare/scene callbacks đúng một lần.
- Cùng state và seed, đổi tốc độ/skip VFX/âm thanh/reduced motion cho cùng kết quả. Render và forecast không tiêu RNG. Save/load trước và sau action không reroll để lấy lợi.
- UI thật: bàn phím/touch, tooltip/overlay, load giữa animation, tab ẩn, thiếu Pixi/asset; giữ nút và focus ổn định.
- Cân bằng theo nhóm bộ cổ nghèo/giàu và cảnh giới; ghi số vòng, tài nguyên mất, nguyên nhân chết, lựa chọn lặp, tỷ lệ tận dụng khắc chế. Không so hai mode bằng tỷ lệ thắng thô khi objective khác nhau.
- Playtest người mới: họ có nói được địch sắp làm gì, vì sao chọn cổ đó và bước ngoặt của trận không? Đồng thời hỏi người đã chơi xem có lựa chọn chiến thuật thực sự hay chỉ thêm thời gian chờ animation.
- Mục tiêu hiệu năng được đo trên cấu hình cụ thể; không cần tăng số hạt nếu nó làm tín hiệu đòn khó đọc. Trận đầu dễ hiểu và trận boss đáng nhớ đều là điều kiện nghiệm thu.

**Đích đến:** giữ sự thuận tay của khung hiện tại, đưa suy tính và bộ cổ thành trung tâm, rồi làm mỗi quyết định hiện lên thành một diễn biến chiến đấu có sức nặng.
