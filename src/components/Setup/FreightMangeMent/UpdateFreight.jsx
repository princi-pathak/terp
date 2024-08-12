import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { toast } from "react-toastify";

const UpdateFreight = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();
  const defaultState = {
    user_id: localStorage.getItem("id"),
    id: from?.id || "",
    Freight_provider: from?.Freight_provider,
    liner: from?.liner,
    from_port: from?.from_port,
    destination_port: from?.destination_port,
    range1: from?.range1,
    range2: from?.range2,
    range3: from?.range3,
    range4: from?.range4,
    price1: from?.price1,
    price2: from?.price2,
    price3: from?.price3,
    price4: from?.price4,
  };

  const [state, setState] = useState(defaultState);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const [vendorList, setVendorList] = useState([]);
  const [portList, setportList] = useState([]);
  const [linerList, setlinerList] = useState([]);

  const currentportType = useMemo(() => {
    return portList?.find((item) => item.port_id == state.from_port)
      ?.port_type_id;
  }, [state.from_port, portList]);

  const update = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/${from?.id ? "updateFreight" : "addFreight"}`, {
        ...state,
        port_type: currentportType,
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Freight Added Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/freightNew");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getAllVendor`)
      .then((response) => {
        setVendorList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${API_BASE_URL}/getAllAirports`)
      .then((response) => {
        setportList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${API_BASE_URL}/getLiner`)
      .then((response) => {
        setlinerList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Card title={`Frieght Management / ${from?.id ? "Update" : "Create"} Form`}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="d-flex exportPopupBtn"></div>
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="col-lg-3 form-group">
                      <h6>Vendor</h6>
                      <select
                        name="Freight_provider"
                        value={state.Freight_provider}
                        onChange={handleChange}
                      >
                        <option value="">Select Vendor</option>

                        {vendorList?.map((item) => (
                          <option value={item.vendor_id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Port of Origin</h6>
                      <select
                        name="from_port"
                        value={state.from_port}
                        onChange={handleChange}
                      >
                        <option value="">Select Port</option>
                        {portList?.map((item) => (
                          <option value={item.port_id}>{item.port_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Destination Port</h6>
                      <select
                        name="destination_port"
                        value={state.destination_port}
                        onChange={handleChange}
                      >
                        <option value="">Select Port</option>

                        {portList
                          .filter((v) => v.port_type_id == currentportType)
                          ?.map((item) => (
                            <option value={item.port_id}>
                              {item.port_name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>Liner</h6>
                      <select
                        name="liner"
                        value={state.liner}
                        onChange={handleChange}
                      >
                        <option value="">Select Liner</option>

                        {linerList?.map((item) => (
                          <option value={item.liner_id}>
                            {item.liner_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className="display table table-hover table-striped borderTerpProduce table-responsive"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.range1}
                                    name="range1"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>Kg+</p>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.range2}
                                    name="range2"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>Kg+</p>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.range3}
                                    name="range3"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>Kg+</p>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.range4}
                                    name="range4"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>Kg+</p>
                                </div>
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="rowCursorPointer"
                          data-bs-toggle="modal"
                          data-bs-target="#myModal"
                        >
                          <td>Rate</td>

                          <td>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.price1}
                                    name="price1"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>THB</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.price2}
                                    name="price2"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>THB</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.price3}
                                    name="price3"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>THB</p>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="thbFrieght">
                              <div className="parentthb">
                                <div className="childThb">
                                  <input
                                    type="text"
                                    className="mb-0"
                                    value={state.price4}
                                    name="price4"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="childThbBtn">
                                  <p>THB</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* <tr
																			className="rowCursorPointer"
																			data-bs-toggle="modal"
																			data-bs-target="#myModal">
																			<td scope="row">Negotiated Rate</td>

																			<td>
																				<div className="thbFrieght">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>Kg+</p>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>Kg+</p>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>Kg+</p>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>Kg+</p>
																						</div>
																					</div>
																				</div>
																			</td>
																		</tr> */}
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
              {from?.id ? "Update" : "Create"}
            </button>
            <Link className="btn btn-danger" to={"/freightNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateFreight;
