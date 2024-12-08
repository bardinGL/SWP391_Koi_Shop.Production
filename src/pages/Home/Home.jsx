import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Home.css";
import "../../styles/animation.css";
import fish from "../../../public/assets/img_sec.png";
import { useEffect, useState } from "react";
import {
  getAllProdItem,
  getProdItemById,
} from "../../services/ProductItemService";
import { useNavigate } from "react-router-dom";
import { getProductById } from "../../services/ProductService";
import { fetchAllBlogs } from "../../services/BlogService";
import FishSpinner from "../../components/FishSpinner";
import { addToCart } from "../../services/CartService";
import { toast } from "react-toastify";
import { getUserInfo } from "../../services/UserService";

export const Home = () => {
  const [productItems, setProductItems] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllProdItem(), fetchAllBlogs()])
      .then(([productResponse, blogResponse]) => {
        const items = productResponse.data.entities;
        const shuffledItems = items.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductItems(shuffledItems);

        if (
          blogResponse.statusCode === 200 &&
          Array.isArray(blogResponse.data)
        ) {
          const blogsToShow = blogResponse.data.slice(0, 2);
          setBlogs(blogsToShow);
        }
      })
      .finally(() => setIsLoading(false));

    //Chatbot
    const script = document.createElement("script");
    script.src = "https://app.tudongchat.com/js/chatbox.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tudong_chatbox = new TuDongChat("0gZTvtFBAwLSMw1Du_cQl");
      tudong_chatbox.initial();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleProductClick = async (productItem) => {
    try {
      const prodItemResponse = await getProdItemById(productItem.id);
      const productResponse = await getProductById(
        prodItemResponse.data.productId
      );
      const productName = productResponse.data.name;

      navigate(
        `/koi/${productName.toLowerCase().replace(/\s+/g, "")}/${
          productItem.id
        }`,
        {
          state: { response: prodItemResponse.data, productName },
        }
      );
    } catch (error) {
      console.error("Error fetching product item:", error);
    }
  };

  const handleAddToCart = async (quantity, itemId, quickBuy = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
      navigate("/login");
      return;
    }

    try {
      const response = await addToCart(quantity, itemId, token);
      if (response.data && response.data.cartId) {
        const userResponse = await getUserInfo();
        const userData = userResponse.data;

        if (quickBuy) {
          if (!userData.address || !userData.phone) {
            navigate(`/${userData.id}/detail?fromCart=true`);
            return;
          }
          navigate("/order");
        } else {
          toast.success(`Đã thêm ${productItem.name} vào giỏ hàng`);
        }
      } else {
        toast.error("Sản phẩm đã hết hàng");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleReadMore = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <>
      <Header />
      <div className="homepage" style={{ backgroundColor: "#f1f1f1" }}>
        <main className="user-select-none animated-fadeIn">
          {/* <div className="homepage-banner">
            <img src="/assets/final.png" alt="Banner" />
          </div> */}
          <section className="best-sellers">
            <h2 className="homepage-best-sellers-title">
              KOI SHOWCASE - UY TÍN, CHẤT LƯỢNG
            </h2>
            <div className="product-list">
              {productItems.map((item) => (
                <div key={item.id} className="product-item-card">
                  <div className="image-container">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="product-card-info">
                    <div>
                      <p className="best-seller-name">{item.name}</p>
                      <p className="best-seller-price">
                        {item.price.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                    <div className="button-container">
                      <button
                        className="buy-button"
                        onClick={() => handleAddToCart(1, item.id, true)}
                      >
                        Mua ngay
                      </button>
                      <button
                        className="view-more-button"
                        onClick={() => handleProductClick(item)}
                      >
                        Xem thêm
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <h2 className="homepage-intro-title">GIỚI THIỆU KOI SHOWCASE</h2>
          <section className="homepage-intro-section">
            <div className="homepage-intro-info">
              <div>
                <p>
                  {" "}
                  KOI Showcase không chỉ là nơi trưng bày những chú cá Koi đẳng
                  cấp nhất, mà còn là không gian giao lưu, chia sẻ kiến thức và
                  niềm đam mê về loài cá Koi. Chúng tôi mong muốn tạo nên một
                  cộng đồng gắn kết những người yêu thích cá Koi, cùng nhau phát
                  triển và nâng tầm thú chơi cá cảnh.{" "}
                </p>{" "}
                <br />{" "}
                <p>
                  {" "}
                  Tại KOI Showcase, bạn sẽ được chiêm ngưỡng những chú cá Koi
                  xuất sắc, được tuyển chọn kỹ lưỡng từ các trại giống uy tín
                  của Nhật Bản. Với kinh nghiệm và sự tận tâm, chúng tôi cam kết
                  mang đến cho khách tham quan không chỉ là vẻ đẹp tuyệt vời của
                  cá Koi mà còn là những giá trị văn hóa và phong thủy độc đáo.
                  Đến với KOI Showcase, bạn sẽ được trải nghiệm một không gian
                  sống động, đẳng cấp và đầy cảm hứng.{" "}
                </p>
                <br />
                <p>
                  {" "}
                  KOI Showcase là nơi hội tụ những chú cá Koi đẹp nhất, chất
                  lượng nhất, được chăm sóc và trưng bày với sự chuyên nghiệp
                  hàng đầu. Chúng tôi tự hào giới thiệu các giống cá Koi quý
                  hiếm, mang đậm nét đặc trưng của nghệ thuật nuôi cá Nhật Bản,
                  dành cho những ai đam mê và trân quý loài cá này.
                </p>{" "}
                <br />{" "}
                <p>
                  {" "}
                  Bên cạnh việc chiêm ngưỡng các chú cá Koi tuyệt đẹp, khách
                  hàng đến với KOI Showcase còn có cơ hội tìm hiểu sâu hơn về kỹ
                  thuật nuôi và chăm sóc cá Koi từ những chuyên gia dày dặn kinh
                  nghiệm. Với sứ mệnh lan tỏa niềm đam mê cá Koi, chúng tôi
                  không ngừng nâng cao chất lượng dịch vụ, mang đến trải nghiệm
                  độc đáo và đáng nhớ cho mọi khách tham quan. KOI Showcase -
                  nơi tôn vinh vẻ đẹp và giá trị của nghệ thuật cá cảnh.
                </p>
              </div>
            </div>
            <img className="homepage-intro-image" src={fish} alt="Fish" />
          </section>

          <section className="homepage-news-section">
            <h2 className="homepage-news-title">
              Tin tức cá koi - Tin tức Koi Shop
            </h2>
            <div className="homepage-news-list">
              {isLoading ? (
                <>
                  <FishSpinner />
                </>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div className="homepage-news-card" key={blog.id}>
                    <div className="news-card-image-container">
                      <img
                        src={blog.imageUrl || "./public/assets/default.jpg"}
                        alt={blog.title}
                        className="news-card-image"
                      />
                      {/* <div className="news-card-overlay">
                        <span className="news-card-category">
                          Tin Tức Cá Koi
                        </span>
                      </div> */}
                    </div>
                    <h5 className="news-card-title">{blog.title}</h5>
                    <p className="news-card-text">
                      {blog.description.substring(0, 200)}...
                    </p>
                    <div className="news-card-footer">
                      {/* <span className="news-card-date">
                        {new Date().toLocaleDateString()}
                      </span> */}
                      <button
                        className="news-card-button"
                        onClick={() => handleReadMore(blog.id)}
                      >
                        Đọc thêm
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-blogs-message">
                  Không có tin tức nào trong ngày hôm nay :(
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};
