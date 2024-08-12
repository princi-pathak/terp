import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { API_IMAGE_URL } from "../../../Url/Url";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const UpdateProduce = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultState = {
    produce_id: from?.produce_id || "",
    produce_name_en: from?.produce_name_en || "",
    produce_name_th: from?.produce_name_th || "",
    produce_scientific_name: from?.produce_scientific_name || "",
    produce_hscode: from?.produce_hscode || "",
    produce_classification_id: from?.produce_classification_id || "",
    box_image: "", // Added a default value for box_image
  };

  const [editProduceData, setEditProduceData] = useState(defaultState);
  const [classification, setClassification] = useState([]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const updateProduceItems = () => {
    const formData = new FormData();
    formData.append("produce_id", editProduceData.produce_id);
    formData.append("produce_name_en", editProduceData.produce_name_en);
    formData.append("produce_name_th", editProduceData.produce_name_th);
    formData.append(
      "produce_scientific_name",
      editProduceData.produce_scientific_name
    );
    formData.append("produce_hscode", editProduceData.produce_hscode);
    formData.append(
      "produce_classification_id",
      editProduceData.produce_classification_id
    );
    formData.append("images", editProduceData.box_image);

    axios
      .post(`${API_BASE_URL}/updateProduce`, formData)
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/produceNew");
        } else {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const getClassificationData = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownProduceClassification`)
      .then((response) => {
        if (response.data.success === true) {
          setClassification(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getClassificationData();
  }, []);

  return (
    <Card title={"Produce Management / Edit Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="col-lg-6 form-group">
                      <h6>
                        <h6>Classification</h6>
                      </h6>
                      <select
                        onChange={handleChange}
                        value={editProduceData.produce_classification_id}
                        name="produce_classification_id"
                        id=""
                        className=""
                      >
                        <option value="" selected>
                          choose
                        </option>
                        {classification.map((item) => (
                          <option
                            key={item.produce_classification_id}
                            value={item.produce_classification_id}
                          >
                            {item.produce_classification_name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>Name TH</h6>
                      <input
                        type="text"
                        id="name_th"
                        onChange={handleChange}
                        name="produce_name_th"
                        className="form-control"
                        placeholder="Name TH"
                        defaultValue={editProduceData.produce_name_th}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Name EN</h6>
                      <input
                        type="text"
                        id="name_en"
                        onChange={handleChange}
                        name="produce_name_en"
                        className="form-control"
                        placeholder="Name EN"
                        defaultValue={editProduceData.produce_name_en}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>HS Code</h6>
                      <input
                        type="text"
                        id="hs_code"
                        name="produce_hscode"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="HS Code"
                        defaultValue={editProduceData.produce_hscode}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Scientific Name</h6>
                      <input
                        type="text"
                        id="hs_name"
                        name="produce_scientific_name"
                        className="form-control"
                        placeholder="Scientific Name"
                        onChange={handleChange}
                        defaultValue={editProduceData.produce_scientific_name}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group">
                      <h6>Image</h6>
                      <input
                        type="file"
                        id="box_image"
                        name="box_image"
                        onChange={handleChange}
                        // key={fileInputKey}
                        accept="image/*"
                        className="d-none"
                        // onChange={handleFileSelect}
                      />
                      <div className="imgFlex">
                        <div className="pe-4">
                          <label htmlFor="box_image">
                            <div className="uploadBorder">
                              <span>
                                Choose Image <CloudUploadIcon />{" "}
                              </span>
                            </div>
                          </label>
                        </div>
                        <div>
                          {selectedImage && (
                            <div>
                              <img
                                src={selectedImage}
                                alt="Uploaded"
                                style={{ width: "200px", height: "200px" }}
                              />
                            </div>
                          )}
                          {!selectedImage && imagePath && (
                            <div style={{ marginTop: "10px" }}>
                              <img
                                crossorigin="anonymous"
                                src={`${API_IMAGE_URL}/${imagePath}`}
                                alt="Existing"
                                style={{ width: "200px", height: "200px" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              onClick={updateProduceItems}
              className="btn btn-primary"
              type="submit"
              name="signup"
            >
              Update
            </button>
            <Link className="btn btn-danger" to="/produceNew">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateProduce;
