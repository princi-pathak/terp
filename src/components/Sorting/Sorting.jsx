import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";

const Sorting = () => {
  const { data: sorted, refetch } = useQuery("getSorting");
  const [data, setData] = useState([]);
  const [restoredRows, setRestoredRows] = useState([]);
console.log(sorted)
  const getSortData = () => {
    axios.get(`${API_BASE_URL}/getViewToSort`).then((res) => {
      console.log(res)
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getSortData();
  },[]);

  const restoreSorting = (id, id1) => {
    if (restoredRows.includes(id)) {
      return; // Do nothing if already restored
    }

    axios
      .post(`${API_BASE_URL}/restoreSorting`, {
        receiving_id: id,
        user_id: localStorage.getItem("id"),
        pod_code: id1,
      })
      .then((response) => {
        if (response?.data?.success == false) {
          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getSortData();
        }
        console.log(response);
        if (response?.data?.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getSortData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "pod_code",
      },
      {
        Header: "Vender Name",
        accessor: "Vendor_Name",
      },
      {
        Header: "Name",
        accessor: "produce",
      },
    
      {
        Header: "Crates",
        accessor: "cartes_to_sort",
      },
      {
        Header: "Quantity",
        accessor: "qty_to_sort",
      },
      {
        Header: "Unit",
        accessor: "Unit",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link state={{ from: a }} to="/newSorting">
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
            <button
              type="button"
              onClick={() => restoreSorting(a.receiving_id, a.pod_code)}
              disabled={restoredRows.includes(a.receiving_id)}
            >
              <i
                className="mdi mdi-restore"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>
          </>
        ),
      },
    ],
    [restoredRows]
  );

  return (
    <Card title="Sorting Management">
      <TableView columns={columns} data={data || []} />
    </Card>
  );
};

export default Sorting;