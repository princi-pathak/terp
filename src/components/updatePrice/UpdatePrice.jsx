import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { toast } from "react-toastify";

const UpdatePrice = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [availabilityOn, setAvailabilityOn] = useState([]);
  const [filteredAvailabilityOn, setFilteredAvailabilityOn] = useState([]);
  const [availabilityOff, setAvailabilityOff] = useState([]);
  const [filteredAvailabilityOff, setFilteredAvailabilityOff] = useState([]);

  const getProduce = () => {
    axios
      .get(`${API_BASE_URL}/GetProduceName`)
      .then((res) => {
        console.log(res.data.data);
        setAvailabilityOn(res.data.availability_on);
        setFilteredAvailabilityOn(res.data.availability_on);
        setAvailabilityOff(res.data.availability_off);
        setFilteredAvailabilityOff(res.data.availability_off);

        const updatedData = res.data.data.map((item) => ({
          ...item,
          Update_price: "", // Initialize Update_price to an empty string
        }));
        setData(updatedData);
        setSearchApiData(updatedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getProduce();
  }, []);

  const handleAvailabilityChange = (index, type) => (e) => {
    const updatedAvailability = [
      ...(type === "on" ? filteredAvailabilityOn : filteredAvailabilityOff),
    ];
    updatedAvailability[index].Available = e.target.checked ? 1 : 0;

    // Make API call with produce_id and availability status
    axios
      .post(`${API_BASE_URL}/updateProduceAvailability`, {
        produce_id: updatedAvailability[index].produce_id,
        Available: updatedAvailability[index].Available,
      })
      .then((response) => {
        getProduce();
        console.log("Availability update successful", response.data);
        toast.success("Availability update successful");
      })
      .catch((error) => {
        console.error("There was an error updating the availability!", error);
        toast.error("Availability update failed");
      });

    type === "on"
      ? setFilteredAvailabilityOn(updatedAvailability)
      : setFilteredAvailabilityOff(updatedAvailability);

    console.log(updatedAvailability);
  };

  const handlePriceChange = (index) => (e) => {
    const updatedData = [...data];
    updatedData[index].Update_price = e.target.value;
    setData(updatedData);
  };

  const handleUpdate = (item) => {
    console.log("Updating item:", item);
    axios
      .post(`${API_BASE_URL}/updatePrice`, {
        produce_id: item.produce,
        Update_price: item.Update_price,
        Available: item.Available,
        user: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log("Update successful", response.data);
        getProduce();
        toast.success("Update successful");
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
        toast.error("Update failed");
      });
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterValue(value);

    if (value === "") {
      setData(searchApiData);
      setFilteredAvailabilityOn(availabilityOn);
      setFilteredAvailabilityOff(availabilityOff);
    } else {
      const filteredData = searchApiData.filter((item) =>
        item.name.toLowerCase().includes(value)
      );

      const filteredOn = availabilityOn.filter((item) =>
        item.produce_name_en.toLowerCase().includes(value)
      );

      const filteredOff = availabilityOff.filter((item) =>
        item.produce_name_en.toLowerCase().includes(value)
      );

      setData(filteredData);
      setFilteredAvailabilityOn(filteredOn);
      setFilteredAvailabilityOff(filteredOff);
    }
  };

  return (
    <div>
      <main className="main-content">
        <div>
          <div className="px-0">
            <div className="row">
              <div className="col-lg-12 col-md-12 mb-4">
                <div className="bg-white">
                  <div className="databaseTableSection pt-0">
                    <div className="grayBgColor p-4 pb-2">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="font-weight-bolder mb-0 pt-2">
                            Update Price Management
                          </h6>
                        </div>
                        <div className="col-md-6">
                          <div className="exportPopupBtn create_btn_style"></div>
                        </div>
                      </div>
                    </div>

                    <div className="top-space-search-reslute">
                      <div className="tab-content px-2 md:!px-4">
                        <div className="parentProduceSearch">
                          <div>
                            <input
                              type="text"
                              placeholder="search"
                              value={filterValue}
                              onChange={handleFilter}
                            />
                          </div>
                        </div>
                        <div
                          className="tab-pane active"
                          id="header"
                          role="tabpanel"
                        >
                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                          >
                            <div className="d-flex exportPopupBtn"></div>
                            <table
                              id="example"
                              className="display updatePriceTable table table-hover table-striped borderTerpProduce"
                              style={{ width: "100%" }}
                            >
                              <thead>
                                <tr>
                                  <td>
                                    <div className="parentUpdate">
                                      <div
                                        className="childUpdate"
                                        style={{ width: "25%" }}
                                      >
                                        <th className="fiftyPer">
                                          <table className="table-striped">
                                            <tr>
                                              <th colSpan={2}>
                                                Produce Availability 0
                                              </th>
                                            </tr>
                                            {filteredAvailabilityOff.map(
                                              (item, index) => (
                                                <tr key={item.produce_id}>
                                                  <td>
                                                    {item.produce_name_en}
                                                  </td>
                                                  <td>
                                                    <label
                                                      className="toggleSwitch large"
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        padding: 10,
                                                      }}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        name="Commission_CurrencyNew"
                                                        checked={
                                                          item.Available === 1
                                                        }
                                                        onChange={handleAvailabilityChange(
                                                          index,
                                                          "off"
                                                        )}
                                                      />
                                                      <span>
                                                        <span>OFF</span>
                                                        <span> ON</span>
                                                      </span>
                                                      <a> </a>
                                                    </label>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </table>
                                        </th>
                                      </div>
                                      <div
                                        className="childUpdate"
                                        style={{ width: "25%" }}
                                      >
                                        <th className="fiftyPer">
                                          <table className="table-striped">
                                            <tr>
                                              <th colSpan={2}>
                                                Produce Availability 1
                                              </th>
                                            </tr>
                                            {filteredAvailabilityOn.map(
                                              (item, index) => (
                                                <tr key={item.produce_id}>
                                                  <td>
                                                    {item.produce_name_en}
                                                  </td>
                                                  <td>
                                                    <label
                                                      className="toggleSwitch large"
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        padding: 10,
                                                      }}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        name="Commission_CurrencyNew"
                                                        checked={
                                                          item.Available === 1
                                                        }
                                                        onChange={handleAvailabilityChange(
                                                          index,
                                                          "on"
                                                        )}
                                                      />
                                                      <span>
                                                        <span>OFF</span>
                                                        <span> ON</span>
                                                      </span>
                                                      <a> </a>
                                                    </label>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </table>
                                        </th>
                                      </div>
                                      <div className="childUpdate">
                                        <th className="fiftyPer">
                                          <table>
                                            <tr>
                                              <th
                                                style={{ textAlign: "left" }}
                                                colSpan={3}
                                              >
                                                Updated Price
                                              </th>
                                            </tr>
                                            {data.map((item, index) => (
                                              <tr key={item.produce}>
                                                <td>{item.name}</td>
                                                <td>
                                                  <div className="form-group col-lg-3 formCreate mt-0">
                                                    <input
                                                      className="mb-0 w-full"
                                                      style={{ width: "250px" }}
                                                      type="text"
                                                      name="Update_price"
                                                      value={
                                                        item.Update_price || ""
                                                      }
                                                      onChange={handlePriceChange(
                                                        index
                                                      )}
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="btnUpdate">
                                                    <button
                                                      onClick={() =>
                                                        handleUpdate(item)
                                                      }
                                                    >
                                                      Update
                                                    </button>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </table>
                                        </th>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                        <div className="tab-pane" id="menu" role="tabpanel">
                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="seperate-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatePrice;
