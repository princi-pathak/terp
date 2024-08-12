import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

const QuotationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  console.log(from);

  useEffect(() => {
    setData(from);
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getQuotationDetailsView?quotation_id=${from.quotation_id}`,
    {
      enabled: !!from.quotation_id,
    }
  );
  console.log(details);
  const { data: summary, refetch: getSummary } = useQuery(
    `getQuotationSummary?quote_id=${from?.quotation_id}`,
    {
      enabled: !!from?.quotation_id,
    }
  );
  console.log(summary);
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
                        Quotation / View Form
                      </h6>
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
                          <p>{data?.Quotation_number}</p>
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
                          <p>{data?.created_by}</p>
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
                          Client <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.client_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Ship To <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.consignee_name}</p>
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
                          {" "}
                          {data?.port_name} [{data?.Airport_IATA_code}]{" "}
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
                          {data?.Airline} [{data?.Airline_liner_code}]{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Currency <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.currency}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          EX Rate <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.fx_rate}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Markup Rate <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.mark_up}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Rebate <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.rebate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Clearance<span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.clearance_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Palletized <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.palletized}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          CO from Chamber <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.Chamber}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Ship Date <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.load_Before_date}</p>
                      </div>
                    </div>
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
                          <th>Calculated Price</th>
                          <th> Quoted Price</th>
                          <th>Profit</th>
                        </tr>
                      </thead>
                      {details?.map((item, i) => {
                        return (
                          <tr
                            className="rowCursorPointer orderViewRoew"
                            data-bs-toggle="modal"
                            data-bs-target="#myModal"
                          >
                            <td>{item.itf_name_en}</td>
                            <td>{item.brand_name}</td>
                            <td>{item.itf_quantity}</td>
                            <td>{item.unit_name_en}</td>
                            <td>{item.Number_of_boxes}</td>
                            <td>{item.net_weight}</td>
                            <td>{item.NEW_UNIT_FX}</td>
                            <td>{item.adjusted_price}</td>
                            <td>{item.NEW_Profit_percentage}%</td>
                          </tr>
                        );
                      })}
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
                            <p>{+summary?.Box}</p>
                          </div>
                        </div>
                        <div className="parentPurchaseView">
                          <div className="me-3">
                            <strong>
                              Total CBM<span>:</span>
                            </strong>
                          </div>
                          <div>
                            <p>{(+summary?.CBM || 0).toLocaleString()}</p>
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
                              {(+summary?.CNF_FX || 0).toLocaleString()}
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
                            <p>{+summary?.Commission}</p>
                          </div>
                        </div>
                        <div className="parentPurchaseView">
                          <div className="me-3">
                            <strong>
                              Total Rebate <span>:</span>
                            </strong>
                          </div>
                          <div>
                            <p> {(+summary?.rebate || 0).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="parentPurchaseView">
                          <div className="me-3">
                            <strong>
                              Total Profit <span>:</span>
                            </strong>
                          </div>
                          <div>
                            <p> {(+summary?.Profit || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-3">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total CBM <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{(+summary?.Gross_weight)}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Profit after Rebate<span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p> 154,050.10</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Profit(%)<span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p> 20.81</p>
                            </div>
                          </div>
                        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
              <Link className="btn btn-danger" to={"/quotation"}>
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationView;
