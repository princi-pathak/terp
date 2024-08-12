import React, { useState,useEffect } from "react";
import BarCode from "react-barcode";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../../card";
import { TableView } from "../../table";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
const ProduceNew = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      setData(res.data.data || []);
    });
  }, []);
  // const { data } = useQuery("getAllProduceItem")
  const [isOn, setIsOn] = useState(true);

  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        id: "index",
        accessor: (_row, i) => (
          <div style={{ marginTop: "10px" }}>{_row.produce_id}</div>
        ),
      },
      {
        Header: "Name",
        accessor: (a) => a.produce_name_en,
      },
      {
        Header: "Code",
        accessor: (a) => (
          <BarCode width={0.8} height={30} value={a.Inventory_code} />
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
        accessor: (a) => (
          <Link to="/updateProduce" state={{ from: a }}>
            <i
              i
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                marginTop: "10px",
                paddingTop: "8px",
                fontSize: "22px",
              }}
            />
          </Link>
        ),
      },

      {
        Header: "Salaries",
        accessor: (a) => <div style={{ marginTop: "10px" }}>{"10000000"}</div>,
      },
    ],
    []
  );
  return (
    <>
      <Card
        title={"Produce Items"}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/produceCreateNew")}
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

export default ProduceNew;
