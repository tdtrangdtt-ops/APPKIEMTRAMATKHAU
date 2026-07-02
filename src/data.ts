import { Planet, Student } from "./types";

export const planets: Planet[] = [
  {
    id: "sun",
    name: "Mặt Trời",
    englishName: "Sun",
    diameter: 1392700,
    mass: "1.989e30",
    gravity: 274,
    dayDuration: 27,
    orbitRadius: 0,
    orbitSpeed: 0,
    color: "#f59e0b",
    secondaryColor: "#ef4444",
    description: "Ngôi sao trung tâm của Hệ Mặt Trời, cung cấp năng lượng và ánh sáng duy trì mọi sự sống.",
    funFact: "Mặt Trời chiếm tới 99.86% toàn bộ khối lượng của Hệ Mặt Trời!",
    arDetails: {
      coreTemperature: "15,000,000 °C",
      atmosphere: "Khí quyển Hydro và Heli",
      moonsCount: 0,
      yearDuration: "Không có"
    }
  },
  {
    id: "mercury",
    name: "Sao Thủy",
    englishName: "Mercury",
    diameter: 4879,
    mass: "3.285e23",
    gravity: 3.7,
    dayDuration: 58.6,
    orbitRadius: 40,
    orbitSpeed: 2.5,
    color: "#9ca3af",
    secondaryColor: "#6b7280",
    description: "Hành tinh nhỏ nhất và nằm gần Mặt Trời nhất trong toàn bộ hệ hành tinh.",
    funFact: "Dù cực kỳ gần Mặt Trời, Sao Thủy vẫn có những vùng băng đá vĩnh cửu nằm sâu trong bóng tối của các miệng hố ở cực nam.",
    arDetails: {
      coreTemperature: "-180 °C đến 430 °C",
      atmosphere: "Cực kỳ mỏng (Exosphere)",
      moonsCount: 0,
      yearDuration: "88 ngày Trái Đất"
    }
  },
  {
    id: "venus",
    name: "Sao Kim",
    englishName: "Venus",
    diameter: 12104,
    mass: "4.867e24",
    gravity: 8.87,
    dayDuration: 243,
    orbitRadius: 65,
    orbitSpeed: 1.8,
    color: "#fbbf24",
    secondaryColor: "#d97706",
    description: "Hành tinh nóng nhất trong Hệ Mặt Trời với hiệu ứng nhà kính cực độ và bầu khí quyển siêu dày đặc.",
    funFact: "Sao Kim tự quay quanh trục theo chiều ngược lại so với hầu hết các hành tinh khác trong Hệ Mặt Trời.",
    arDetails: {
      coreTemperature: "465 °C ổn định",
      atmosphere: "Cực dày (96% khí CO2)",
      moonsCount: 0,
      yearDuration: "225 ngày Trái Đất"
    }
  },
  {
    id: "earth",
    name: "Trái Đất",
    englishName: "Earth",
    diameter: 12742,
    mass: "5.972e24",
    gravity: 9.81,
    dayDuration: 1,
    orbitRadius: 95,
    orbitSpeed: 1.2,
    color: "#3b82f6",
    secondaryColor: "#10b981",
    description: "Ngôi nhà của chúng ta, hành tinh duy nhất được biết đến trong vũ trụ có sự sống phát triển mạnh mẽ.",
    funFact: "Khoảng 71% bề mặt Trái Đất được bao phủ bởi đại dương nước lỏng.",
    arDetails: {
      coreTemperature: "-89 °C đến 58 °C",
      atmosphere: "78% Nitơ, 21% Oxy phong phú",
      moonsCount: 1,
      yearDuration: "365.25 ngày"
    }
  },
  {
    id: "moon",
    name: "Mặt Trăng",
    englishName: "Moon",
    diameter: 3474,
    mass: "7.342e22",
    gravity: 1.62,
    dayDuration: 27.3,
    orbitRadius: 110, // Orbiting Earth relative
    orbitSpeed: 3.5,
    color: "#e5e7eb",
    secondaryColor: "#9ca3af",
    description: "Vệ tinh tự nhiên duy nhất của Trái Đất, có tác động mạnh mẽ đến thủy triều và chu kỳ sinh học.",
    funFact: "Mặt Trăng đang trôi xa dần khỏi Trái Đất khoảng 3.8 cm mỗi năm!",
    arDetails: {
      coreTemperature: "-173 °C đến 127 °C",
      atmosphere: "Hầu như không có",
      moonsCount: 0,
      yearDuration: "27.3 ngày (Quỹ đạo quanh Trái Đất)"
    }
  },
  {
    id: "mars",
    name: "Sao Hỏa",
    englishName: "Mars",
    diameter: 6779,
    mass: "6.390e23",
    gravity: 3.71,
    dayDuration: 1.03,
    orbitRadius: 135,
    orbitSpeed: 0.9,
    color: "#f87171",
    secondaryColor: "#dc2626",
    description: "Hành tinh Đỏ bí ẩn, mục tiêu lớn tiếp theo cho các sứ mệnh thám hiểm không gian của loài người.",
    funFact: "Sao Hỏa sở hữu Olympus Mons - ngọn núi lửa cao gấp 3 lần đỉnh Everest, lớn nhất Hệ Mặt Trời!",
    arDetails: {
      coreTemperature: "-140 °C đến 20 °C",
      atmosphere: "Khí quyển mỏng (CO2 chủ yếu)",
      moonsCount: 2,
      yearDuration: "687 ngày Trái Đất"
    }
  },
  {
    id: "jupiter",
    name: "Sao Mộc",
    englishName: "Jupiter",
    diameter: 139820,
    mass: "1.898e27",
    gravity: 24.79,
    dayDuration: 0.41,
    orbitRadius: 180,
    orbitSpeed: 0.5,
    color: "#f59e0b",
    secondaryColor: "#b45309",
    description: "Gã khổng lồ khí, hành tinh lớn nhất trong Hệ Mặt Trời với Vết đỏ lớn khổng lồ đặc trưng.",
    funFact: "Sao Mộc có một cơn bão khổng lồ tự quay (Vết Đỏ Lớn) đã hoành hành ít nhất 350 năm qua và đủ rộng để nuốt chửng cả Trái Đất!",
    arDetails: {
      coreTemperature: "-108 °C (vùng mây ngoại vi)",
      atmosphere: "Hỗn hợp khí Hydro và Heli dày đặc",
      moonsCount: 95,
      yearDuration: "12 năm Trái Đất"
    }
  },
  {
    id: "saturn",
    name: "Sao Thổ",
    englishName: "Saturn",
    diameter: 116460,
    mass: "5.683e26",
    gravity: 10.44,
    dayDuration: 0.45,
    orbitRadius: 220,
    orbitSpeed: 0.3,
    color: "#fbbf24",
    secondaryColor: "#d97706",
    description: "Nổi tiếng với hệ thống vành đai băng đá kỳ vĩ, rực rỡ và cực kỳ tráng lệ.",
    funFact: "Sao Thổ là hành tinh có mật độ trung bình thấp nhất Hệ Mặt Trời - nếu có một đại dương đủ lớn, nó có thể nổi trên mặt nước!",
    arDetails: {
      coreTemperature: "-139 °C",
      atmosphere: "Hydro, Heli, Amoniac hóa lỏng",
      moonsCount: 146,
      yearDuration: "29 năm Trái Đất"
    }
  }
];

export const defaultStudents: Student[] = [
  {
    id: "student1",
    name: "Nguyễn Minh",
    avatar: "👨‍🚀 Minh",
    activePlanet: "earth",
    gazeX: 120,
    gazeY: 180,
    attentionRate: 95,
    flashcardsCollected: 3,
    connected: true,
    quizAnswers: {}
  },
  {
    id: "student2",
    name: "Trần Thùy Trang",
    avatar: "👩‍🚀 Trang",
    activePlanet: "jupiter",
    gazeX: 250,
    gazeY: 140,
    attentionRate: 98,
    flashcardsCollected: 4,
    connected: true,
    quizAnswers: {}
  },
  {
    id: "student3",
    name: "Lê Khánh Vy",
    avatar: "👾 Vy",
    activePlanet: "mars",
    gazeX: 180,
    gazeY: 210,
    attentionRate: 88,
    flashcardsCollected: 2,
    connected: true,
    quizAnswers: {}
  },
  {
    id: "student4",
    name: "Phạm Hải Nam",
    avatar: "🤖 Nam",
    activePlanet: "earth",
    gazeX: 115,
    gazeY: 190,
    attentionRate: 92,
    flashcardsCollected: 3,
    connected: true,
    quizAnswers: {}
  },
  {
    id: "student5",
    name: "Đỗ Quốc Huy",
    avatar: "🪐 Huy",
    activePlanet: "saturn",
    gazeX: 300,
    gazeY: 260,
    attentionRate: 75,
    flashcardsCollected: 1,
    connected: true,
    quizAnswers: {}
  }
];

export const defaultSystemInstructionText = `# Custom System Instruction: Chuyên gia Thiết kế Hệ thống Giáo dục Tương tác AR

## 1. Role
Bạn là một Chuyên gia Thiết kế Hệ thống Học thuật Tương tác Thực tế Tăng cường (AR) với kinh nghiệm sâu rộng trong lĩnh vực EdTech, thiết kế trải nghiệm người dùng (UX/UI) cho trẻ em, và tích hợp công nghệ tiên tiến vào các giải pháp giáo dục. Bạn có khả năng phân tích một ý tưởng phức tạp, bóc tách các yêu cầu về công nghệ, sư phạm, tương tác và trải nghiệm để xây dựng một hướng dẫn hệ thống rõ ràng, chi tiết và chuyên nghiệp cho một bot AI. Mục tiêu là giúp bot AI hiểu sâu sắc và tái tạo lại các phân tích thiết kế một cách chính xác nhất.

## 2. Objective
Mục tiêu cốt lõi của bạn là phân tích chi tiết ý tưởng về ứng dụng giáo dục AR cho học sinh tiểu học, và từ đó thiết kế một System Instruction chuyên nghiệp. System Instruction này sẽ hướng dẫn một bot AI khác thực hiện các nhiệm vụ sau:
1. Phân tích toàn diện mục tiêu học tập, tương tác người dùng, cơ chế gamification và công cụ của giáo viên.
2. Diễn giải cấu trúc thiết kế rõ ràng, khoa học phù hợp tiêu chuẩn EdTech hiện đại.
3. Làm rõ giá trị cốt lõi mang lại sự tiến bộ học tập vượt trội cho học sinh.
4. Tạo ra bản phân tích thiết kế ứng dụng chi tiết, chuyên nghiệp, có cấu trúc.

## 3. Guidelines & Rules
- Tập trung vào trẻ em tiểu học (Lớp 3 trở lên) và giáo viên. UX/UI trực quan, kích thích sự tự chủ.
- Đi sâu vào Giá trị sư phạm, Cơ chế hoạt động, Trải nghiệm tương tác vật lý và Tác động giáo dục.
- Nhấn mạnh tính sáng tạo (Mô phỏng trọng lực vật lý, Haptic feedback, Đồng bộ hóa lớp học).
- Sử dụng thuật ngữ chuyên ngành chính xác và trình bày dưới dạng Markdown chuẩn.

## 4. Tone & Persona
- Chuyên nghiệp, khách quan, phân tích chi tiết, có thẩm quyền và hiện đại đổi mới.`;

export const generateSystemInstructionMarkdown = (params: {
  grade: number;
  mainFocus: string;
  pedagogicalFramework: string;
  narratorVoice: string;
}) => {
  return `# PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG GIÁO DỤC AR: VŨ TRỤ 3D TƯƠNG TÁC
## Thiết Kế Chuyên Biệt Cho Học Sinh Lớp ${params.grade} & Giáo Viên Tiểu Học

---

### 1. Tóm tắt Ý tưởng Ứng dụng
Ứng dụng **Vũ Trụ 3D Tương Tác AR** là nền tảng EdTech đột phá sử dụng công nghệ Thực tế Tăng cường để biến các bài giảng thiên văn học trừu tượng thành trải nghiệm khám phá trực quan sinh động ngay trên bàn học của học sinh.
- **Đối tượng:** Học sinh lớp ${params.grade} và Giáo viên bộ môn Khoa học / Tự nhiên & Xã hội.
- **Khung Sư phạm Áp dụng:** ${params.pedagogicalFramework} giúp học sinh xây dựng kiến thức thông qua hành động trực tiếp.
- **Giọng đọc AI thuyết minh:** Giọng ${params.narratorVoice === "Kore" ? "nữ trầm ấm Kore" : "nam truyền cảm Zephyr"} hỗ trợ giảng giải đa phương tiện.

---

### 2. Phân tích Chi tiết Tính năng Cốt lõi

#### 2.1. Trải nghiệm AR và Mô phỏng Vũ trụ 3D
- **Mô tả:** Hiển thị mô hình 3D trực quan hệ mặt trời nổi trên mặt bàn thực tế của học sinh. Người dùng có thể quay camera 360 độ quanh các hành tinh, thu phóng phóng đại để kiểm tra địa hình.
- **Giá trị sư phạm:** Phát triển nhận thức không gian 3 chiều vượt trội so với sách giáo khoa 2D.
- **Yêu cầu công nghệ:** Tích hợp bộ thư viện ARCore/WebXR, đồng bộ khung hình 60 FPS để tránh chóng mặt cho học sinh nhỏ tuổi.

#### 2.2. Tính năng Học thuật Chuyên sâu (${params.mainFocus})
- **So sánh Tỷ lệ Thực:** 
  - Khắc phục sự hiểu lầm thường gặp của học sinh bằng cách cho phép co giãn tỉ lệ mô hình giữa Trái Đất và các hành tinh lớn như Sao Mộc để học sinh tự tay cảm nhận sự chênh lệch quy mô thực tế một cách sâu sắc.
- **Kính Viễn vọng Ảo:**
  - Học sinh trỏ tâm ngắm AR vào một thiên thể để kích hoạt ống kính phóng đại, soi rõ từng miệng hố Mặt Trăng, vành đai Sao Thổ kèm theo giọng thuyết minh tự động từ AI.

#### 2.3. Trải nghiệm Tương tác Vật lý
- **Giả lập Trọng lực & Haptic Feedback:**
  - Học sinh thực hiện thí nghiệm thả rơi quả bóng trên các hành tinh khác nhau. Khi chạm bề mặt, hiệu ứng rung phản hồi (haptic) sẽ hiển thị sóng xung kích trên màn hình mô phỏng, thể hiện chân thực sức mạnh hấp dẫn của từng thiên thể.
- **Du hành Thời gian:**
  - Thanh trượt điều chỉnh tốc độ tự quay quanh trục và quay quanh Mặt Trời của Trái Đất, biểu thị chu kỳ ngày/đêm và mùa trong năm một cách rõ rệt.

#### 2.4. Gamification: Nhiệm vụ "Tìm kiếm Hành tinh Thất lạc"
- **Cơ chế:** Các câu đố gợi ý dẫn dắt học sinh quét tìm đúng tọa độ hành tinh bị ẩn trong không gian phòng học để giải cứu, thu về Flashcard ba chiều độc bản chứa tri thức khoa học.

---

### 3. Hệ thống Hỗ trợ Giáo viên (Teacher Dashboard)
- **Đồng bộ hóa Gaze-Lock:** Giáo viên kiểm soát hướng camera AR của tất cả học sinh để chỉ dẫn lớp học tập trung vào cùng một chi tiết vũ trụ.
- **Báo cáo đáp án thực tế:** Thống kê kết quả kiểm tra nhanh của lớp trực tiếp dưới dạng biểu đồ số liệu thời gian thực.

---

### 4. Triết lý Thiết kế Trải nghiệm Người dùng (UX/UI)
- Giao diện **Cosmic Slate Theme** tối giản, trực quan, phím bấm to rõ, biểu tượng thân thiện, giảm rào cản công nghệ tối đa giúp trẻ lớp ${params.grade} tự chủ học tập sâu rộng.`;
};
