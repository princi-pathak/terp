import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { toast } from "react-toastify";
const CurrencyExchange = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // State to track number of entries per page
  const getAllFx = () => {
    axios
      .get(`${API_BASE_URL}/GetFxRate`)
      .then((res) => {
        console.log(res);
        setData(res.data.data);
        setSearchApiData(res.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getAllFx();
  }, []);

  const handleAvailabilityChange = (index) => (e) => {
    const updatedData = [...data];
    updatedData[index].Available = e.target.checked ? 1 : 0;
    setData(updatedData);
  };

  const handlePriceChange = (index) => (e) => {
    const updatedData = [...data];
    updatedData[index].fx_rate = e.target.value;
    setData(updatedData);
  };

  const handleUpdate = (item) => {
    // Implement the update logic, possibly an API call to update the item in the backend
    console.log("Updating item:", item);
    axios
      .post(`${API_BASE_URL}/updateFxRateHistory`, {
        fx_id: item.fx_id,
        fx_rate: item.fx_rate,
      })
      .then((response) => {
        getAllFx();

        console.log("Update successful", response.data);
        toast.success("Update successful");
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
        toast.error("Update failed");
      });
  };

  const handleFilter = (event) => {
    if (event.target.value === "") {
      setData(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        const fullName = `${item.currency_name}`.toLowerCase();
        // Check if the full name includes the search value
        return fullName.includes(event.target.value.toLowerCase());
      });
      setData(filterResult);
    }
    setFilterValue(event.target.value);
  };
  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value)); // Convert to number
  };
  return (
    <div>
      <div className="container-fluid">
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
                                Currency Exchange Update
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="top-space-search-reslute">
                          <div className="tab-content px-2 md:!px-4">
                            <div className="parentProduceSearch">
                              <div className="entries">
                                <small>Show</small>{" "}
                                <select
                                  value={entriesPerPage}
                                  onChange={handleEntriesChange}
                                >
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>{" "}
                                <small>entries</small>
                              </div>
                              <div>
                                <input
                                  type="search"
                                  placeholder="search"
                                  value={filterValue}
                                  onChange={(e) => handleFilter(e)}
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
                                <div className="d-flex exportPopupBtn" />
                                <table
                                  id="example"
                                  className="display updatePriceTable table table-hover table-striped borderTerpProduce"
                                  style={{ width: "50%" }}
                                >
                                  <thead>
                                    <tr>
                                      <th className="fiftyPer">
                                        <table>
                                          <tbody>
                                            <tr>
                                              <th
                                                colSpan={3}
                                                style={{ textAlign: "left" }}
                                              >
                                                Updated Price
                                              </th>
                                            </tr>
                                            {data
                                              .slice(0, entriesPerPage) // Slice the data based on entriesPerPage
                                              .map((item, index) => (
                                                <tr>
                                                  <td>{item.currency_name}</td>
                                                  <td>
                                                    <div className="form-group col-lg-3 formCreate mt-0">
                                                      {" "}
                                                      <input
                                                        className="mb-0 w-full"
                                                        name="fx_rate"
                                                        value={
                                                          item.fx_rate || ""
                                                        }
                                                        onChange={handlePriceChange(
                                                          index
                                                        )}
                                                        style={{ width: 250 }}
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
                                          </tbody>
                                        </table>
                                      </th>
                                    </tr>
                                  </thead>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
