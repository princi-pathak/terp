import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const AdjustEanView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  console.log(from);
  const [tableData, setTableData] = useState([]);
  const [totalDetails, setTotalDetails] = useState("");

  const adjustView = () => {
    axios
      .post(`${API_BASE_URL}/getAdjustEanView`, {
        packing_common_id: from?.packing_common_id,
      })
      .then((response) => {
        console.log(response);
        setTotalDetails(response?.data?.details);
        // setData(response?.data?.data);

        setTableData(response?.data?.tableData);

      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  useEffect(() => {
    adjustView();
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getOrdersDetails?id=${from?.order_id}`,
    {
      enabled: !!from?.order_id,
    }
  );
  const { data: summary, refetch: getSummary } = useQuery(
    `getOrderSummary?quote_id=${from?.order_id}`,
    {
      enabled: !!from?.order_id,
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
                        Adjust Ean / View Form
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="adjustEanQuan mt-5">
                  <div className="row">
                    <div className="col-lg-3">
                      <p>
                        {" "}
                        <span>Used Quantity :</span> <strong>{totalDetails?.qty_used}</strong>
                      </p>

                      <p>
                        {" "}
                        <span>Number of Staff :</span> <strong>{totalDetails?.number_of_staff} </strong>
                      </p>

                      <p>
                        {" "}
                        <span>Start Time :</span> <strong>{totalDetails?.start_time} </strong>
                      </p>

                      <p>
                        {" "}
                        <span>End Time :</span> <strong>{totalDetails?.end_time}</strong>
                      </p>
                    </div>
                    <div className="col-lg-3">
                      <p>
                        {" "}
                        <span> Name :</span> <strong>{from?.name}</strong>
                      </p>
                      <p>
                        {" "}
                        <span> Quantity :</span> <strong>{from?.qty_available}</strong>
                      </p>
                      <p>
                        {" "}
                        <span>Unit :</span> <strong></strong>
                      </p>
                    </div>
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
                        <th>EAN</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>EAN Cost</th>
                        <th>Average Weight</th>
                        <th>EAN Per Kg</th>
                        <th>EAN Per Hour </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((item, i) => {
                        return (
                          <tr
                            className="rowCursorPointer"
                            data-bs-toggle="modal"
                            data-bs-target="#myModal"
                          >
                            <td>{item.ean_name_en}</td>
                            <td>{item.ean_qty}</td>
                            <td>{item.packing_ean_unit}</td>
                            <td>{item.ean_cost}</td>
                            <td>{item.average_weight}</td>
                            <td>{item.EanPerKg}</td>
                            <td>{item.EanPerHour}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
              <Link className="btn btn-danger" to={"/orders"}>
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustEanView;
