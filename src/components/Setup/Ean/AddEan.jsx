import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddEan = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const [items, setItems] = useState([]);
  const [packagingData, setPackagingData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      detail_type: "",
      item_id: "",
      quantity_per_ean: "",
    },
  ]);

  const addFieldHandleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        detail_type: "",
        item_id: "",
        quantity_per_ean: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const getProduceItems = () => {
    axios
      .get(`${API_BASE_URL}/getProduceItemForEan`)
      .then((response) => {
        setItems(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPackagingData = () => {
    axios
      .get(`${API_BASE_URL}/getPackaginItemForEan`)
      .then((response) => {
        setPackagingData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProduceItems();
    getPackagingData();
  }, []);
  const defaultState = {
    ean_name_en: "",
    ean_name_th: "",
    ean_code: "",
    estimated_EAN_PER_HOUR: "",
    estimated_EAN_PER_KG: "",
    type: "",
  };

  const [state, setState] = useState(defaultState);

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

  const addEanPackagingData = (eanId) => {
    axios
      .post(`${API_BASE_URL}/addEanDetails`, {
        ean_id: eanId,
        data: formValues,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const createEan = () => {
    const formData = new FormData();
    formData.append("ean_name_en", state.ean_name_en);
    formData.append("ean_name_th", state.ean_name_th);
    formData.append("ean_unit", state.ean_unit);
    formData.append("ean_code", state.ean_code);
    formData.append("user", localStorage.getItem("id"));
    formData.append("estimated_EAN_PER_HOUR", state.estimated_EAN_PER_HOUR);
    formData.append("estimated_EAN_PER_KG", state.estimated_EAN_PER_KG);
    if (state.box_image) {
      formData.append("images", state.box_image); // Append image file if it exists
    }
    const fieldCheck = state.ean_unit === "" || state.ean_code === "";

    if (fieldCheck) {
      toast.warn("Please Fill All The Fields", {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/createEan`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          toast.success("Success", {
            autoClose: 1000,
            theme: "colored",
          });
          addEanPackagingData(response.data.data);
          navigate("/eanNew");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [unitDropdown, setUnitDropDown] = useState([]);
  const getUnitDropdown = () => {
    axios
      .get(`${API_BASE_URL}/getAllUnit`)
      .then((resp) => {
        setUnitDropDown(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useState(() => {
    getUnitDropdown();
  }, []);
  const generateName = () => {
    const produceList = [...formValues].filter((v) => v.detail_type == 3);
    console.log(produceList);
    if (produceList.length == 0) return;
    if (produceList.length > 1) {
      setState((prevState) => {
        return {
          ...prevState,
          ean_name_en: "Manual Entry",
          ean_name_th: "Manual Entry",
        };
      });
      return;
    }
    const itemsw = items.find((v) => v.produce_id == produceList[0].item_id);
    const nameEn =
      itemsw.produce_name_en.trim() +
      ` - ${+state.ean_unit == 2 ? produceList[0].quantity_per_ean : ""}${
        { 5: "Kg", 2: "g", 1: "Pc" }[+state.ean_unit] || ""
      }`;
    const nameTh =
      itemsw.produce_name_th.trim() +
      ` - ${+state.ean_unit == 2 ? produceList[0].quantity_per_ean : ""}${
        { 5: "Kg", 2: "g", 1: "Pc" }[+state.ean_unit] || ""
      }`;
    setState((prevState) => {
      return {
        ...prevState,
        ean_name_en: nameEn,
        ean_name_th: nameTh,
      };
    });
  };

  return (
    <Card title="EAN Management / Create Form">
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate ">
                <form action="">
                  <div className="row formEan">
                    <div className="col-lg-4 form-group">
                      <h6>EAN Code</h6>
                      <input
                        onChange={handleChange}
                        name="ean_code"
                        type="text"
                        placeholder="ean code"
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Unit</h6>
                      <select name="ean_unit" id="" onChange={handleChange}>
                        <option>select unit</option>
                        {unitDropdown.map((item) => (
                          <option value={item.unit_id}>
                            {item.unit_name_en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Name En</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        name="ean_name_en"
                        value={state.ean_name_en}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Name Th</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        name="ean_name_th"
                        value={state.ean_name_th}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Estimated Ean/ Hour</h6>
                      <input
                        type="text"
                        placeholder="Estimated Ean/ Hour"
                        name="estimated_EAN_PER_HOUR"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Estimated Ean/ Kg</h6>
                      <input
                        type="text"
                        placeholder="Estimated Ean/ Kg"
                        name="estimated_EAN_PER_KG"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-12 form-group">
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
                    <div className="row">
                      <div className="addBtnEan">
                        <button
                          className="mt-0 mb-5"
                          onClick={generateName}
                          type="button"
                        >
                          Generate Name
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <div className="eanTop">
                      <div className="eanTableAddHead">
                        <h6>Type</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>Name</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>Quantity</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>Actions</h6>
                      </div>
                    </div>

                    {formValues.map((element, index) => (
                      <div className="EanAdd" key={`aaa_${index}`}>
                        <div className="">
                          <div
                            className="ceateTransport"
                            style={{ width: "280px" }}
                          >
                            <select
                              onChange={(e) => {
                                addFieldHandleChange(index, e);
                              }}
                              name="detail_type"
                              id=""
                            >
                              <option selected value={0}>
                                Select Type
                              </option>
                              <option value={3}>Setup produce</option>
                              <option value={1}>setup packaging</option>
                            </select>
                          </div>
                        </div>
                        <div value={element.name || ""}>
                          {element.detail_type == 3 ? (
                            <div
                              className="ceateTransport"
                              style={{ width: "280px" }}
                            >
                              <select
                                name="item_id"
                                id=""
                                onChange={(e) => {
                                  addFieldHandleChange(index, e);
                                }}
                              >
                                <option selected>Select Produce</option>

                                {items?.map((item, i) => (
                                  <option
                                    key={`td_${i}`}
                                    value={item.produce_id}
                                  >
                                    {item.produce_name_en}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : element.detail_type == 1 ? (
                            <div
                              className="ceateTransport"
                              style={{ width: "280px" }}
                            >
                              <select
                                name="item_id"
                                id=""
                                onChange={(e) => {
                                  addFieldHandleChange(index, e);
                                }}
                              >
                                <option selected>Select Packaging</option>

                                {packagingData?.map((item) => (
                                  <option value={item.packaging_id}>
                                    {item.packaging_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div
                              className="ceateTransport"
                              style={{ width: "280px" }}
                            >
                              <select
                                name="item_id"
                                id=""
                                onChange={(e) => {
                                  addFieldHandleChange(index, e);
                                }}
                              >
                                <option value={0}>Select</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <div>
                          <div
                            className="ceateTransport"
                            style={{ width: "280px" }}
                          >
                            <input
                              type="number"
                              name="quantity_per_ean"
                              value={element.quantity_per_ean}
                              onChange={(e) => addFieldHandleChange(index, e)}
                            />
                          </div>
                        </div>
                        {index == formValues.length - 1 ? (
                          <button
                            type="button"
                            className="text-2xl"
                            onClick={addFormFields}
                          >
                            <i className="mdi mdi-plus" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="text-2xl"
                            onClick={() => removeFormFields(index)}
                          >
                            <i className="mdi mdi-trash-can-outline" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={createEan}
            >
              Create
            </button>
            <Link className="btn btn-danger" to={"/eanNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddEan;
