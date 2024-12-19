import React, { useEffect, useState } from "react";
import { createConsignment } from "../services/ConsignmentService";
import { fetchAllProducts } from "../services/ProductService";
import { toast } from "react-toastify";
import { uploadImageCloudinary } from "../services/CloudinaryService"; // Import the image upload service
import "./ConsignmentForm.css";
import FishSpinner from "./FishSpinner";

const folder = import.meta.env.VITE_FOLDER_CONSIGNMENT;
const ConsignmentType = {
  CARE: "Ký gửi để chăm sóc",
  SELL: "Ký gửi để bán",
};

const ConsignmentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    origin: "",
    sex: "",
    age: 0,
    size: "",
    species: "",
    imageUrl: null,
    ph: "",
    foodAmount: "",
    waterTemp: "",
    mineralContent: "",
    createModel: "",
    personality: "",
    salePrice: undefined,
  });
 

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [consignmentType, setConsignmentType] = useState(ConsignmentType.CARE);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetchAllProducts();
      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    
    const numericValue = value.replace(/\D/g, ''); 
    const formattedValue = numericValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };
  
  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async () => {
    try {
      if (imageFile) {
        const response = await uploadImageCloudinary(imageFile, folder);
        return response.secure_url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onClose();

    try {
      const uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl) {
        const newConsignmentData = { ...formData, imageUrl: uploadedImageUrl };
        const response = await createConsignment(
          newConsignmentData,
          formData.salePrice
        );

        if (response.statusCode === 201) {
          setFormData({
            name: "",
            category: "",
            origin: "",
            sex: "",
            age: 0,
            size: "",
            species: "",
            imageUrl: null,
          });
          setImageFile(null);
          setImagePreview(null);
          setCurrentStep(1);
          toast.success("Tạo đơn ký gửi thành công!");
        }
      }
    } catch (err) {
      toast.error(
        "Tạo đơn ký gửi không thành công do thông tin bạn cung cấp có vấn đề!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setImagePreview(null);
    setCurrentStep(currentStep - 1);
  };

  const isFormValid = () => {
    const requiredFieldsFilled =
      formData.name &&
      formData.categoryId &&
      formData.origin &&
      formData.sex &&
      formData.size &&
      formData.species &&
      imageFile;
    const ageIsValid = formData.age > 0;

    return requiredFieldsFilled && ageIsValid;
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                className="form-control"
                value={formData.categoryId}
                onChange={handleChange}
                name="categoryId"
              >
                <option value="">Chọn danh mục cá KOI</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="origin">Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sex</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={formData.sex === "male"}
                    onChange={handleChange}
                    required
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={formData.sex === "female"}
                    onChange={handleChange}
                    required
                  />
                  Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="origin">PH</label>
              <input
                type="text"
                id="ph"
                name="ph"
                value={formData.ph || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin">Food Amount</label>
              <input
                type="text"
                id="foodAmount"
                name="foodAmount"
                value={formData.foodAmount || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin">Water Temp</label>
              <input
                type="text"
                id="waterTemp"
                name="waterTemp"
                value={formData.waterTemp || ""}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age || 0}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="size">Size</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="species">Species</label>
              <input
                type="text"
                id="species"
                name="species"
                value={formData.species || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mineralContent">Mineral Content</label>
              <input
                type="text"
                id="mineralContent"
                name="mineralContent"
                value={formData.mineralContent || ""}
                onChange={handleChange}
                required
              />
            </div>

            

            <div className="form-group">
              <label htmlFor="personality">Personality</label>
              <input
                type="text"
                id="personality"
                name="personality"
                value={formData.personality || ""}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="form-group">
              <label htmlFor="imageUrl">Choose file:</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleImageChange}
                className="text-dark"
                required
              />
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="w-100" />
              </div>
            )}
          </>
        );
      case 5:
        return (
          <>
            <h3>Loại ký gửi:</h3>
            <div className="radio-group flex-col mb-4">
              <label>
                <input
                  type="radio"
                  name="consignmentType"
                  value={consignmentType === ConsignmentType.CARE}
                  checked={consignmentType === ConsignmentType.CARE}
                  onChange={(event) => {
                    handleChange(event);
                    setConsignmentType(ConsignmentType.CARE);
                  }}
                  required
                />
                {ConsignmentType.CARE}
              </label>
              <label>
                <input
                  type="radio"
                  name="consignmentType"
                  value={consignmentType === ConsignmentType.SELL}
                  checked={consignmentType === ConsignmentType.SELL}
                  onChange={(event) => {
                    handleChange(event);
                    setConsignmentType(ConsignmentType.SELL);
                  }}
                  required
                />
                {ConsignmentType.SELL}
              </label>
            </div>
            {consignmentType === ConsignmentType.SELL && (
              <div>
                <div className="form-group">
                  <label htmlFor="price">Giá mong muốn bán</label>
                  <input
  type="text"
  id="salePrice"
  name="salePrice"
  value={formData.salePrice || ""}
  onChange={handleChange}
  required
/> 

                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setCurrentStep(1);
    onClose();
  };

  if (isLoading) return <FishSpinner />;
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
        <div className="consignment-form-container">
          <h1>Create Consignment Item</h1>
          <div className="progress-indicator">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`step ${currentStep >= step ? "active" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="consignment-form">
            {renderFormStep()}

            <div className="button-group">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-prev">
                  Previous
                </button>
              )}
              {currentStep < 5 && (
                <button type="button" onClick={nextStep} className="btn-next">
                  Next
                </button>
              )}
              {currentStep === 5 && (
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={!isFormValid()}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentForm;
