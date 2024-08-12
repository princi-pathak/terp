import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";

const Users = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getAllUser = () => {
    axios.get(`${API_BASE_URL}/getAllUsers`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getAllUser();
  }, []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/deleteUser`, {
            user_id: id,
          });
          console.log(response);
          getAllUser();
          toast.success("Order delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  // const { data } = useQuery("getViewToReceving");
  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "index",
        accessor: (row, i) => i + 1,
      },
      {
        Header: "Username",
        accessor: "email",
      },
      {
        Header: "Company",
        accessor: "produce_name",
        Cell: () => "Siam Eats",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <>
            {/* <Link state={{ from: a }} to="/updateUser"> */}
            {/* <i
                className="mdi mdi-check"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              /> */}{" "}
            <div className="userIcon ">




            <Link to="/updateUser" state={{ from: a }}>
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
            
              <button type="button" onClick={() => deleteOrder(a.id)}>
                <i className="mdi mdi-delete " />
              </button>
              <Link to="/userResetPass" state={{ from: a }}>
                <i className=" ps-2 mdi mdi-restore" />
              </Link>
            </div>
            {/* </Link> */}
          </>
        ),
      },
    ],
    []
  );
  return (
    <Card
      title="User Management"
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
  );
};

export default Users;
