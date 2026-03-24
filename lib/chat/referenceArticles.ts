// ============================================================
// REFERENCE ARTICLES FOR AI CHATBOT CONTEXT
// Full article content stored here to reduce system prompt size
// Model loads from this file on-demand
// ============================================================

export interface ReferenceArticle {
  id: number;
  title: string;
  type: 'Tin' | 'Phóng sự' | 'Phỏng vấn hỏi đáp' | 'Phóng sự nhân vật' | 'Story' | 'Lens';
  author: string;
  sapo: string;
  category: string;
  content: string;
}

export const REFERENCE_ARTICLES: ReferenceArticle[] = [
  {
    id: 1,
    title: "WHO chỉ ra 4 'trụ cột' bảo vệ Việt Nam trước mối đe dọa dịch bệnh mới",
    type: "Phỏng vấn hỏi đáp",
    author: "Lê Huyên",
    sapo: "Trước ngưỡng chuyển mình từ năm 2026, ngành y tế Việt Nam đứng trước cơ hội cải cách toàn diện nhưng cũng đối mặt nhiều thách thức về nhân lực, chất lượng và công bằng dịch vụ.",
    category: "Sức khỏe",
    content: `Bước sang năm 2026, y tế Việt Nam đứng trước vận hội mới sau hàng loạt chính sách quan trọng. Trao đổi với phóng viên, TS Angela Pratt, Trưởng Đại diện Tổ chức Y tế Thế giới (WHO) tại Việt Nam, đã chia sẻ những góc nhìn sâu sắc về lộ trình củng cố hệ thống y tế và những ưu tiên chiến lược để bảo vệ sức khỏe người dân trong giai đoạn tới.

**Bước ngoặt chăm sóc sức khỏe từ năm 2026**

**- Khám sức khỏe định kỳ toàn dân từ năm 2026 được kỳ vọng tạo bước ngoặt. Theo bà, ý nghĩa của định hướng này là gì?**

- Khám định kỳ giúp đánh giá sức khỏe tổng thể và phát hiện sớm các yếu tố nguy cơ và bệnh lý tiềm ẩn. Nếu phát hiện nguy cơ của một bệnh nào đó, ví dụ lao hay tăng huyết áp, bác sĩ có thể chỉ định khám sàng lọc để xem bệnh nhân có mắc hay không. Việc này giúp phát hiện bệnh và can thiệp sớm, giảm chi phí điều trị sau này, ngăn chặn tử vong và biến chứng.

Đây là dịch vụ thiết yếu trong mô hình y tế hiện đại. Khi được triển khai rộng khắp, khám định kỳ sẽ giúp chuyển trọng tâm từ điều trị sang phòng bệnh, đúng với tinh thần của Nghị quyết 72.

**- Để chương trình đạt hiệu quả, Việt Nam cần lưu ý điều gì?**

- Trước hết, cần xây dựng gói dịch vụ dựa trên hiệu quả chi phí và tính công bằng, theo từng nhóm tuổi. Thứ hai, trạm y tế xã nên là đơn vị cung cấp dịch vụ chính để bảo đảm thuận tiện và tiết kiệm cho cả ngân sách công và cho người dân. Ngoài ra, dữ liệu từ khám định kỳ phải được tích hợp vào hệ thống thông tin y tế để phục vụ quản lý sức khỏe lâu dài.

**Ứng phó các rủi ro sức khỏe mới**

**- Nghị quyết 72 và các đạo luật mới được xem là bước ngoặt của ngành y tế. Theo bà, hệ thống pháp lý này có ý nghĩa thế nào với việc phát triển dài hạn?**

- WHO nhiệt liệt chúc mừng Đảng và Chính phủ Việt Nam về việc ban hành Nghị quyết 72, một văn bản mang tính chiến lược, đặt y tế vào vị trí trung tâm trong chương trình cải cách quốc gia.

Một khuôn khổ pháp lý vững chắc là nền tảng để xây dựng hệ thống y tế hiệu quả. Khi được triển khai đồng bộ với Luật Phòng bệnh, Luật Dân số và các Chương trình Mục tiêu Quốc gia, Nghị quyết 72 sẽ tạo điều kiện để Việt Nam đạt những bước tiến quan trọng về sức khỏe cộng đồng.

Tuy nhiên, để bảo đảm tính bền vững lâu dài, cần song song đầu tư vào các nền tảng cốt lõi của hệ thống y tế, gồm mạng lưới trạm y tế xã được trang bị đầy đủ, đội ngũ nhân lực phù hợp và hệ thống bệnh viện được quản trị tốt.

Cùng với đó là cơ chế tài chính y tế hiệu quả nhằm tối ưu nguồn lực công, đội ngũ nhân viên y tế có trình độ, hệ thống đấu thầu minh bạch để cung ứng thuốc và vật tư chất lượng với giá hợp lý, cũng như hệ thống thông tin y tế tích hợp, nền tảng số và hồ sơ sức khỏe điện tử.

Những yếu tố này sẽ giúp hệ thống y tế đáp ứng tốt nhu cầu hiện tại và chủ động trước các thách thức trong tương lai.

**- Theo bà, đâu là yếu tố then chốt để nâng cao vai trò của tuyến y tế cơ sở?**

- Trạm y tế xã phải thực sự trở thành "cửa ngõ" chăm sóc sức khỏe ban đầu. Điều đó đòi hỏi đội ngũ nhân lực có chuyên môn tốt, cơ sở vật chất đầy đủ và cơ chế tài chính minh bạch.

Song song, Việt Nam cần xây dựng hệ thống thông tin y tế tích hợp, hồ sơ sức khỏe điện tử và quy trình đấu thầu minh bạch. Khi những nền tảng này được hoàn thiện, y tế cơ sở sẽ phát huy vai trò trung tâm trong phòng bệnh và quản lý sức khỏe cộng đồng.

**- Việt Nam đã cấm thuốc lá điện tử và thuốc lá nung nóng từ năm 2025. WHO đánh giá thế nào về quyết định này?**

- Đây là một quyết định táo bạo và mang tính lịch sử. Bằng chứng khoa học cho thấy thuốc lá điện tử không an toàn, đặc biệt với giới trẻ. Lệnh cấm đã gửi đi thông điệp rõ ràng rằng các sản phẩm này không có chỗ đứng trong chiến lược phát triển bền vững.

Dù việc thực thi vẫn đang được hoàn thiện, các tín hiệu ban đầu cho thấy chính sách này đã phát huy tác dụng. Trung tâm Chống độc Bạch Mai ghi nhận số ca cấp cứu liên quan thuốc lá điện tử và thuốc lá nung nóng giảm rõ rệt, cùng với sự sụt giảm quảng cáo, tăng cường chống buôn lậu và tỷ lệ sử dụng thấp hơn trong học sinh, sinh viên tại các đô thị lớn.

Tuy nhiên, ngành công nghiệp nicotine luôn nhắm vào giới trẻ và biết cách để thích nghi. Vì vậy, Việt Nam cần duy trì thực thi nghiêm ngặt và tăng cường chống buôn lậu, bán hàng trực tuyến trái phép.

**- Ngoài thuốc lá, những nguy cơ sức khỏe nào đang gây áp lực lớn nhất hiện nay?**

- Việt Nam rất dễ bị tổn thương trước các tác động của biến đổi khí hậu lên sức khỏe, có tỷ lệ kháng kháng sinh cao, gánh nặng bệnh không lây nhiễm lớn và dân số đang già hóa nhanh chóng.

Bên cạnh đó, tác động của những thách thức này và các vấn đề sức khỏe khác không được phân bổ đồng đều trong dân số dẫn đến bất bình đẳng trong tiếp cận dịch vụ y tế và kết quả sức khỏe. Tuy nhiên, chuyển đổi số và việc ứng dụng các công nghệ như trí tuệ nhân tạo mang lại những cơ hội lớn để tăng cường khả năng tiếp cận và chất lượng dịch vụ y tế, cũng như giảm bất bình đẳng, với điều kiện các nguy cơ tiềm ẩn được quản lý tốt.

WHO hỗ trợ Chính phủ Việt Nam giải quyết những thách thức này, bao gồm việc tận dụng tiềm năng và cơ hội của AI và công nghệ số.

**- Trước tốc độ già hóa dân số nhanh, WHO đánh giá thế nào về cơ hội và thách thức của Việt Nam trong việc phát triển chăm sóc người cao tuổi và phòng, quản lý bệnh không lây nhiễm từ năm 2026?**

- Từ góc độ hệ thống y tế, giải pháp tối ưu để đáp ứng nhu cầu của dân số già hóa và quản lý bệnh không lây nhiễm là tăng cường chăm sóc sức khỏe ban đầu, đặc biệt tại trạm y tế xã. Khi được trang bị đầy đủ, tuyến cơ sở có thể đáp ứng tới 90% nhu cầu chăm sóc với chi phí hợp lý, thuận tiện hơn so với phụ thuộc vào bệnh viện.

Bên cạnh đó, mô hình chăm sóc tích hợp dựa vào cộng đồng, kết hợp quản lý bệnh mạn tính, chăm sóc lão khoa và phòng ngừa, cùng sự tham gia của gia đình và cộng đồng, phù hợp với tinh thần Nghị quyết 72.

**4 ưu tiên của Việt Nam trong phòng chống dịch bệnh**

**- Trong bối cảnh các bệnh truyền nhiễm mới nổi và tái nổi, WHO khuyến nghị những ưu tiên nào để Việt Nam tiếp tục củng cố hệ thống giám sát dịch bệnh và cảnh báo sớm?**

- Để tiếp tục củng cố hệ thống giám sát dịch bệnh và cảnh báo sớm, WHO khuyến nghị Việt Nam tập trung vào bốn ưu tiên.

Thứ nhất là xây dựng Kế hoạch Hành động Quốc gia về An ninh Y tế 5 năm, gắn với bảo đảm nguồn lực tài chính cho các năng lực cốt lõi.

Thứ hai là thiết lập cơ chế ngân sách linh hoạt để hỗ trợ địa phương ứng phó dịch bệnh.

Thứ ba là tăng cường kết nối, chia sẻ dữ liệu liên ngành nhằm phát hiện sớm rủi ro.

Thứ tư là mở rộng các cơ sở y tế có khả năng chống chịu với biến đổi khí hậu để bảo vệ cộng đồng trước các mối đe dọa sức khỏe mới.

Những yếu tố này sẽ giúp Việt Nam phát hiện sớm, phản ứng nhanh và hạn chế tác động của các tình huống khẩn cấp về y tế.

**- WHO sẽ đồng hành cùng Việt Nam như thế nào trong giai đoạn 2026-2030?**

- Trong giai đoạn 2026-2030, WHO sẽ tiếp tục hỗ trợ tiến trình của Việt Nam hướng tới các Mục tiêu Phát triển Bền vững trong Chương trình nghị sự 2030, tập trung vào việc củng cố chăm sóc sức khỏe ban đầu, tăng cường phòng bệnh và cải thiện sức khỏe môi trường để xây dựng hệ thống y tế công bằng và có khả năng chống chịu tốt hơn.

Chăm sóc sức khỏe ban đầu và thích ứng với dân số già hóa là một ưu tiên lớn, với trọng tâm là tăng cường chăm sóc tích hợp, lấy người dân làm trung tâm, chuyển từ mô hình tập trung vào điều trị sang phòng ngừa và can thiệp sớm, đặc biệt trong bối cảnh dân số đang già hóa.

Với Chương trình Mục tiêu Quốc gia giai đoạn 2026-2035, WHO sẽ hỗ trợ chính phủ trong triển khai khám sức khỏe định kỳ, nâng cao năng lực hệ thống trạm y tế xã, đồng thời nâng tỷ lệ bao phủ bảo hiểm y tế lên trên 95% dân số.

Trong lĩnh vực phòng bệnh và an ninh y tế, các trọng tâm bao gồm kiểm soát bệnh không lây nhiễm, phòng ngừa các bệnh có thể phòng bằng vắc xin, giảm các yếu tố nguy cơ như hút thuốc lá, thuốc lá điện tử, chế độ ăn uống không lành mạnh và rượu bia, đồng thời củng cố hệ thống ứng phó khẩn cấp. WHO cũng đang hỗ trợ tăng cường phát hiện sớm và quản lý tăng huyết áp, đái tháo đường để ngăn ngừa các biến chứng.

Về biến đổi khí hậu và sức khỏe, WHO đang hỗ trợ Chính phủ xây dựng hệ thống và cơ sở y tế có khả năng chống chịu, phát thải thấp, cải thiện chất lượng không khí đô thị và giảm tác động của ô nhiễm.

Bên cạnh đó, WHO sẽ tiếp tục cung cấp hỗ trợ chính sách và kỹ thuật dựa trên bằng chứng cho Bộ Y tế và các cơ quan địa phương, tập trung vào truyền thông sức khỏe, nâng cao năng lực hệ thống và các chức năng y tế công cộng thiết yếu.

WHO Việt Nam vinh dự được tiếp tục hợp tác chặt chẽ với Chính phủ Việt Nam và các đối tác trong hành trình xây dựng một xã hội an toàn, khỏe mạnh trong năm 2026 và những năm tiếp theo.`,
  },
  {
    id: 2,
    title: "Chuyên gia nói về clip mẹ chồng mắng chửi con dâu mới sinh 10 ngày",
    type: "Phóng sự",
    author: "Nguyễn Thuận - Lê Huyên",
    sapo: "Không chỉ trải qua những xáo trộn về nội tiết, nhiều sản phụ còn đối mặt với bạo lực tinh thần và định kiến giới, khiến nguy cơ trầm cảm sau sinh gia tăng.",
    category: "Sức khỏe",
    content: `Những ngày gần đây, mạng xã hội lan truyền đoạn video ghi lại cuộc đối thoại căng thẳng giữa một sản phụ mới sinh con và mẹ chồng. Trong clip, người mẹ chồng to tiếng, dùng tay chỉ trỏ và chê bai nhà thông gia nấu ăn không tốt.

Cuộc tranh cãi lên đỉnh điểm khi người mẹ ủng hộ việc con trai mình có người phụ nữ khác, khuyên con dâu nên chấp nhận để giữ gia đình.

Những phát ngôn này khiến dư luận bức xúc, bởi không chỉ dung túng cho hành vi sai trái mà còn gián tiếp gây tổn thương tâm lý cho người phụ nữ đang ở giai đoạn hậu sản.

**Vì sao phụ nữ sau sinh dễ tổn thương?**

Chia sẻ với phóng viên, chuyên gia tâm lý, TS Phạm Thị Thúy cho biết phụ nữ sau sinh bước vào giai đoạn "nhạy cảm đặc biệt", kéo dài ít nhất trong 3 tháng đầu, thậm chí có thể lâu hơn. Đây là thời điểm cơ thể và não bộ phải thích nghi với hàng loạt thay đổi sinh học đột ngột.

Nghiên cứu y khoa đăng tải trên Spandidos chỉ ra rằng trong thai kỳ, nồng độ estrogen và progesterone tăng cao để duy trì sự phát triển của thai nhi. Tuy nhiên, chỉ trong vòng 24-48 giờ sau khi sinh, các hormone này giảm mạnh, trở về mức trước mang thai. Hiện tượng này thường được ví như "cai hormone", gây ảnh hưởng trực tiếp đến hệ thần kinh điều chỉnh cảm xúc.

Trong bối cảnh đó, chỉ một tác động tiêu cực từ môi trường sống cũng có thể trở thành "giọt nước tràn ly", kích hoạt các rối loạn tâm lý nghiêm trọng.

Cùng với những biến đổi sinh học, yếu tố tâm lý - xã hội cũng đóng vai trò quan trọng. TS Phạm Thị Thúy cho rằng việc người chồng ngoại tình trong giai đoạn vợ mang thai hoặc mới sinh là một trong những nguyên nhân phổ biến dẫn đến trầm cảm sau sinh. Mức độ tổn thương ở thời điểm này thường cao hơn nhiều lần so với các giai đoạn khác.

Một nghiên cứu đăng tải trên PubMed cho thấy phụ nữ thiếu sự hỗ trợ từ bạn đời có nguy cơ trầm cảm sau sinh cao gấp 4,5 lần so với nhóm được quan tâm đầy đủ. Khi người chồng, chỗ dựa quan trọng nhất quay lưng, người mẹ dễ rơi vào cảm giác bị bỏ rơi, mất phương hướng và bất lực.

Không dừng lại ở đó, những lời lẽ bênh vực hành vi sai trái, đổ lỗi cho nạn nhân hay áp đặt quan điểm "cam chịu vì gia đình" được xem là một dạng bạo lực tinh thần. Tổ chức Y tế Thế giới (WHO) từng cảnh báo bạo lực ngôn từ kéo dài có thể gây tổn thương tâm lý sâu sắc, làm tăng nguy cơ tự làm hại bản thân ở phụ nữ hậu sản.

Trong nhiều trường hợp, phụ nữ sau sinh có xu hướng im lặng, cam chịu và ít bộc lộ cảm xúc khi đối diện với áp lực tinh thần. Tuy nhiên, theo góc nhìn chuyên môn, đây không hẳn là biểu hiện của sự bình tĩnh hay chấp nhận.

TS Phạm Thị Thúy nhận định trạng thái này có thể là dấu hiệu của "cơ chế phòng vệ né tránh". Khi bị tổn thương quá mức, não bộ có xu hướng "đóng băng" cảm xúc để tự bảo vệ. Người trong cuộc trở nên ít phản ứng, thu mình và dần tách rời khỏi thực tại.

Theo Tạp chí Y học Việt Nam, hơn 80% phụ nữ trầm cảm sau sinh có biểu hiện khí sắc trầm buồn, mệt mỏi kéo dài và rối loạn giấc ngủ nghiêm trọng. Nếu phải sống trong môi trường căng thẳng liên tục, khả năng gắn kết mẹ con cũng bị ảnh hưởng, tác động tiêu cực đến sự phát triển tâm lý của trẻ.

Trong trường hợp xấu hơn, nếu không được can thiệp kịp thời, trầm cảm có thể tiến triển thành loạn thần sau sinh, một rối loạn hiếm gặp nhưng đặc biệt nguy hiểm, khiến người mẹ mất kiểm soát hành vi.

**Phụ nữ sau sinh cần sự sẻ chia từ gia đình**

Vụ việc cũng phản ánh những định kiến giới vẫn tồn tại sâu sắc trong nhiều gia đình Việt. Các quan niệm như "vì con phải nhịn", "đàn ông trăng hoa là chuyện thường" hay "vợ không khéo giữ chồng" vô hình trung đẩy phụ nữ vào thế yếu.

Một nghiên cứu của Đại học RMIT Việt Nam cho thấy nhiều phụ nữ có xu hướng tự trách bản thân khi hôn nhân rạn nứt, ngay cả khi lỗi không thuộc về mình. Họ lo sợ bị đánh giá, bị xem là "thất bại" trong vai trò làm vợ, làm mẹ.

Theo lý thuyết về sự không nhất quán của cái tôi, khi hình ảnh bản thân không đáp ứng được kỳ vọng xã hội, con người dễ rơi vào cảm giác tội lỗi, xấu hổ và tự ti. Với sản phụ, áp lực "người mẹ lý tưởng" càng khiến họ dễ suy sụp khi gặp biến cố.

Tuy nhiên, chuyên gia tâm lý Phạm Thị Thúy nhận định việc bảo vệ phụ nữ sau sinh cần sự chung tay từ gia đình, cộng đồng và hệ thống y tế.

Trước hết, môi trường sống cần được xây dựng trên nền tảng tôn trọng và thấu hiểu. Người mẹ cần được lắng nghe, bảo vệ và chia sẻ. Nếu không gian gia đình gây tổn thương, nên cân nhắc hạn chế tiếp xúc với nguồn áp lực, đồng thời tìm kiếm sự hỗ trợ từ người thân đáng tin cậy.

Bên cạnh đó, nâng cao nhận thức cá nhân cũng đóng vai trò quan trọng. Sản phụ cần hiểu rằng mình không có lỗi trong sự phản bội hay định kiến của người khác. Việc chăm sóc bản thân, nghỉ ngơi hợp lý và duy trì các mối quan hệ tích cực sẽ giúp quá trình phục hồi tinh thần diễn ra thuận lợi hơn.

Can thiệp y tế kịp thời là yếu tố không thể thiếu. Theo chiến lược quốc gia về chăm sóc sức khỏe tâm thần giai đoạn 2023-2030, phụ nữ sau sinh là nhóm được ưu tiên theo dõi. Khi xuất hiện các dấu hiệu buồn chán, lo âu kéo dài trên hai tuần, người mẹ nên đến cơ sở chuyên khoa để được tư vấn và điều trị phù hợp.

Chuyên gia tâm lý Phạm Thị Thúy cho rằng việc lên tiếng chống lại bạo lực tinh thần và quan niệm lỗi thời là trách nhiệm của toàn xã hội. Khi người mẹ được bảo vệ và tôn trọng, đứa trẻ mới có nền tảng phát triển lành mạnh, gia đình mới thực sự bền vững.`,
  },
  {
    id: 3,
    title: "Chàng trai 22 tuổi kể lại phút cận tử vì đột quỵ",
    type: "Phóng sự nhân vật",
    author: "Kỳ Duyên",
    sapo: "Nguyễn Thanh Minh bất ngờ đổ gục vì đột quỵ sau trận bóng đêm. Hành trình giành giật sự sống của chàng trai 22 tuổi bắt đầu từ đó.",
    category: "Sức khỏe",
    content: `Trời Hà Nội dần về đêm, những chàng trai trong độ tuổi 20 ầm ĩ tranh nhau trái bóng tròn, trận đấu sắp về những giây phút cuối. Từ vị trí đường biên, Nguyễn Thanh Minh đang ngồi nghỉ ngơi sau hiệp đấu dài. Đôi mắt đang bám riết theo từng đường lăn của quả bóng đột nhiên tối sầm. Cơ thể chàng trai 22 tuổi đổ sập xuống một cách không kiểm soát.

Cậu loáng thoáng nghe tiếng hô hoán rồi lờ mờ thấy hàng chục bóng người đang quay quanh mình. Người thì ấn huyệt, người cho tay vào miệng để cậu không cắn lưỡi, đồng đội của Minh dùng đủ mọi cách họ có thể làm để dành Minh về từ cái chết.

Không ai biết rằng kể từ lần đổ gục ấy, phải mất rất lâu sau đó, chàng trai 22 tuổi mới có thể đứng lên.

**3 chuyến cấp cứu trong đêm**

Xe cấp cứu hú còi băng qua những con đường vắng. Ở khoang sau của chiếc xe đang tròng trành, trong không gian rộng tầm vài bước chân người lớn, một điều dưỡng, một bác sĩ thay nhau ép mạnh giữa ngực. Giữa những ánh đèn xanh đỏ trên bảng sinh hiệu, nhịp tim của Minh là một hàng ngang kéo dài. Mạch cậu đã ngừng đập.

Không biết sau bao nhiêu lần ép tim, mạch của chàng trai dần được hồi phục. Xe đến bệnh viện. Các bác sĩ tiếp nhận Minh với những cái lắc đầu. Điều kiện y tế của một bệnh viện tuyến huyện gần như bất lực trước tình trạng của cậu.

Xe cấp cứu lại băng đi trong đêm để tìm sự sống cho chàng trai mới ngoài đôi mươi. Xe lại đỗ tại khoa cấp cứu một bệnh viện lớn hơn. Song hai bệnh viện khác nhau đều ra cho cùng trả lời "Ca này nặng quá, không thể làm gì khác".

Đã quá nửa đêm, thứ duy nhất ê-kíp có thể làm là tiêm thuốc cản quang chứa iod để theo dõi mức độ tổn thương. Trên ảnh chụp, máu phủ đầy khoang não chàng trai. Vị trí vỡ mạch máu nằm thật sâu, hiểm hóc. Bố ghé sát vào tai Minh thì thầm, từng chữ như lưỡi dao bén thi nhau cắt đứt ruột gan ông: "Bác sĩ bảo con nặng lắm rồi, chắc không qua khỏi đâu Minh ơi!".

Cả đêm đó, chính ông cũng bị mất ngủ bởi chẩn đoán của bác sĩ cứ văng vẳng bên tai: "90% là không cứu được, 10% là sống thực vật".

Rạng sáng, người ta lại xốc Minh lên băng ca, thêm một chuyến xe cấp cứu. Đích lên lần này là Bệnh viện Bạch Mai. Không khí phòng hội chẩn "căng như dây đàn", ê-kíp cân nhắc nhiều biện pháp nhưng với ca bệnh đứt mạch máu não ở chỗ hiểm như Minh, phương án nào cũng mang đầy rủi ro.

"Tỷ lệ của tôi là 50-50, bác sĩ bảo chỉ có thể truyền thuốc và theo dõi tiên lượng thế nào", Minh chia sẻ.

**Cuộc sống vỡ vụn ở tuổi 22**

Những ngày sau đó, Thanh Minh có cảm giác "sống nhưng không hẳn là sống". Mắt phải không thấy đường, cậu nhìn cuộc đời qua con mắt trái cũng đang mờ đục, qua những cái ôm của bố và qua những lời cầu nguyện không ngơi của mẹ.

Sự sống của Minh phó thác vào 4 chai dịch mỗi ngày, dòng dịch trong suốt chảy đều đều vào cơ thể cậu bất kể ngày đêm. "Cứ lờ mờ thấy và nghe mọi thứ nhưng bản thân không nhận thức rõ được mình đang trải qua cái gì", Minh tâm sự.

20 ngày nằm giữa ranh giới tỉnh và mê, khi ý thức trở về cũng là lúc Minh xót xa nhận ra bản thân mình bị đột quỵ. Chàng trai 22 tuổi cảm giác như bị ném sang một thế giới khác mà không có lấy một sự chuẩn bị. Ở thế giới đó, cậu nằm dán người lên giường bệnh, để gia đình thay từng miếng tã, đút từng thìa cháo.

Khi cầm trên tay kết quả "không còn xuất huyết não" cũng là lúc cả gia đình bắt đầu gói ghém hành lý, chuyển Thanh Minh về bệnh viện quê nhà để tiếp tục theo dõi và phục hồi chức năng.

Ở tuổi 22, Minh lại thấy mình như một đứa trẻ. Cậu phải học cách cầm nắm, đi đứng, nói chuyện và hơn hết là học cách đối mặt với việc bạn bè đồng trang lứa đang dần bỏ xa mình. "Việc học tập, sinh hoạt của tôi gần như bị gián đoạn", Minh nói.

Nửa người bên trái bị liệt khiến Minh khó khăn trong việc giữ cân bằng, cậu không thể đếm xuể số lần mình ngã xuống rồi lại đứng dậy trong sự tủi thân đến tột cùng.

"Con không muốn tập nữa đâu, cứ để con chống gậy cả đời cũng được", Minh gần như bất lực nói với bố mẹ khi ở tháng thứ 8, tay trái cậu vẫn buông thõng và chân thì gần như không thể nhấc lên nổi. Cuộc sống của Minh ở tuổi 22 gần như vỡ vụn nhưng đó là lần đầu tiên cậu thật sự nhìn thấy rõ ràng.

Mỗi khi nhìn mình trước gương, tim chàng trai hẫng đi một nhịp vì nhận ra cơ mặt trái của mình cứng đờ, nụ cười méo xệch đến khó tin. Hàng chục buổi đi châm cứu mỗi tháng cũng không thể khiến dây thần kinh số VII của cậu vận hành lại như trước đây.

Những ngày ấy, cuộc đời của cậu chắp vá bằng sự tủi thân, bất lực và hàng nghìn câu "giá như". Giá như mình đừng ăn thức ăn nhanh để không tăng đến 12 kg trong vỏn vẹn một tháng. Giá như đừng xuyên đêm chơi game cùng bạn và chỉ đi ngủ khi ở ngoài kia, thế giới đã rục rịch bước vào ngày mới. "Bác sĩ bảo tôi đã có sẵn vấn đề về mạch máu não và việc sinh hoạt kém khoa học có thể làm tăng nguy cơ", Minh ngậm ngùi.

**Thay đổi thói quen sống**

Trong phòng phẫu thuật lạnh ngắt, bác sĩ nhẹ nhàng áp mặt nạ gây mê vào mặt Minh. Sau vài tiếng đếm, cậu rơi vào cơn mê. Trong cuộc phẫu thuật kéo dài hàng giờ, ê-kíp hàng chục người cặm cụi lấy một đoạn dây thần kinh từ cẳng chân Minh, rồi đưa lên vùng mặt để ghép nối với dây thần kinh số 7 đã tổn thương. Dưới kính hiển vi, từng mũi khâu nhỏ hơn sợi tóc được thực hiện cẩn trọng.

Hơn một năm sau trận đột quỵ, tình trạng liệt dây thần kinh số VII vẫn chưa thôi bám riết chàng trai. Thời điểm này, nguy xơ cơ ở Minh đã tương đối cao. Giải pháp được đưa ra là ghép thần kinh, sử dụng một đoạn dây thần kinh lấy từ cẳng chân để nối lại dây thần kinh số VII ở mặt. Sợi thần kinh tái tạo với tốc độ 1mm/ngày, kết quả sẽ được thấy rõ sau 6 tháng đến một năm. Nếu kết quả không khả quan, chàng trai có thể đối diện thêm một ca phẫu thuật khác.

Nhẩm đếm hơn 30 ngày kể từ ngày được đẩy vào phòng mổ, Minh bồn chồn khi nhận ra vẫn chưa có bất kỳ thay đổi nào trên khuôn mặt mình. "Tôi lo lắm, cứ hay hỏi bác sĩ nhưng bác luôn an ủi rằng phải mất thêm một thời gian nữa mới có thể thấy kết quả rõ rệt", Minh tâm sự.

Hơn một năm kể từ trận đột quỵ sinh tử, Minh nhận ra bản thân đã đi được một đoạn đường dài. Cậu có được những bài học mà suýt phải đánh đổi bằng cả tính mạng để nhận lấy.

Từ lúc bắt đầu có thể ăn lại, thực đơn của Minh bắt đầu thiếu đi những món ăn chiên xào, thay thế bằng đồ luộc. Chàng trai 22 tuổi ép mình đi ngủ lúc đồng hồ vừa qua 22h và luôn duy trì thói quen tập thể dục điều độ. Hiện tại, Minh đã có thể tự đi đứng, sinh hoạt.

Lần đứng sát bờ vực sinh tử giúp Minh hiểu ra rằng rốt cuộc thứ đáng giá nhất của tuổi trẻ chính là sức khỏe. Những đêm thức khuya, những lần coi nhẹ cơ thể của mình đều để lại cái giá không rẻ. Việc biết giữ gìn sức khỏe cũng là một cách sống trọn vẹn, để đời người không trôi qua trong nuối tiếc.`,
  },
  {
    id: 4,
    title: "Gánh hậu quả vì áp lực làm đẹp kịp Tết",
    type: "Phóng sự",
    author: "Nguyễn Thuận - Lê Huyên",
    sapo: "Mong muốn xuất hiện rạng rỡ, chỉn chu dịp Tết, nhiều người sẵn sàng chi tiền để làm đẹp cấp tốc. Tuy nhiên, tâm lý nóng vội có thể khiến người dân gặp nhiều rủi ro.",
    category: "Sức khỏe",
    content: `Suốt gần một tháng qua, Lê Thùy Linh (25 tuổi, TP.HCM) luôn cảm thấy chán nản mỗi lần soi gương. Áp lực công việc vào những tháng cuối năm, chuỗi đêm thức trắng chạy "deadline", cùng chế độ sinh hoạt không điều độ khiến tình trạng da của cô ngày càng khô ráp, sần sùi, xỉn màu và lấm tấm những vết thâm mụn.

Nỗi lo ấy càng trở nên rõ rệt hơn khi Linh nghĩ đến những buổi gặp mặt, tụ họp dịp Tết. Cô ái ngại viễn cảnh phải đối diện với những câu hỏi thăm của họ hàng hay ánh nhìn dò xét của bạn bè cũ trong buổi họp lớp.

"Cả năm mới gặp lại nhau một lần, mình không muốn xuất hiện với vẻ ngoài mệt mỏi, thiếu sức sống. Makeup cũng khó che hết được làn da đang xuống cấp như thế này", Linh tâm sự.

Chính áp lực phải thật chỉn chu, tươi tắn trong những ngày đầu năm khiến Linh quyết định chi một khoản tiền không nhỏ để thực hiện liệu trình tiêm meso, với hy vọng làn da có thể "lột xác" trong thời gian ngắn.

Câu chuyện của Linh không phải trường hợp cá biệt mà phản ánh tâm lý chung của không ít người đang tìm kiếm các giải pháp làm đẹp cấp tốc khi Tết cận kề.

**Khi "làm đẹp" trở thành "làm khổ"**

Chia sẻ với phóng viên, bác sĩ chuyên khoa II Trần Vũ Anh Đào, Phó khoa Thẩm mỹ da, Bệnh viện Da liễu TP.HCM, cho biết nhu cầu làm đẹp da tăng cao dịp cuối năm. Số lượt khách đến tiêm filler, botox, peel da và laser tăng gấp 2-3 lần so với ngày thường.

Tại các cơ sở thẩm mỹ, nhu cầu làm đẹp bắt đầu tăng từ đầu tháng 12 năm 2025. Chị K.M.V., chủ một cơ sở thẩm mỹ da tại quận Phú Nhuận, cho biết số tin nhắn muốn được tư vấn tiêm meso, filler và botox thon gọn khuôn mặt tăng khoảng 20-30% so với các tháng trước. Khách hàng trải dài từ sinh viên ngoài 20 tuổi đến phụ nữ trung niên, với cùng mong muốn "đẹp nhanh để kịp Tết".

Việc chạy đua "kịp đẹp" trước Tết luôn tiềm ẩn những rủi ro nếu mọi người quá nôn nóng. Theo bác sĩ Đào, làm đẹp da không thể "chạy nước rút" vì hầu hết thủ thuật thẩm mỹ da đều tạo ra những tổn thương có kiểm soát để kích thích tái tạo. Da cần thời gian hồi phục. Nếu làm quá sát Tết, tình trạng đỏ, sưng, bong tróc hoặc tăng sắc tố có thể kéo dài, khiến khách hàng rơi vào cảnh "chưa kịp đẹp đã hết Tết".

Nguyễn Anh Thư (33 tuổi, TP Đà Nẵng) vẫn nhớ rõ cái Tết bị đánh mất vì quyết định làm đẹp quá vội vàng. Khoảng một tháng trước Tết năm ngoái, chị đến một spa quen để lấy nhân mụn. Tại đây, chị được tư vấn thực hiện thêm liệu trình lăn kim và peel da để cải thiện sẹo rỗ, không đều màu.

"Spa cam kết da sẽ hồi phục nhanh, kịp đẹp đón Tết. Họ nói càng bong tróc nhiều, da càng trắng và mịn", chị Thư kể.

Tin tưởng vì là cơ sở quen, chị đồng ý thực hiện. Sau hai lần lăn kim và peel, da chị bắt đầu nóng rát, đỏ kéo dài. Khi da phồng rộp, spa vẫn trấn an đó là phản ứng bình thường.

Chỉ đến khi tình trạng không cải thiện, chị mới đến bệnh viện da liễu và được chẩn đoán kích ứng nghiêm trọng, buộc phải dừng toàn bộ liệu trình.

"Da tôi lúc đó sần, dày, thâm sạm như bị cháy. Tôi không dám soi gương, càng không dám chụp hình. Phải gần một năm điều trị liên tục, làn da mới dần ổn định trở lại", chị Thư nói.

**Làm đẹp đúng thời điểm, đúng chỉ định**

Trái ngược với trải nghiệm của chị Thư, Nguyễn Thị Ngọc Anh (23 tuổi, TP.HCM) lại chọn cách làm đẹp có tính toán. Với làn da nhạy cảm, nhiều khuyết điểm, Ngọc Anh bắt đầu peel da từ trước Tết khoảng hai tháng. Sau khi da tái tạo hoàn toàn, trước Tết khoảng 2-3 tuần, Ngọc Anh chuyển sang các liệu trình phục hồi, dưỡng ẩm, chiếu đèn và điện di tinh chất.

"Tôi không muốn làm sát Tết vì sợ da không kịp hồi phục. Làm sớm giúp da khỏe dần, đến Tết thì ổn định, makeup cũng dễ hơn và bản thân tự tin hơn khi gặp gỡ bạn bè, họ hàng", Ngọc Anh chia sẻ.

Cũng nằm trong nhóm khách hàng trẻ sẵn sàng "dốc hầu bao" để có làn da đẹp, N.H.B.N. (23 tuổi, TP.HCM) lại chọn phương pháp laser để giải quyết những khuyết điểm sâu trên gương mặt. Với đặc thù làn da dầu, nhiều sẹo rỗ và lỗ chân lông to, B.N. xem dịp cuối năm là "cơ hội vàng" để thực hiện các liệu trình xâm lấn đòi hỏi sự chuẩn bị kỹ lưỡng.

"Thực ra nói là áp lực đến mức mất ăn mất ngủ thì không hẳn, nhưng đầu năm mới ai cũng muốn mình xuất hiện rạng rỡ nhất có thể. Cả năm mới có một dịp hội ngộ, nếu mình tự tin với vẻ ngoài của mình thì không khí buổi gặp mặt cũng tự nhiên trở nên dễ chịu, vui vẻ hơn", B.N. bộc bạch về lý do quyết định đầu tư vào làn da.

Thay vì chạy đua với những mẫu quần áo mới, B.N. lại ưu tiên ngân sách vào các liệu trình công nghệ cao. Cô quan niệm trang phục có thể không quá cầu kỳ, nhưng một làn da khỏe mạnh, ít khuyết điểm chính là "vũ khí" giúp phụ nữ trông trẻ hơn từ 5 đến 10 tuổi.

Theo bác sĩ Đào, tâm lý muốn "đẹp kịp Tết", ham giá rẻ và dễ tin vào các quảng cáo làm đẹp nhanh, không đau, không cần nghỉ dưỡng là những nguyên nhân khiến nhiều người phải trả giá bằng sức khỏe và tiền bạc. Bác sĩ Đào lưu ý, người dân không nên đánh đổi sự an toàn của làn da chỉ để mong đẹp nhanh trong vài ngày.

Trước nhu cầu làm đẹp tăng mạnh vào dịp cuối năm, bác sĩ khuyến cáo người dân cần tuân thủ nguyên tắc "3 đúng", gồm đúng cơ sở, đúng chỉ định và đúng thời điểm. Theo đó, nên lựa chọn các cơ sở uy tín, bảo đảm điều kiện vô khuẩn, người thực hiện được đào tạo bài bản. Mỗi tình trạng da có phác đồ riêng, không nên chạy theo trào lưu. Việc làm đẹp cũng cần được lên kế hoạch sớm, tránh dồn vào thời điểm cận Tết.

"Làm đẹp đúng thời điểm, đúng chỉ định và an toàn luôn quan trọng hơn việc kịp Tết bằng mọi giá", bác sĩ Đào nói.

Bác sĩ Đào nhấn mạnh, khi áp lực phải đẹp nhanh ngày càng lớn, người dân cần giữ sự tỉnh táo. Một làn da khỏe mạnh, an toàn vẫn là ưu tiên hàng đầu, bởi nhiều biến chứng nghiêm trọng có thể bắt nguồn từ những quyết định vội vàng.`,
  },
];

/**
 * Get all reference articles formatted for system prompt context
 */
export function getArticlesContext(): string {
  return REFERENCE_ARTICLES.map((a) => {
    return `### [${a.type}] ${a.title}
**Tác giả:** ${a.author} | **Chuyên mục:** ${a.category}
**Sapo:** ${a.sapo}

${a.content}`;
  }).join('\n\n---\n\n');
}

/**
 * Get article summaries (title + sapo only) for lighter context
 */
export function getArticlesSummary(): string {
  return REFERENCE_ARTICLES.map(
    (a) => `- **[${a.type}]** "${a.title}" (${a.author})\n  Sapo: "${a.sapo}"`
  ).join('\n');
}
