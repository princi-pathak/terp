import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { TableView } from "../table";
import { Card } from "../../card";

const InventoryPackaging = () => {
  const [quantity, setQuantity] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedPodItem, setSelectedPodItem] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getInventoryList = () => {
    axios.get(`${API_BASE_URL}/getPackagingAvailable`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getInventoryList();
  }, []);
  
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  const inventoryBoxes = (unit_type, pod_item) => {
    setSelectedUnitType(unit_type);
    setSelectedPodItem(pod_item);
    setIsModalVisible(true);
    console.log(pod_item);
  };

  const updateBoxes = () => {
    axios
      .post(`${API_BASE_URL}/StockAdjustmentPB`, {
        user_id: localStorage.getItem("id"),
        type: selectedUnitType,
        item: selectedPodItem,
        qty_on_hand: quantity,
      })
      .then((response) => {
        setIsModalVisible(false);
        console.log(response);
        toast.success("Stock Adjustment Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
		getInventoryList();
		
        // Clear the quantity field after successful update
        setQuantity("");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Description",
        accessor: "Description",
      },
      {
        Header: "Item Name",
        accessor: "item_name",
      },
      {
        Header: "Unit Name",
        accessor: "unit_name",
      },
      {
        Header: "Quantity Available",
        accessor: "qty_available",
      },
      {
        Header: "Average Cost",
        accessor: "avg_cost",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon">
            <i className=" ps-2 mdi mdi-eye" />
            <button onClick={() => inventoryBoxes(a.unit_type, a.pod_item)}>
              <i
                className="ps-2 mdi mdi-pencil"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox"
              />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Card
        title="Available Packaging Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createUser")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>

      {/* Modal for Stock Adjustment */}
      {isModalVisible && (
        <div
          className="modal fade show"
          id="modalAdjustBox"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modalShipTo">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Stock Adjustment PB
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsModalVisible(false)}
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group col-lg-12 formCreate">
                  <h6>Quantity on hand</h6>
                  <div>
                    <input
                      type="text"
                      name="quantity"
                      value={quantity}
                      onChange={handleChange}
                      placeholder="124"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={updateBoxes}
                  className="btn mb-0 btn-primary"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryPackaging;
