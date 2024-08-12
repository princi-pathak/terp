import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useQuery } from "react-query";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddItf = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const defaultState = {
    itf_id: from?.itf_id || undefined,
    itf_name_en: from?.itf_name_en,
    itf_name_th: from?.itf_name_th,
    itf_code: from?.itf_code,
    ITF_ean_adjustment: from?.ITF_ean_adjustment,
  };

  const [formValues, setFormValues] = useState([
    {
      detail_type: 0,
      item_id: 0,
      qty_per_itf: "",
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
        detail_type: 0,
        item_id: 0,
        qty_per_itf: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const [editEan, setEditEan] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItfDetailsId, setSelectedItfDetailsId] = useState(null);

  const handleClickOpen = (itfDetailsId) => {
    setSelectedItfDetailsId(itfDetailsId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItfDetailsId(null);
  };
  const getItfEan = () => {
    if (!from?.itf_id) return;
    axios
      .post(`${API_BASE_URL}/getItfDetails/`, { itf_id: from?.itf_id })
      .then((response) => {
        setEditEan(response.data.data || []);
      });
  };

  const handleEditEan = (index, e) => {
    const newEditProduce = [...editEan];
    newEditProduce[index][e.target.name] = e.target.value;
    setEditEan(newEditProduce);
  };

  const { data: eanList } = useQuery("getEan");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: boxList } = useQuery("getAllBoxes");
  const { data: brands } = useQuery("getBrand");

  const deleteItfEan = (eanDetailID) => {
    console.log(eanDetailID);
    axios
      .post(`${API_BASE_URL}/deleteItfPb`, {
        itf_details_id: eanDetailID,
      })
      .then((resp) => {
        if (resp.data.success == true) {
          toast.success("Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          handleClose();
          getItfEan();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const calculateItf = (id) => {
    // axios
    // 	.post(`${API_BASE_URL}/updateItfDetails`, {
    // 		id: id,
    // 	})
    // 	.then((response) => {})
    // 	.catch((error) => {
    // 		console.log(error)
    // 	})
  };
  const updateEan = () => {
    if (!from?.itf_id) return;

    axios
      .post(`${API_BASE_URL}/updateItfDetails`, {
        itf_id: from?.itf_id,
        data: editEan,
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getItfEan();
  }, []);
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

  const addItfEanData = (itf_id) => {
    if (formValues.filter((v) => v.item_id != 0).length == 0) return;
    axios
      .post(`${API_BASE_URL}/addItfDetails`, {
        user_id: localStorage.getItem("id"),
        itf_id: itf_id,
        data: formValues,
      })
      .then((response) => {
        // toast.success("ITF Details Added Successfully", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const update = (e) => {
    e.preventDefault();
    if (state.itf_name_en.trim() == "" || state.itf_name_th.trim() == "")
      return toast.error("Please enter product name");

    const formData = new FormData();
    formData.append("itf_id", state.itf_id);
    formData.append("itf_name_en", state.itf_name_en);
    formData.append("itf_name_th", state.itf_name_th);
    formData.append("itf_code", state.itf_code);
    formData.append("ITF_ean_adjustment", state.ITF_ean_adjustment);
    formData.append("images", state.box_image);

    axios
      .post(
        `${API_BASE_URL}/${from?.itf_id ? "updateItf" : "addItf"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Success", {
            autoClose: 1000,
            theme: "colored",
          });
          const id = response.data?.itf_id || from?.itf_id;
          if (id) {
            addItfEanData(id);
            // addItfPbData(id)
            updateEan();
            calculateItf(id);
            // updatePb()
          }
          navigate("/itfNew");
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
  const generateName = () => {
    const bi = [...formValues, ...editEan]
      .filter((v) => +v.detail_type == 3)
      .map((v) => ({ ...v, data: eanList.find((i) => i.ean_id == v.item_id) }));
    if (bi.length == 0) return;
    if (bi.length > 1) {
      setState((prevState) => {
        return {
          ...prevState,
          itf_name_en: "Please enter manually",
          itf_name_th: "Please enter manually",
        };
      });
      return;
    }
    let brandsType =
      brands?.find((v) => v.brand_id == bi[0].data.Brand)?.Brand_name || "NONE";
    console.log(brandsType);
    brandsType = brandsType == "NONE" ? "" : `${brandsType} `;
    const eanEn = `${brandsType}${bi[0].data.ean_name_en} x ${bi[0].qty_per_itf}`;
    const eanTh = `${brandsType}${bi[0].data.ean_name_th} x ${bi[0].qty_per_itf}`;
    setState((prevState) => {
      return {
        ...prevState,
        itf_name_en: eanEn,
        itf_name_th: eanTh,
      };
    });
  };
  return (
    <Card title={`ITF Management / ${from?.itf_id ? "Update" : "Add"} Form`}>
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
                    <div className="col-lg-3 form-group">
                      <h6>ITF Code</h6>
                      <input
                        type="text"
                        placeholder="ean code"
                        value={state.itf_code}
                        name="itf_code"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>Product Name EN</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        value={state.itf_name_en}
                        name="itf_name_en"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Product Name TH</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        value={state.itf_name_th}
                        name="itf_name_th"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Extra Weight</h6>
                      <input
                        type="number"
                        placeholder="Extra weight"
                        value={state.ITF_ean_adjustment}
                        name="ITF_ean_adjustment"
                        onChange={handleChange}
                      />
                    </div>
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
                    <div className="col-lg-3 form-group">
                      <h6>ITF vvsw</h6>
                      <p
                        className={
                          `${from?.vvsw}`.toLowerCase() == "volume over weight"
                            ? "text-red-400"
                            : ""
                        }
                      >
                        {from?.vvsw || "Weight within Limits"}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="addBtnEan">
                      <button
                        className="my-5"
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
                      className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Name</th>
                          <th className="w-5">Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editEan.map((element, index) => (
                          <tr className="rowCursorPointer">
                            <td style={{ width: "280px" }}>
                              <select
                                name="detail_type"
                                value={element.detail_type}
                                onChange={(e) => handleEditEan(index, e)}
                              >
                                <option value="1">Packaging</option>
                                <option value="2">Boxes</option>
                                <option value="3">EAN</option>
                              </select>
                            </td>
                            <td style={{ width: "280px" }}>
                              {element.detail_type == "3" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select EAN</option>
                                  {eanList?.map((item) => (
                                    <option value={item.ean_id}>
                                      {item.ean_name_en}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "1" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select Packaging</option>
                                  {packagingList?.map((item) => (
                                    <option value={item.packaging_id}>
                                      {item.packaging_name}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "2" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select Box</option>
                                  {boxList?.map((item) => (
                                    <option value={item.box_id}>
                                      {item.box_name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                name="qty_per_itf"
                                value={element.qty_per_itf}
                                onChange={(e) => handleEditEan(index, e)}
                              />
                            </td>
                            <td className="editIcon">
                              <a
                                onClick={() =>
                                  handleClickOpen(element.itf_details_id)
                                }
                              >
                                <i className="mdi mdi-trash-can-outline" />
                              </a>
                              <Dialog
                                fullWidth
                                open={open}
                                onClose={handleClose}
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
                                    onClick={() => {
                                      deleteItfEan(selectedItfDetailsId);
                                      handleClose();
                                    }}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-lg btn-block make-an-offer-btn me-1"
                                    onClick={handleClose}
                                  >
                                    No
                                  </button>
                                </DialogActions>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                        {formValues.map((element, index) => (
                          <tr className="rowCursorPointer">
                            <td style={{ width: "280px" }}>
                              <select
                                name="detail_type"
                                onChange={(e) => addFieldHandleChange(index, e)}
                                value={element.detail_type}
                              >
                                <option>Select Type</option>
                                <option value="1">Packaging</option>
                                <option value="2">Boxes</option>
                                <option value="3">EAN</option>
                              </select>
                            </td>
                            <td style={{ width: "280px" }}>
                              {element.detail_type == "3" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) =>
                                    addFieldHandleChange(index, e)
                                  }
                                  value={element.item_id}
                                >
                                  <option value="">Select EAN</option>
                                  {eanList?.map((item) => (
                                    <option value={item.ean_id}>
                                      {item.ean_name_en}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "1" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) =>
                                    addFieldHandleChange(index, e)
                                  }
                                  value={element.item_id}
                                >
                                  <option value="">Select Packaging</option>
                                  {packagingList?.map((item) => (
                                    <option value={item.packaging_id}>
                                      {item.packaging_name}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "2" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) =>
                                    addFieldHandleChange(index, e)
                                  }
                                  value={element.item_id}
                                >
                                  <option value="">Select Box</option>
                                  {boxList?.map((item) => (
                                    <option value={item.box_id}>
                                      {item.box_name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              <div className="ceateTransport">
                                <input
                                  type="number"
                                  name="qty_per_itf"
                                  value={element.qty_per_itf}
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
              onClick={update}
            >
              {from?.itf_id ? "Update" : "Create"}
            </button>
            <Link className="btn btn-danger" to={"/itfNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddItf;
