import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { API_IMAGE_URL } from "../../../Url/Url";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UpdateBox = () => {
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);

  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const defaultState = {
    box_name: from?.box_name || "",
    box_height: from?.box_height || "",
    box_weight: from?.box_weight || "",
    box_width: from?.box_width || "",
    box_length: from?.box_length || "",
    box_pallet: from?.box_pallet || "",
    box_cbm: from?.box_cbm || "",
    box_mlw: from?.box_mlw || "",
  };

  const [editBoxData, setEditBoxData] = useState(defaultState);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setEditBoxData((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setEditBoxData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Edit Box Api
  const updateBoxData = async () => {
    const formData = new FormData();
    formData.append("box_id", from?.box_id);
    formData.append("box_name", editBoxData.box_name);
    formData.append("box_height", editBoxData.box_height);
    formData.append("box_weight", editBoxData.box_weight);
    formData.append("box_pallet", editBoxData.box_pallet);
    formData.append("box_width", editBoxData.box_width);
    formData.append("box_length", editBoxData.box_length);
    formData.append("box_cbm", editBoxData.box_cbm);
    formData.append("box_mlw", editBoxData.box_mlw);

    if (editBoxData.box_image instanceof File) {
      formData.append("images", editBoxData.box_image);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/editBoxes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/boxes");
      } else {
        toast.error(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };

  const boxwidth = editBoxData.box_width;
  const boxlength = editBoxData.box_length;
  const boxheight = editBoxData.box_height;
  const cal =
    (0.0001 *
      (parseFloat(boxwidth) * parseFloat(boxlength) * parseFloat(boxheight))) /
    1000000 /
    0.0001;
  const cbm = cal.toFixed(4);
  const cal_min = (cbm * 1000) / 6;
  const minload = cal_min.toFixed(2);

  // Edit Box Api
  return (
    <Card title={"Boxes Management / Edit Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4 "
            >
              <div className="d-flex exportPopupBtn"></div>
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>Name</h6>
                      <input
                        type="text"
                        id="name_th"
                        name="box_name"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name"
                        defaultValue={editBoxData.box_name}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Width</h6>
                      {/* <input type="text" id="name_en" name="box_width" onChange={handleChange}
                                                                className="form-control" placeholder="width" defaultValue={editBoxData.box_width}/> */}
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_width"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="width"
                            defaultValue={editBoxData.box_width}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-lg-3">
                      <h6>Length</h6>
                      {/* <input type="text" id="name_en" name="box_length" onChange={handleChange}
                                                                className="form-control" placeholder="lenght" defaultValue={editBoxData.box_length}/> */}
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_length"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="length"
                            defaultValue={editBoxData.box_length}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-lg-3">
                      <h6>Height</h6>
                      {/* <input type="text" id="hs_code" name="box_height" onChange={handleChange}
                                                                className="form-control" placeholder="height" defaultValue={editBoxData.box_height}/> */}
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_height"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="height"
                            defaultValue={editBoxData.box_height}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>CBM</h6>
                      <input
                        type="text"
                        id="hs_name"
                        name="hs_name"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={cbm}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Weight</h6>
                      {/* <input type="text" id="name_en" name="box_weight" onChange={handleChange}
                                                                className="form-control" placeholder="weight" defaultValue={editBoxData.box_weight}/> */}

                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_weight"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="weight"
                            defaultValue={editBoxData.box_weight}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>g</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>MinLoad</h6>
                      <input
                        type="text"
                        id="name_en"
                        name="name_en"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={minload}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Box/Pallet</h6>
                      <input
                        type="text"
                        id="name_en"
                        name="box_pallet"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Box/Pallet"
                        defaultValue={editBoxData.box_pallet}
                      />
                    </div>
                    <div className="form-group col-lg-12">
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
                            <div>
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
                    <div className="form-group col-lg-12">
                      <div className="d-flex mt-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100px btn-adddev"
                          onClick={updateBoxData}
                        >
                          Update
                        </button>
                        <Link
                          to="/boxes"
                          className="btn btn-light w-100px ms-3"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-3">
                <nav></nav>
              </div>
              <div className="table-responsive"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateBox;
