import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

const InvoiceView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  console.log(from);
  useEffect(() => {
    setData(from);
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `GetinvoiceDetails?invoice_id=${from?.Invoice_id}`,
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
  console.log(summary);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const newFormatter1 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
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
                              Invoice / View Form
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
                          {/* <div className="parentPurchaseView">
                                                        <div className="me-3">
                                                            <strong>
                                                                CO from Chamber <span>:</span>
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <p />
                                                        </div>
                                                    </div> */}
                        </div>
                      </div>
                      <div className="row my-3">
                        <h5 className="itemInfo">Items Info :</h5>
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
                                <th> Final Price</th>
                                <th> Calculated Price</th>
                                <th>Profit</th>
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
                                    <td>{item.itf_unit_name}</td>
                                    <td>{item.Number_of_boxes}</td>
                                    <td>{item.net_weight}</td>
                                    <td>{item.Final_Price}</td>
                                    <td>{item.calculated_price}</td>
                                    <td>{item.profit_percentage}%</td>
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
                                  <p>{+summary?.Net_Weight}</p>
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
                    <Link className="btn btn-danger" to={"/invoice"}>
                      Close
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

export default InvoiceView;
