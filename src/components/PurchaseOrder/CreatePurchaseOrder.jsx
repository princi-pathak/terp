import axios from "axios";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { ComboBox } from "../combobox";

const CreatePurchaseOrder = () => {
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const [details, setDetails] = React.useState([]);
  const getDetils = () => {
    if (from?.po_id) {
      axios
        .get(`${API_BASE_URL}/getPurchaseOrderDetails?po_id=${from?.po_id}`)
        .then((response) => {
          console.log(response);
          setDetails(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleEditDatils = (i, e) => {
    const newEditPackaging = [...details];
    newEditPackaging[i][e.target.name] = e.target.value;
    setDetails(newEditPackaging);
  };

  const deleteDetails = async (pod_id) => {
    try {
      await axios.post(`${API_BASE_URL}/deletePurchaseOrderDetails`, {
        pod_id: pod_id,
      });
      toast.success("Deleted Successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      getDetils();
    } catch (e) {}
  };

  const [state, setState] = React.useState({
    po_id: from?.po_id,
    vendor_id: from?.vendor_id,
    created:
      from?.created ||
      `${new Date().getFullYear()}-${new Date().getMonth()}${1}-${new Date().getDate()}`,
    supplier_invoice_number: from?.supplier_invoice_number,
    supplier_invoice_date: from?.supplier_invoice_date,
    user_id:localStorage.getItem("id")
  });
  const [formsValue, setFormsvalue] = React.useState([
    {
      pod_type_id: 0,
      unit_count_id: 0,
      pod_item: 0,
      pod_quantity: 0,
      pod_price: 0,
      pod_vat: 0,
      pod_wht_id: 0,
      pod_crate: 0,
    },
  ]);

  const addFieldHandleChange = (i, e) => {
    const newFormValues = [...formsValue];
    newFormValues[i][e.target.name] = e.target.value;
    setFormsvalue(newFormValues);
  };
  const addFieldHandleChangeWname = (i, name, e) => {
    const newFormValues = [...formsValue];
    newFormValues[i][name] = e;
    setFormsvalue(newFormValues);
  };

  const addFormFields = () => {
    setFormsvalue([
      ...formsValue,
      {
        pod_type_id: 0,
        unit_count_id: 0,
        pod_item: 0,
        pod_quantity: 0,
        pod_price: 0,
        pod_vat: 0,
        pod_wht_id: 0,
        pod_crate: 0,
      },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formsValue];
    newFormValues.splice(i, 1);
    setFormsvalue(newFormValues);
  };

  const { data: vendorList } = useQuery("getAllVendor");
  const { data: dropdownType } = useQuery("getDropdownType");
  const { data: produceList } = useQuery("getAllProduceItem");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: BoxList } = useQuery("getAllBoxes");
  const { data: unitType } = useQuery("getAllUnit");
  useEffect(() => {
    if (!unitType?.length) return;
    getDetils();
  }, [unitType]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updatePurchaseOrderDetils = () => {
    if (!from?.po_id) return;
    axios
      .post(`${API_BASE_URL}/updatePurchaseOrderDetails`, {
        // po_id: id,
        data: details,
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const addPurchaseOrderDetails = (id) => {
    axios
      .post(`${API_BASE_URL}/addPurchaseOrderDetails`, {
        po_id: id,
        data: formsValue.filter((v) => v.pod_type_id),
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const update = async () => {
    if (buttonClicked) {
      return;
    }
    setButtonClicked(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${
          from?.po_id ? "updatePurchaseOrder" : "addPurchaseOrder"
        }`,
        state
      );
      const id = response.data?.po_id || from?.po_id;
      if (id) {
        addPurchaseOrderDetails(id);
        updatePurchaseOrderDetils();
      }
      toast.success("Updated Purchase Orders", {
        autoClose: 5000,
        theme: "colored",
      });
      navigate("/purchase_orders");
      // window.location.reload(); // Refresh the page after navigation
    } catch (e) {
      setButtonClicked(false);
      toast.error("Error has occured", {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <Card title={`Purchase Order / ${from?.po_id ? "Update" : "Create"} Form`}>
      <div className="tab-content px-2 md:!px-4">
        <div className="tab-pane active" id="header" role="tabpanel">
          <div
            id="datatable_wrapper"
            className="information_dataTables dataTables_wrapper dt-bootstrap4"
          >
            <div className="formCreate">
              <form action="">
                <div className="row cratePurchase">
                  <div className="col-lg-3 form-group">
                    <h6>Vendor</h6>
                    <ComboBox
                      options={vendorList?.map((vendor) => ({
                        id: vendor.vendor_id,
                        name: vendor.name,
                      }))}
                      value={state.vendor_id}
                      onChange={(e) => {
                        setState({ ...state, vendor_id: e });
                      }}
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <h6>PO Date</h6>
                    <input
                      type="date"
                      name="created"
                      value={state.created}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <h6>Invoice Number</h6>
                    <input
                      className="w-full"
                      type="text"
                      name="supplier_invoice_number"
                      onChange={handleChange}
                      value={state.supplier_invoice_number}
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <h6>Invoice Date</h6>
                    <input
                      type="date"
                      name="supplier_invoice_date"
                      value={state.supplier_invoice_date}
                      onChange={handleChange}
                    />
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
                        <th>Pod Code</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>VAT</th>
                        <th>Total</th>
                        <th>WHT</th>
                        <th>Crate</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.map((v, i) => (
                        <tr key={`b_${i}`} className="rowCursorPointer">
                          <td className="borderUnsetPod">
                            {/* {v.pod_status === "1" ? (
                              <input
                                style={{ width: "130px" }}
                                className="border-0"
                                value={v.pod_code}
                              />
                            ) : (
                              <>{v.pod_code}</>
                            )} */}
                            {v.pod_status == "1" ? (
                              <input
                                
                                className="border-0"
                                value={v.pod_code}
                              />
                            ) : (
                              <>{v.pod_code}</>
                            )}
                          </td>
                          <td>
                            {/* <ComboBox
                              containerStyle={{ width: "130px" }}
                              options={dropdownType?.map((v) => ({
                           
                                id: v.type_id,
                                name: v.type_name_en,
                              }))}
                              value={v.pod_type_id}
                              onChange={(e) => {
                                if (+v.pod_status != 1) return;
                                const newEditPackaging = [...details];
                                newEditPackaging[i].pod_type_id = e;
                                setDetails(newEditPackaging);
                                disabled=(+v.pod_status !== 1)
                              }}
                            /> */}

                            {v.pod_status == "1" ? (
                              <ComboBox
                                containerStyle={{ width: "130px" }}
                                options={dropdownType?.map((v) => ({
                                  id: v.type_id,
                                  name: v.type_name_en,
                                }))}
                                value={v.pod_type_id}
                                onChange={(e) => {
                                  if (+v.pod_status != 1) return;
                                  const newEditPackaging = [...details];
                                  newEditPackaging[i].pod_type_id = e;
                                  setDetails(newEditPackaging);
                                  disabled = +v.pod_status !== 1;
                                }}
                              />
                            ) : (
                              <>
                                {
                                  dropdownType.find(
                                    (item) => item.type_id == v.pod_type_id
                                  )?.type_name_en
                                }
                              </>
                            )}
                          </td>
                          <td>
                            {/* <ComboBox
                              containerStyle={{ width: "130px" }}
                              options={
                                v.pod_type_id == "1"
                                  ? packagingList?.map((v) => ({
                                      id: v.packaging_id,
                                      name: v.packaging_name,
                                    }))
                                  : v.pod_type_id == "2"
                                  ? BoxList?.map((v) => ({
                                      id: v.box_id,
                                      name: v.box_name,
                                    }))
                                  : v.pod_type_id == "3"
                                  ? produceList?.map((v) => ({
                                      id: v.produce_id,
                                      name: v.produce_name_en,
                                    }))
                                  : []
                              }
                              value={v.pod_item}
                              onChange={(e) => {
                                if (+v.pod_status != 1) return;
                                const newEditPackaging = [...details];
                                newEditPackaging[i].pod_item = e;
                                setDetails(newEditPackaging);
                              }}
                            /> */}

                            {v.pod_status == "1" ? (
                              <ComboBox
                                containerStyle={{ width: "130px" }}
                                options={
                                  v.pod_type_id == "1"
                                    ? packagingList?.map((v) => ({
                                        id: v.packaging_id,
                                        name: v.packaging_name,
                                      }))
                                    : v.pod_type_id == "2"
                                    ? BoxList?.map((v) => ({
                                        id: v.box_id,
                                        name: v.box_name,
                                      }))
                                    : v.pod_type_id == "3"
                                    ? produceList?.map((v) => ({
                                        id: v.produce_id,
                                        name: v.produce_name_en,
                                      }))
                                    : []
                                }
                                value={v.pod_item}
                                onChange={(e) => {
                                  if (+v.pod_status != 1) return;
                                  const newEditPackaging = [...details];
                                  newEditPackaging[i].pod_item = e;
                                  setDetails(newEditPackaging);
                                }}
                              />
                            ) : (
                              <>
                                {" "}
                                {v.pod_type_id == "1"
                                  ? packagingList?.find(
                                      (item) => item.packaging_id == v.pod_item
                                    )?.packaging_name
                                  : v.pod_type_id == "2"
                                  ? BoxList?.find(
                                      (item) => item.box_id == v.pod_item
                                    )?.box_name
                                  : v.pod_type_id == "3"
                                  ? produceList?.find(
                                      (item) => item.produce_id == v.pod_item
                                    )?.produce_name_en
                                  : ""}
                              </>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                className="border-0"
                                type="text"
                                name="pod_quantity"
                                style={{ width: "130px" }}
                                disabled={+v.pod_status != 1}
                                value={v.pod_quantity}
                                onChange={(e) => handleEditDatils(i, e)}
                              />
                            ) : (
                              <> {v.pod_quantity}</>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <ComboBox
                                containerStyle={{ width: "130px" }}
                                options={unitType?.map((v) => ({
                                  id: v.unit_id,
                                  name: v.unit_name_en,
                                }))}
                                value={v.unit_count_id}
                                onChange={(e) => {
                                  if (+v.pod_status != 1) return;
                                  const newEditPackaging = [...details];
                                  newEditPackaging[i].unit_count_id = e;
                                  setDetails(newEditPackaging);
                                }}
                              />
                            ) : (
                              <> {v.unit_count_id}</>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                type="number"
                                name="pod_price"
                                className="border-0"
                                defaultValue={v.pod_price}
                                disabled={+v.pod_status != 1}
                                onChange={(e) => handleEditDatils(i, e)}
                                style={{ width: "130px" }}
                              />
                            ) : (
                              <> {v.pod_price}</>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                type="number"
                                name="pod_vat"
                                className="border-0"
                                defaultValue={v.pod_vat}
                                disabled={+v.pod_status != 1}
                                onChange={(e) => handleEditDatils(i, e)}
                                style={{ width: "50px" }}
                              />
                            ) : (
                              <> {v.pod_vat}</>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                style={{ width: "130px" }}
                                type="text"
                                readOnly
                                className="border-0"
                                disabled={+v.pod_status != 1}
                                value={(
                                  +(
                                    +v.pod_price *
                                    +v.pod_quantity *
                                    (v.pod_vat / 100)
                                  ) +
                                  +v.pod_price * +v.pod_quantity
                                ).toLocaleString("en-us")}
                              />
                            ) : (
                              <>
                                {" "}
                                {(
                                  +(
                                    +v.pod_price *
                                    +v.pod_quantity *
                                    (v.pod_vat / 100)
                                  ) +
                                  +v.pod_price * +v.pod_quantity
                                ).toLocaleString("en-us")}
                              </>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                type="text"
                                name="pod_wht_id"
                                className="border-0"
                                disabled={+v.pod_status != 1}
                                style={{ width: "50px" }}
                                value={v.pod_wht_id}
                                onChange={(e) => handleEditDatils(i, e)}
                              />
                            ) : (
                              <> {v.pod_wht_id}</>
                            )}
                          </td>
                          <td>
                            {v.pod_status == "1" ? (
                              <input
                                type="text"
                                name="pod_crate"
                                className="border-0"
                                style={{ width: "70px" }}
                                disabled={+v.pod_status != 1}
                                value={v.pod_crate}
                                onChange={(e) => handleEditDatils(i, e)}
                              />
                            ) : (
                              <> {v.pod_crate}</>
                            )}
                          </td>
                          <td className="editIcon">
                            {+v.pod_status == 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const i = window.confirm(
                                    "Do you want to delete this Order details?"
                                  );
                                  if (i) {
                                    deleteDetails(v.pod_id);
                                  }
                                }}
                              >
                                <i className="mdi mdi-trash-can-outline" />
                              </button>
                            ) : (
                              <> </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {formsValue?.map((element, index) => (
                        <tr
                          key={`a_${index}`}
                          className="rowCursorPointer"
                          data-bs-toggle="modal"
                          data-bs-target="#myModal"
                        >
                          <td> </td>
                          <td>
                            <ComboBox
                              containerStyle={{ width: "130px" }}
                              value={element.pod_type_id}
                              options={dropdownType?.map((v) => ({
                                id: v.type_id,
                                name: v.type_name_en,
                              }))}
                              onChange={(e) =>
                                addFieldHandleChangeWname(
                                  index,
                                  "pod_type_id",
                                  e
                                )
                              }
                            />
                          </td>
                          <td>
                            <ComboBox
                              containerStyle={{ width: "130px" }}
                              value={element.pod_item}
                              options={
                                element.pod_type_id == "1"
                                  ? packagingList?.map((v) => ({
                                      id: v.packaging_id,
                                      name: v.packaging_name,
                                    }))
                                  : element.pod_type_id == "2"
                                  ? BoxList?.map((v) => ({
                                      id: v.box_id,
                                      name: v.box_name,
                                    }))
                                  : element.pod_type_id == "3"
                                  ? produceList?.map((v) => ({
                                      id: v.produce_id,
                                      name: v.produce_name_en,
                                    }))
                                  : []
                              }
                              onChange={(e) =>
                                addFieldHandleChangeWname(index, "pod_item", e)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="pod_quantity"
                              className="border-0"
                              onChange={(e) => addFieldHandleChange(index, e)}
                              style={{ width: "130px" }}
                              defaultValue={element.pod_quantity}
                            />
                          </td>
                          <td>
                            <ComboBox
                              containerStyle={{ width: "130px" }}
                              value={element.unit_count_id}
                              options={unitType?.map((v) => ({
                                id: v.unit_id,
                                name: v.unit_name_en,
                              }))}
                              onChange={(e) =>
                                addFieldHandleChangeWname(
                                  index,
                                  "unit_count_id",
                                  e
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="pod_price"
                              className="border-0"
                              onChange={(e) => addFieldHandleChange(index, e)}
                              defaultValue={element.pod_price}
                              style={{ width: "130px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="pod_vat"
                              className="border-0"
                              style={{ width: "50px" }}
                              onChange={(e) => addFieldHandleChange(index, e)}
                              defaultValue={element.pod_vat}
                            />
                          </td>
                          <td>
                            <input
                              style={{ width: "130px" }}
                              type="text"
                              readOnly
                              className="border-0"
                              value={(
                                +(
                                  +element.pod_price *
                                  +element.pod_quantity *
                                  (element.pod_vat / 100)
                                ) +
                                +element.pod_price * +element.pod_quantity
                              ).toLocaleString("en-us")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="pod_wht_id"
                              style={{ width: "50px" }}
                              className="border-0"
                              onChange={(e) => addFieldHandleChange(index, e)}
                              defaultValue={element.pod_wht_id}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="pod_crate"
                              className="border-0"
                              style={{ width: "70px" }}
                              onChange={(e) => addFieldHandleChange(index, e)}
                              defaultValue={element.pod_crate}
                            />
                          </td>
                          <td>
                            {index == formsValue.length - 1 ? (
                              <button
                                type="button"
                                onClick={addFormFields}
                                className="cursor-pointer"
                              >
                                <i className="mdi mdi-plus text-xl" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => removeFormFields(index)}
                              >
                                <i className="mdi mdi-trash-can-outline text-xl" />
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
            disabled={buttonClicked} // Disable button if it has been clicked
          >
            {from?.po_id ? "Update" : "Create"}
          </button>
          <Link className="btn btn-danger" to={"/purchase_orders"}>
            Cancel
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CreatePurchaseOrder;
