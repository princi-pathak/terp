import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ProduceCreateNew = () => {
  const navigate = useNavigate();
  const defaultState = {
    produce_name_en: "",
    produce_name_th: "",
    produce_scientific_name: "",
    produce_hscode: "",
    produce_classification_id: "",
    box_image: null, // For storing the uploaded image file
  };
  const [state, setState] = useState(defaultState);
  const [classification, setClassification] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // For previewing the selected image

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image") {
      setState((prevState) => ({
        ...prevState,
        box_image: files[0], // Handle file input
      }));
      if (files[0]) {
        setSelectedImage(URL.createObjectURL(files[0])); // Set selected image for preview
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const produceCreate = async () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("id"));
    formData.append("produce_name_en", state.produce_name_en);
    formData.append("produce_name_th", state.produce_name_th);
    formData.append("produce_scientific_name", state.produce_scientific_name);
    formData.append("produce_hscode", state.produce_hscode);
    formData.append(
      "produce_classification_id",
      state.produce_classification_id
    );
    formData.append("images", state.box_image);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createProduce`,
        formData
      );
      if (response.data.success) {
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
    } catch (error) {
      console.log(error);
    }
  };

  const getClassificationData = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownProduceClassification`)
      .then((response) => {
        if (response.data.success) {
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
    <Card title="Produce Management / Create Form">
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
                      <h6 style={{ paddingBottom: "2px" }}>Classification</h6>

                      <select
                        onChange={handleChange}
                        name="produce_classification_id"
                        id=""
                        style={{ padding: "10px" }}
                      >
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
                        onChange={handleChange}
                        type="text"
                        id="name_th"
                        name="produce_name_th"
                        className="form-control"
                        placeholder="Name TH"
                        value={state.produce_name_th}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Name EN</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="produce_name_en"
                        className="form-control"
                        placeholder="Name EN"
                        value={state.produce_name_en}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>HS Code</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_code"
                        name="produce_hscode"
                        className="form-control"
                        placeholder="HS Code"
                        value={state.produce_hscode}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Scientific Name</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_name"
                        name="produce_scientific_name"
                        className="form-control"
                        placeholder="Scientific Name"
                        value={state.produce_scientific_name}
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
              onClick={produceCreate}
              className="btn btn-primary"
              type="button"
              name="signup"
            >
              Create
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

export default ProduceCreateNew;
