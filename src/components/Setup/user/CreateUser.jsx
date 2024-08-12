import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Url/Url";
import { useQuery } from "react-query";

import React from "react";

const   CreateUser = () => {
  const navigate = useNavigate();

  const { data: SelectClient } = useQuery("getClientDataAsOptions");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [role, setRole] = useState("");
  const [client, setClient] = useState("");
  const [consignee, setConsignee] = useState("");
  const [status, setStatus] = useState("");
  const [permission, setPermission] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchConsignees = async () => {
    console.log(selectedClientId);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: selectedClientId,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

  useEffect(() => {
    if (selectedClientId) {
      fetchConsignees();
    }
  }, [selectedClientId]);

  const createForm = () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    // Use all individual states here as needed
    console.log({
      selectedClientId,
      consignee,
      status,
      permission,
      name,
      userName,
      password,
      confirmPassword,
    });
    axios
      .post(`${API_BASE_URL}/CreateUser`, {
        name: name,
        user_name: userName,
        client: selectedClientId,
        consignee: consignee,
        permission: permission,
        password: password,
        role: role,
        status: status,
      })
      .then((response) => {
        console.log(response);

        setRole("");
        setClient("");
        setConsignee("");
        setStatus("");
        setPermission("");
        setName("");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        toast.success("User Create Successfully");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 mb-4">
        <div className="card p-4">
          <div className="databaseTableSection pt-0">
            <div className="grayBgColor p-4 pt-2 pb-2">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="font-weight-bolder mb-0 pt-2">
                    User Management / Create Form
                  </h6>
                  {/* <i class="mdi mdi-view-headline"></i> */}
                </div>
              </div>
            </div>
            {/* End databaseTableSection */}
            <div className="top-space-search-reslute">
              <div className="tab-content p-4 pt-0 pb-0">
                <div className="tab-pane active" id="header" role="tabpanel">
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4"
                  >
                    {/*---------------------------table data---------------------*/}
                    <div className="d-flex exportPopupBtn" />
                   
                    <div className="formCreate">
                      <form action="">
                        <div className="row">
                          <div className="form-group col-lg-4">
                            <h6>Role</h6>
                            <select
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                               <option value="">Please select Role</option>
                              <option value="Client">Client</option>
                              <option value="Operation">Operation</option>
                              <option value="Sales">Sales</option>
                              <option value="Admin">Admin</option>
                              <option value="Shipping">Shipping</option>
                            </select>
                          </div>
                          <div className="form-group col-lg-4">
                            <h6>Select Client</h6>
                            <select
                              value={selectedClientId}
                              onChange={handleClientChange}
                            >
                              <option value="">Please select Client</option>
                              {SelectClient &&
                                SelectClient.map((client) => (
                                  <option
                                    key={client.client_id}
                                    value={client.client_id}
                                  >
                                    {client.client_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="form-group col-lg-4">
                            <h6>Consignee</h6>
                            <select
                              value={consignee}
                              onChange={(e) => setConsignee(e.target.value)}
                            >
                              <option value={0}>Please select consignee</option>
                              {consignees.map((consignee) => (
                                <option
                                  key={consignee.consignee_id}
                                  value={consignee.consignee_id}
                                >
                                  {consignee.consignee_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-lg-6">
                            <h6>Status</h6>
                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Banned">Banned</option>
                            </select>
                          </div>
                          <div className="form-group col-lg-6">
                            <h6>Permission</h6>
                            <select
                              value={permission}
                              onChange={(e) => setPermission(e.target.value)}
                            >
                              <option value="Label 2">Label 2</option>
                              <option value="Label 4">Label 4</option>
                              <option value="Label 6">Label 6</option>
                              <option value="Label 7">Label 7</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-lg-6">
                            <h6>Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="name"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-6">
                            <h6>Username</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="harry potter"
                              onChange={(e) => setUserName(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-12">
                            <h6> Password</h6>
                            <input
                              type="password"
                              className="form-control"
                              placeholder={123456}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-12">
                            <h6> Confirm Password</h6>
                            <input
                              type="password"
                              className="form-control"
                              placeholder={123456}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    {/*--------------------------- table data end--------------------------------*/}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    onClick={createForm}
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                  >
                    Create
                  </button>
                  <a className="btn btn-danger" href="#">
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
