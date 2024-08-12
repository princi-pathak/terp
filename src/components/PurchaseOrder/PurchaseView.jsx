import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Url/Url";
import { useQuery } from "react-query";

import { ComboBox } from "../combobox";
import axios from "axios";
const PurchaseView = () => {
  const { data: vendorList } = useQuery("getAllVendor");
  const { data: dropdownType } = useQuery("getDropdownType");
  const { data: produceList } = useQuery("getAllProduceItem");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: BoxList } = useQuery("getAllBoxes");
  const { data: unitType } = useQuery("getAllUnit");
  console.log(dropdownType)
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const [details, setDetails] = React.useState([]);
  const [data, setData] = React.useState("");

  const getDetils = () => {
    if (from?.po_id) {
      axios
        .post(`${API_BASE_URL}/purchaseOrderView`,{po_id:from?.po_id})
        .then((response) => {
          console.log(response);
          setDetails(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    getDetils();
    setData(from)
  }, []);
  return (
    <div>
      <div className="databaseTableSection pt-0">
        {/* End databaseTableSection */}
        <div className="top-space-search-reslute">
          <div className="tab-content p-4 pt-0 pb-0">
            <div className="tab-pane active" id="header" role="tabpanel">
              <div
                id="datatable_wrapper"
                className="information_dataTables dataTables_wrapper dt-bootstrap4 "
              >
                {/*---------------------------table data---------------------*/}
                <div className="d-flex exportPopupBtn" />
                <div className="grayBgColor p-4 pt-2 pb-2">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="font-weight-bolder mb-0 pt-2">
                        Purchase Order / View Form
                      </h6>
                      {/* <i class="mdi mdi-view-headline"></i> */}
                    </div>
                  </div>
                </div>
              
                <div className=" mt-5 borderBottompurchase">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            Code <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p> {data?.po_code}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            Create By <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p> {data?.created_by}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row purchaseViewRow">
                  <div className="col-lg-3">
                    <h6>Vendor Info</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Name <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.vendor_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Address <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>
                        {data?.vendor_address}
                        </p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Contact <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>   {data?.vendor_phone} </p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Line ID <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>  {data?.vendor_line_id} </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6>Order History</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Create Date <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p> {data?.created}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Delivery Date <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>  {data?.po_delivery_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6>Payment</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Totals<span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p> {data?.total_with_vat}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Bank Name <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.vendor_bank_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Account Name <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.vendor_bank_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Account Number <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.vendor_bank_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6>Invoice Details</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Invoice Number <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.supplier_invoice_number}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Invoice date <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.supplier_invoice_date}</p>
                      </div>
                    </div>
                    <div className="invoicePopup mt-3">
                      {/* Button trigger modal */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Invoice Details
                      </button>
                      {/* Modal */}
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                Invoice Details (PO: PO202310001)
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                {" "}
                                <i class="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div>
                                <label htmlFor="">Invoice Number</label>
                              </div>
                              <div>
                                <input type="number" />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="">Invoice Date</label>
                              </div>
                              <div>
                                <input type="date" />
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row my-3">
                  <h5 className="itemInfo">Items Info :</h5>
                </div>
                <div className="row">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                    >
                      {/*---------------------------table data---------------------*/}
                      <div className="d-flex exportPopupBtn" />
                      <table
                        id="example"
                        className="display table table-hover table-striped borderTerpProduce"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Name</th>
                            <th> Barcode</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>VAT</th>
                            <th>Total</th>
                            <th>WHT</th>
                            <th>Crate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {details?.map((item,i) => {
                            return (
                              <tr
                                className="rowCursorPointer"
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                              >
                                <td scope="row">{i+1}</td>
                                <td>{item.type_name_en}</td>
                                <td>{item.packaging_name}</td>
                                <td>{item.pod_code}</td>
                                <td>{item.pod_quantity} </td>
                                <td>{item.unit_name_en} </td>
                                <td>{item.pod_price}</td>
                                <td>{item.pod_vat}</td>
                                <td>{item.pod_line_total}</td>
                                <td>{item.pod_wht_id}</td>
                                <td>{item.pod_crate}</td>
                              </tr>
                            );
                          })} */}
                             {details?.map((v, i) => (
                        <tr key={`b_${i}`} className="rowCursorPointer">
                         <td>{i+1}</td>
                          <td>
                          
                              <>
                                {
                                  dropdownType.find(
                                    (item) => item.type_id == v.pod_type_id
                                  )?.type_name_en
                                }
                              </>
                         
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
                        
                          </td>
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
                           
                              <> {v.pod_quantity}</>
                       
                          </td>
                          <td>
                            
                              <> {v.unit_name_en}</>
                        
                          </td>
                          <td>
                           
                              <> {v.pod_price}</>
                         
                          </td>
                          <td>
                           
                              <> {v.pod_vat}</>
                        
                          </td>
                          <td>
                        
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
                          
                          </td>
                          <td>
                           
                              <> {v.pod_wht_id}</>
                          
                          </td>
                          <td>
                           
                              <> {v.pod_crate}</>
                          
                          </td>
                          {/* <td className="editIcon">
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
                          </td> */}
                        </tr>
                      ))}
                        </tbody>
                      </table>
                      {/*--------------------------- table data end--------------------------------*/}
                    </div>
                    {/* <div className="row selectPurchase">
                      <div className="col-lg-3">
                        <select name="" id="">
                          <option value="">Pending</option>
                          <option value="">Picked Up</option>
                          <option value="">Delivery</option>
                        </select>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/*--------------------------- table data end--------------------------------*/}
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
             <Link className="btn btn-danger" to={"/purchase_orders"}>
             Close
          </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseView;
