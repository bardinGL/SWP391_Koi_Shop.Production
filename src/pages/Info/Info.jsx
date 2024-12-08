import React from "react";
import { Header } from "../../layouts/header/header";
import "./Info.css";
import "../../styles/animation.css";
import ceoImage from "../../../public/assets/ceo.jpg";
import ctoImage from "../../../public/assets/cto.jpg";
import cfoImage from "../../../public/assets/cfo.jpg";
import { Footer } from "../../layouts/footer/footer";

const Info = () => {
  const teamMembers = [
    {
      name: "Nguyễn Trọng Nghĩa",
      image: ctoImage,
      role: "Đảm nhiệm Backend.",
    },
    {
      name: "Nguyễn Hoàng Bảo",
      image: ceoImage,
      role: "Đảm nhiệm Frontend.",
    },
    {
      name: "Nguyễn Hưng Hảo",
      image: cfoImage,
      role: "Đảm nhiệm Backend.",
    },
  ];

  return (
    <>
      <Header />

      <div className="info-container">
        <main className="info-content animated user-select-none">
          <h1 className="info-title">Về Công Ty Chúng Tôi</h1>
          {/* <section className="info-section">
            <h2 className="text-center">Sứ Mệnh Của Chúng Tôi</h2>
            <br />
            <h2 className="fst-italic fw-bold" style={{ color: "#319795" }}>
              "CÁ KOI CỦA BẠN - TIỀN CỦA CHÚNG TÔI"
            </h2>
          </section> */}

          {/* <section className="info-section">
            <h2 className="text-center">Đội Ngũ Của Chúng Tôi</h2>
            <br />
            <div className="team-grid">
              {teamMembers.map(({ name, image, role }) => (
                <div key={name} className="team-member">
                  <div className="member-image">
                    <img src={image} />
                  </div>
                  <h3>{name}</h3>
                  <p>{role}</p>
                </div>
              ))}
            </div>
          </section> */}

          <section className="info-section">
            <h2 className="text-center">GIỚI THIỆU KOI SHOWCASE</h2>
            <br />
            <div>
              Cá Koi đã không còn xa lạ với những nhiều người. Đặc biệt là những
              người chơi, nuôi cá cảnh. Giống cá này đã được nuôi tại nhiều nước
              trên thế giới và khá phổ biến, được yêu thích tại Việt Nam.
            </div>
            <br />
            <div>
              Ngoài ra, KOI SHOWCASE sẽ cung cãp đến bạn đọc rẫt nhiều thông tin
              hữu ích vè các loại cá koi. Cùng với đó là những kinh nghiệm,chia
              sẻ có thể bạn chưa biết đến từ những chuyên gia và người chơi lâu
              năm. Nẽu bạn là người mới tìm hiểu về cá koi thì đừng bỏ qua bãt
              kì chi tiết nào nhé. Với nguồn giống bố mẹ là cá chát lượng cao từ
              các trang trại nổi tiếng Nhật Bàn như Omosako, Danichi, Isa,
              Sakai...
              <br />
              KOI SHOWCASE - TRANG TRẠI KOI CHUÃN NHẬT CHO NGƯỜI SÀNH Với những
              người chọn “chơi" cá Koi thì đây không chỉ đơn giản là một sở
              thích bình thường mà nó còn là lời gửi gắm những mong cằu trong
              cuộc sống. Vậy điều gì đã khiến nhiều người lựa chọn thú vui nuôi
              cá Koi đắt đỏ này? Giá trị tinh thần : Cá Koi Nhật Bản mang ý
              nghĩa phong thủy của người Á Đông, là loại cá biểu trưng cho sự
              giàu sang, may mắn, trường thọ và mọi đièu tốt lành trong cuộc
              sống. Theo người Trung Quốc, cá Koi còn gắn liền với điển tích "CÁ
              CHÉP HÓA RỒNG" Giá trị thầm mỹ : Cá Koi được mệnh danh là quốc ngư
              Nhật Bản với 3 sắc đen đỏ vàng trên thân biểu trưng cho sự hài hòa
              âm dương. Giá trị kinh tê : Làm giàu từ cá Koi, thu nhập hàng tỷ
              đồng/năm và câu chuyện thành công từ tay trắng thành đại gia của
              triệu phú Phan Văn Sơn Tuy nhiên, với những giá trị mà cá Koi mang
              lại thì chúng được bán với mức giá không hè rẻ. Để lựa chọn được
              một địa chỉ uy tính mua Cá Koi không phải là điều dễ dàng. Nếu
              đang có nhu cău mua Cá Koi, hãy đến với KOI SHOWCASE, chuyên cung
              cấp cá Koi chuẩn Nhật Bản 100% Đảm bảo cá chất lượng, được nhập
              khẩu trực tiếp từ trại cá nổi tiếng tại xứ Phù Tang Cá được chăm
              sóc, nuôi dưỡng khỏe mạnh , màu săc đẹp, phông bệnh tốt, chỉ việc
              đem cá vê nuôi.
            </div>
          </section>

          {/* <section className="info-section">
            <h2 className="text-center">
              Giới Thiệu Về Trang Web Của Chúng Tôi
            </h2>
            <br />
            <div className="about-info">
              <div className="about-item">
                <i className="fas fa-fish"></i>
                <p>
                  Trang web của chúng tôi chuyên cung cấp các loại cá Koi chất
                  lượng cao từ Nhật Bản.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-leaf"></i>
                <p>
                  Chúng tôi tự hào về việc chăm sóc và nuôi dưỡng cá Koi theo
                  tiêu chuẩn bền vững và thân thiện với môi trường.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-award"></i>
                <p>
                  Khách hàng có thể tin tưởng vào kinh nghiệm và sự tận tâm của
                  chúng tôi trong việc nuôi dưỡng và chăm sóc cá Koi.
                </p>
              </div>
            </div>
          </section> */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Info;
