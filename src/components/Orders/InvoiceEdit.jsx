import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import { toast } from "react-toastify";

import { Link, useLocation, useNavigate } from "react-router-dom";
const InvoiceEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: unit } = useQuery("getAllUnit");

  const { from } = location.state || {};
  const [data, setData] = useState("");
  const [unitPrices, setUnitPrices] = useState({});
  const [adjustedPrices, setAdjustedPrices] = useState({});
  console.log(from);
  useEffect(() => {
    setData(from);
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getInvoiceDeatilsTable?invoice_id=${from?.Invoice_id}`,
    {
      enabled: !!from?.Invoice_id,
    }
  );
  console.log(details);
  const { data: summary, refetch: getSummary } = useQuery(
    `getInvoiceSummary?invoice_id=${from?.Invoice_id}`,
    {
      enabled: !!from?.Invoice_id,
    }
  );
  useEffect(() => {
    if (details && details.length > 0) {
      const initialUnitPrices = {};
      const initialAdjustedPrices = {};
      details.forEach((item) => {
        initialUnitPrices[item.id_id] = item.Unit_id;
        initialAdjustedPrices[item.id_id] = item.adjusted_price;
      });
      setUnitPrices(initialUnitPrices);
      setAdjustedPrices(initialAdjustedPrices);
    }
  }, [details]);
  console.log(summary);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Handler function to update the state and call the API
  const handleAdjustedPriceChange = async (event, id_id) => {
    const newValue = event.target.value;
    setAdjustedPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        adjusted_price: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleEditEan = async (event, id_id) => {
    const newValue = event.target.value;
    setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        unit_id: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleEditClick = async (id_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        // Other data you may need to pass
      });
      console.log("API response:", response);
      getOrdersDetails();
      toast.success("Invoice updated successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to update Invoice");
    }
  };

  return (
    <div>
      <div
        className="px-2 py-4 main-content"
        style={{ minHeight: "calc(-148px + 100vh)" }}
      >
        <div className="container-fluid">
          <div>
            <div className="databaseTableSection pt-0">
              <div className="top-space-search-reslute">
                <div className="tab-content p-4 pt-0 pb-0">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                    >
                      <div className="d-flex exportPopupBtn" />
                      <div className="grayBgColor p-4 pt-2 pb-2">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="font-weight-bolder mb-0 pt-2">
                              Invoice / Edit Form
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className=" mt-5 borderBottompurchase">
                        <div className="InvoceViewFlex">
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Invoice Number <span>:</span>{" "}
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Invoice_number}</p>
                              </div>
                            </div>
                          </div>
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Client <span>:</span>{" "}
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Client_name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Ship To <span>:</span>{" "}
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Consignee_name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row purchaseViewRow mt-4">
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Ship Date <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{formatDate(data?.Ship_date)}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                AWB <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.bl}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Airport <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>
                                {data?.Airport} [{data?.Airport_IATA_code}]
                              </p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Airline <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>
                                {" "}
                                {data?.Airline} [{data?.Airline_liner_code}]
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total Commission<span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p>{data?.COMMISION}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total Rebate <span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p> {data?.REBATE}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total Profit <span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p> {data?.Invoice_profit}</p>
                            </div>
                          </div>

                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Markup Rate <span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p>{data?.Invoice_profit_percentage}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Currency <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.currency}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                              Exchange Rate  <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.fx_rate}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                FX Rebate <span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p>{data?.REBATE_FX}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                FX Commission <span>:</span>
                              </strong>
                            </div>
                            <div>
                            <p>{data?.COMMISION_FX}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row my-3">
                        <div className="col-lg-6">
                          <h5 className="itemInfo">Items Info :</h5>
                        </div>
                        <div className="col-lg-6">
                          <div className="addBtnEan calculateInvoice text-right">
                            <button type="button">Calculate</button>
                          </div>
                        </div>
                      </div>
                      <div className="row">
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
                              <tr role="row " className="borderTh">
                                <th>ITF</th>
                                <th>Brand Name</th>
                                <th>Quantity</th>
                                <th> Unit</th>
                                <th>Number of Box</th>
                                <th>NW</th>
                                <th> Order Price</th>
                                <th> Calculate Price</th>
                                <th> Adjusted Price</th>
                                <th>Profit</th>
                                <th>Action</th>
                              </tr>

                              {details?.map((item, i) => {
                                return (
                                  <tr
                                    className="rowCursorPointer orderViewRoew"
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                  >
                                    <td>{item.ITF_name}</td>
                                    <td>{item.brand_name}</td>
                                    <td>{item.itf_quantity}</td>
                                    <td>
                                      <div className="selectInvoiceView">
                                        <select
                                          name="unit_id"
                                          value={unitPrices[item.id_id] || ""}
                                          onChange={(e) =>
                                            handleEditEan(e, item.id_id)
                                          }
                                        >
                                          {unit?.map((unit) => (
                                            <option
                                              key={unit.unit_id}
                                              value={unit.unit_id}
                                            >
                                              {unit.unit_name_en}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </td>
                                    {/* <td>{item.itf_unit_name}</td> */}
                                    <td>{item.Number_of_boxes}</td>
                                    <td>{item.net_weight}</td>
                                    <td>{item.order_price}</td>
                                    <td>{item.calculated_price}</td>
                                    <td>
                                      <div className="selectInvoiceView">
                                        <input
                                          type="number"
                                          placeholder="123"
                                          value={
                                            adjustedPrices[item.id_id] || ""
                                          }
                                          onChange={(e) =>
                                            handleAdjustedPriceChange(
                                              e,
                                              item.id_id
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                    <td>{item.profit_percentage}%</td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleEditClick(item.id_id)
                                        }
                                        style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          padding: 0,
                                        }}
                                      >
                                        <i
                                          className="mdi mdi-autorenew"
                                          style={{
                                            width: "20px",
                                            color: "#203764",
                                            fontSize: "22px",
                                            marginTop: "10px",
                                          }}
                                        />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </thead>
                          </table>
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total NW <span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p> {+summary?.Net_Weight}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total GW<span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.Gross_weight}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total Box<span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.total_box}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total CBM<span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.CBM}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total FOB<span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.FOB}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total Frieght <span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.Freight}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total CNF <span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>{+summary?.CNF}</p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>
                                    Total CNF FX<span>:</span>
                                  </strong>
                                </div>
                                <div>
                                  <p>
                                    {" "}
                                    {(
                                      +summary?.CNF_Price_FX || 0
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    {/* <a className="btn btn-danger" href="/app.terp.com/orders">
                      Close
                    </a> */}

                    <Link className="btn btn-danger" to={"/invoice"}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEdit;
