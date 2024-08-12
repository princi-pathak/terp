import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { API_IMAGE_URL } from "../../../Url/Url";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const UpdateEan = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [packagingData, setPackagingData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      detail_type: "",
      item_id: "",
      quantity_per_ean: "",
    },
  ]);
  const [openProd, setOpenProd] = useState(false);

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

  const addEanPackagingData = (eanId) => {
    if (formValues.filter((v) => v.item_id).length == 0) return;
    axios
      .post(`${API_BASE_URL}/addEanDetails`, {
        ean_id: eanId,
        data: formValues.filter((v) => v.item_id),
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const [editProduce, setEditProduce] = useState([]);

  const handleEditProduce = (index, e) => {
    const newEditProduce = [...editProduce];
    newEditProduce[index][e.target.name] = e.target.value;
    setEditProduce(newEditProduce);
  };

  const editEanPackaging = (eanId) => {
    axios
      .post(`${API_BASE_URL}/updateEanDetails`, {
        ean_id: eanId,
        data: editProduce,
      })
      .then((response) => {})
      .catch((error) => {});
  };

  const handleOpenProduce = () => {
    setOpenProd(true);
  };

  const handleCloseProduce = () => {
    setOpenProd(false);
  };
  const deleteEanProduce = (eanProduceID) => {
    axios
      .post(`${API_BASE_URL}/deleteEanProduce`, {
        ean_produce_id: eanProduceID,
      })
      .then((resp) => {
        if (resp.data.success == true) {
          toast.success("Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          handleCloseProduce();
          getEanProduceData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    ean_name_en: from?.ean_name_en || "",
    ean_name_th: from?.ean_name_th || "",
    ean_code: from?.ean_code || "",
    estimated_EAN_PER_HOUR: from?.estimated_EAN_PER_HOUR || "",
    estimated_EAN_PER_KG: from?.estimated_EAN_PER_KG || "",
    ean_unit: from?.ean_unit || "",
  };

  const [state, setState] = useState(defaultState);
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setState((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const getEanProduceData = () => {
    axios
      .get(`${API_BASE_URL}/getEanDetails?id=${from?.ean_id}`)
      .then((resp) => {
        setEditProduce(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useState(() => {
    getEanProduceData();
  }, []);

  const EditEan = () => {
    console.log("function call");
    const formData = new FormData();
    formData.append("ean_id", from?.ean_id);
    formData.append("ean_name_en", state.ean_name_en);
    formData.append("ean_name_th", state.ean_name_th);
    formData.append("ean_unit", state.ean_unit);
    formData.append("ean_code", state.ean_code);
    formData.append("estimated_EAN_PER_HOUR", state.estimated_EAN_PER_HOUR);
    formData.append("estimated_EAN_PER_KG", state.estimated_EAN_PER_KG);
    if (state.box_image instanceof File) {
      formData.append("images", state.box_image);
    }

    axios
      .post(`${API_BASE_URL}/editEan`, formData, {
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
          addEanPackagingData(from?.ean_id);
          editEanPackaging(from?.ean_id);
          navigate("/eanNew");
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
    const produceList = [...formValues, ...editProduce].filter(
      (v) => v.detail_type == 3
    );
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
    <Card title="EAN Management / Edit Form">
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
                        value={state.ean_code}
                        placeholder="ean code"
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Unit</h6>
                      <select
                        name="ean_unit"
                        id=""
                        value={state.ean_unit}
                        onChange={handleChange}
                      >
                        <option>Select Unit</option>
                        {unitDropdown.map((item, i) => (
                          <option value={item.unit_id} key={item.unit_id}>
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
                        value={state.estimated_EAN_PER_HOUR}
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
                        value={state.estimated_EAN_PER_KG}
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
                            <div style={{ marginTop: "5px" }}>
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
                  <div className="row">
                    <div className="addBtnEan">
                      <button
                        className="mt-2 mb-5"
                        type="button"
                        onClick={generateName}
                      >
                        Generate Name
                      </button>
                    </div>
                  </div>
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className="display table table-hover table-striped borderTerpProduce"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>
                            <h6>Type</h6>
                          </th>
                          <th>
                            <h6>Name</h6>
                          </th>
                          <th>
                            <h6>Quantity</h6>
                          </th>
                          <th>
                            <h6>Actions</h6>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {editProduce.map((produceItem, index) => {
                          return (
                            <tr
                              className="rowCursorPointer"
                              key={`tx_${index}`}
                            >
                              <td style={{ width: "280px" }}>
                                <select
                                  value={+produceItem.detail_type}
                                  onChange={(e) => handleEditProduce(index, e)}
                                  name="detail_type"
                                >
                                  <option selected value={0}>
                                    Select Type
                                  </option>
                                  <option value={3}>Setup produce</option>
                                  <option value={1}>setup packaging</option>
                                </select>
                              </td>

                              <td style={{ width: "280px" }}>
                                {produceItem.detail_type == 3 ? (
                                  <div
                                    className="ceateTransport"
                                    style={{ width: "280px" }}
                                  >
                                    <select
                                      name="item_id"
                                      id=""
                                      onChange={(e) => {
                                        handleEditProduce(index, e);
                                      }}
                                      value={produceItem.item_id}
                                    >
                                      <option selected>Select Produce</option>

                                      {items?.map((item, i) => (
                                        <option key={i} value={item.produce_id}>
                                          {item.produce_name_en}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ) : produceItem.detail_type == 1 ? (
                                  <div
                                    className="ceateTransport"
                                    style={{ width: "280px" }}
                                  >
                                    <select
                                      name="item_id"
                                      id=""
                                      onChange={(e) => {
                                        handleEditProduce(index, e);
                                      }}
                                      value={produceItem.item_id}
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
                                        handleEditProduce(index, e);
                                      }}
                                    >
                                      <option value={0}>Select</option>
                                    </select>
                                  </div>
                                )}
                              </td>

                              <td style={{ width: "280px" }}>
                                <div
                                  className="ceateTransport"
                                  style={{ width: "280px" }}
                                >
                                  <input
                                    type="number"
                                    name="quantity_per_ean"
                                    value={produceItem.quantity_per_ean}
                                    onChange={(e) =>
                                      handleEditProduce(index, e)
                                    }
                                  />
                                </div>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="text-2xl"
                                  onClick={handleOpenProduce}
                                >
                                  <i className="mdi mdi-trash-can-outline" />
                                </button>

                                <Dialog
                                  fullWidth
                                  open={openProd}
                                  onClose={handleCloseProduce}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle
                                    id="alert-dialog-title"
                                    className="text-center"
                                  >
                                    {"Are you sure you want to delete?"}
                                  </DialogTitle>
                                  <DialogContent className="text-center p-0 m-0 alertDel">
                                    <DialogContentText id="alert-dialog-description">
                                      <DeleteSweepIcon
                                        style={{
                                          color: "#AF2655",
                                          fontSize: "70px",
                                          marginBottom: "20px",
                                        }}
                                      />
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions className="text-center d-flex align-items-center justify-content-center">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-lg btn-block make-an-offer-btn"
                                      onClick={() =>
                                        deleteEanProduce(
                                          produceItem.ean_detail_id
                                        )
                                      }
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-lg btn-block make-an-offer-btn me-1"
                                      onClick={handleCloseProduce}
                                    >
                                      No
                                    </button>
                                  </DialogActions>
                                </Dialog>
                              </td>
                            </tr>
                          );
                        })}
                        {formValues.map((element, index) => (
                          <tr className="rowCursorPointer" key={`td_${index}`}>
                            <td style={{ width: "280px" }}>
                              <select
                                onChange={(e) => addFieldHandleChange(index, e)}
                                name="detail_type"
                              >
                                <option selected value={0}>
                                  Select Type
                                </option>
                                <option value={3 || ""}>Setup produce</option>
                                <option value={1 || ""}>setup packaging</option>
                              </select>
                            </td>
                            <td style={{ width: "280px" }}>
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
                                    {items?.map((item, i) => (
                                      <option
                                        key={item.produce_id}
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
                            </td>
                            <td style={{ width: "280px" }}>
                              <div
                                className="ceateTransport"
                                style={{ width: "280px" }}
                              >
                                <input
                                  type="number"
                                  name="quantity_per_ean"
                                  value={element.quantity_per_ean}
                                  onChange={(e) =>
                                    addFieldHandleChange(index, e)
                                  }
                                />
                              </div>
                            </td>
                            <td className="editIcon">
                              {index == formValues.length - 1 ? (
                                <button type="button" onClick={addFormFields}>
                                  <i className="mdi mdi-plus" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeFormFields(index)}
                                >
                                  <i className="mdi mdi-trash-can-outline" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
              onClick={EditEan}
            >
              Update
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

export default UpdateEan;
