import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { useQuery } from "react-query";
import { ComboBox } from "../../combobox";
const AirportCreate = () => {
  const { data: clearance } = useQuery("getClearancedropdown");
  const { data: linear } = useQuery("getLinerdropdown");
  const { data: transportation } = useQuery("getTransportationdropdown");
  console.log(clearance);
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();
  const [state, setState] = useState({
    port_id: from?.port_id ?? undefined,
    user_id:localStorage.getItem("id"),
    port_type_id: from?.port_type_id ?? 1,
    port_name: from?.port_name ?? "",
    port_country: from?.port_country ?? "",
    port_city: from?.port_city ?? "",
    port_code: from?.port_code ?? "",
    Seaport_code: from?.Seaport_code ?? "",
    IATA_code: from?.IATA_code ?? "",
    ICAO_Code: from?.ICAO_Code ?? "",
    preferred_clearance: from?.preferred_clearance ?? "",
    preferred_transport: from?.preferred_transport ?? "",
    prefered_liner: from?.prefered_liner ?? "",
  });
  console.log(state);
  const [portType, setPortType] = useState([]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const loadPortType = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownPortType`)
      .then((response) => {
        setPortType(response.data.data);
      })
      .catch((error) => {
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };
  useEffect(() => {
    loadPortType();
  }, []);
  const updatePort = () => {
    axios
      .post(
        `${API_BASE_URL}/${
          typeof state.port_id == "undefined" ? "addAirport" : "updateAirPort"
        }`,
        state
      )
      .then((response) => {
        toast[response.data.success == true ? "success" : "error"](
          response.data.message,
          {
            autoClose: 1000,
            theme: "colored",
          }
        );
        if (response.data.success == true) navigate("/airportnew");
      })
      .catch((error) => {
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };
  return (
    <Card
      title={`Port Management / ${state.port_id ? "Update" : "Create"} Form`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate createPackage">
                <form action="">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 form-group">
                      <h6>Port name </h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="port_name"
                            value={state.port_name}
                            onChange={handleChange}
                            placeholder="Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>Country </h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="port_country"
                            value={state.port_country}
                            onChange={handleChange}
                            placeholder="country"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>City</h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            placeholder="city"
                            name="port_city"
                            value={state.port_city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>Port Type</h6>
                      <select
                        value={state.port_type_id}
                        onChange={handleChange}
                        name="port_type_id"
                      >
                        {portType.map((item) => (
                          <option value={item.port_type_id}>
                            {item.port_type}
                          </option>
                        ))}
                      </select>
                    </div>
                    {state.port_type_id == 1 ? (
                      <>
                        <div className="col-lg-4 form-group">
                          <h6>IATA code</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder="code"
                                name="IATA_code"
                                value={state.IATA_code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>ICAO code</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder="code"
                                name="ICAO_Code"
                                value={state.ICAO_Code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Transportation </h6>

                          <ComboBox
                            options={transportation?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_transport}
                            onChange={(e) =>
                              setState({ ...state, preferred_transport: e })
                            }
                          />
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Customs</h6>

                          <ComboBox
                            options={clearance?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_clearance}
                            onChange={(e) =>
                              setState({ ...state, preferred_clearance: e })
                            }
                          />
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Liner </h6>

                          <ComboBox
                            options={linear?.map((v) => ({
                              id: v.liner_id,
                              name: v.liner_name,
                            }))}
                            value={state.prefered_liner}
                            onChange={(e) =>
                              setState({ ...state, prefered_liner: e })
                            }
                          />
                        </div>
                      </>
                    ) : state.port_type_id == 2 ? (
                      <>
                        <div className="col-lg-4 form-group">
                          <h6>Sea port code</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder="code"
                                name="Seaport_code"
                                value={state.Seaport_code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Transportation </h6>

                          <ComboBox
                            options={transportation?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_transport}
                            onChange={(e) =>
                              setState({ ...state, preferred_transport: e })
                            }
                          />
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Customs</h6>

                          <ComboBox
                            options={clearance?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_clearance}
                            onChange={(e) =>
                              setState({ ...state, preferred_clearance: e })
                            }
                          />
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>Preferred Liner </h6>

                          <ComboBox
                            options={linear?.map((v) => ({
                              id: v.liner_id,
                              name: v.liner_name,
                            }))}
                            value={state.prefered_liner}
                            onChange={(e) =>
                              setState({ ...state, prefered_liner: e })
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer">
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={updatePort}
              >
                {state.port_id ? "Update" : "Create"}
              </button>
              <Link className="btn btn-danger" to="/airportNew">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AirportCreate;
