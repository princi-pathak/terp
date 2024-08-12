import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import {  useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";

const Receiving = () => {


  const navigate = useNavigate();

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/getViewToReceving`).then((res) => {
      setData(res.data.data || []);
    });
  }, []);
  // const { data } = useQuery("getViewToReceving");
  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        Header: "Code",
        accessor: "pod_code",
      },
      {
        Header: "Vender Name",
        accessor: "vendor",
      },
      {
        Header: "Name",
        accessor: "produce_name",
      },
     
      {
        Header: "Purchase Date",
        accessor: (r) => new Date(r.pod_received).toLocaleDateString(),
      },
      {
        Header: "Crates",
        accessor: "crates",
      },
      {
        Header: "Quantity",
        accessor: "qty_to_rcv",
      },
      {
        Header: "Unit",
        accessor: "unit",
      },
      {
        Header: "Price",
        accessor: "pod_price",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link state={{ from: a }} to="/acceptreceiving">
              <i
                className="mdi mdi-check"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </Link>
            {/* <button type="button">
              <i
                className="mdi mdi-restore"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button> */}
          </>
        ),
      },
    ],
    []
  );
  return (
    <Card title="Receive Management">
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default Receiving;
