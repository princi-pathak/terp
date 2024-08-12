import axios from "axios";
import React, { useEffect, useState } from "react";
import BarCode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";

const BoxesNew = () => {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(true);

  const [data, setData] = useState([]);

  const getBoxData = () => {
    axios
      .get(`${API_BASE_URL}/getAllBoxes`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };

  useEffect(() => {
    getBoxData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        id: "index",
        accessor: (_row, i) => i + 1,
      },
      {
        Header: "Name",
        accessor: "box_name",
      },

      {
        Header: "Code",
        accessor: (a) => (
          <div>
            <BarCode width={0.8} height={30} value={a.Inventory_code} />
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: (a) => (
          <>
            {" "}
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
              className="toggleSwitch large"
              onclick=""
            >
              <input
                onChange={() => setIsOn(!isOn)}
                type="checkbox"
                defaultChecked
              />
              <span>
                <span>OFF</span>
                <span>ON</span>
              </span>
              <a></a>
            </label>
          </>
        ),
      },
      {
        Header: "Actions",
        accessor: (a) => [
          <Link to="/updateBox" state={{ from: a }}>
            <i
              className="mdi mdi-pencil"
              style={{
                color: "#203764",
                fontSize: "30px",
                marginTop: "10px",
                paddingBottom: "8px",
              }}
            />
          </Link>,
          <Link>
            {" "}
            <i
              className="mdi mdi-delete"
              style={{
                color: "#203764",
                fontSize: "30px",
                marginTop: "10px",
                paddingBottom: "8px",
              }}
            />
          </Link>,
        ],
      },
      {
        Header: "Salary",
        accessor: (a) => <>100000</>,
      },
    ],
    []
  );

  return (
    <>
      <Card
        title="Boxes Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createBoxNew")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>
    </>
  );
};

export default BoxesNew;
