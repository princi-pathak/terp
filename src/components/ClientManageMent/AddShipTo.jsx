import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import ChartConsi from "./ChartConsi";
const AddShipTo = () => {
  const location = useLocation();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [consigeeDetails, setconsigeeDetails] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  console.log(selectedItemId);
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const getCongineeDetails = () => {
    axios
      .post(`${API_BASE_URL}/getConsigneeStatistics`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        // setData(res.data.data);
        setconsigeeDetails(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getCongineeDetails();
  }, []);
  const handleSubmit = async () => {
    const payload = {
      client_id: from?.client_id,
      consignee_id: from?.consignee_id,
      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getConsigneeStatement`,
        payload
      );
      console.log(response);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      // Handle the response data as needed
      setFromDate("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };

  const [state, setState] = useState({
    consignee_id: from?.consignee_id || "",
    CODE: from?.CODE || "",
    brand: from?.brand || "",
    client_id: from?.client_id || "",
    consignee_name: from?.consignee_name || "",
    consignee_tax_number: from?.consignee_tax_number || "",
    consignee_email: from?.consignee_email || "",
    consignee_phone: from?.consignee_phone || "",
    consignee_address: from?.consignee_address || "",
    Default_location: from?.Default_location || "",
    currency: from?.currency || "",
    port_of_orign: from?.port_of_orign || "",
    destination_port: from?.destination_port || "",
    Commission_Currency: from?.Commission_Currency || "FX",
    liner_Drop: from?.liner_Drop || "",
    profit: from?.profit || "",
    rebate: from?.rebate || "",
    commission: from?.commission || "",
    commission_value: from?.commission_value || "",
    notify_name: from?.notify_name || "",
    notify_tax_number: from?.notify_tax_number || "",
    notify_email: from?.notify_email || "",
    notify_phone: from?.notify_phone || "",
    notify_address: from?.notify_address || "",
    user_id: localStorage.getItem("id"),
    // bank_name: from?.bank_name || "",
    // account_name: from?.account_name || "",
    // account_number: from?.account_number || "",
    client_bank_account: from?.bank_name || "",
    client_bank_name: from?.account_name || "",
    client_bank_number: from?.account_number || "",
  });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? (checked ? "THB" : "FX") : value;
    setState((prevState) => ({
      ...prevState,
      [name]: name === "Commission_Currency" && value === "" ? "FX" : newValue,
    }));
  };
  const [dataCustomization, setDataCustomization] = useState({
    Consignee_id: from?.consignee_id || "",
    ITF: "",
    Custom_Name: "",
    Dummy_Price: "",
  });
  const { data: brands } = useQuery("getBrand");
  const { data: client } = useQuery("getAllClients");
  const { data: getItf } = useQuery("getItf");
  console.log(getItf);
  const { data: port } = useQuery("getAllAirports");
  const { data: liner } = useQuery("getLiner");
  const { data: commission } = useQuery("getDropdownCommissionType");
  const { data: locations } = useQuery("getLocation");
  const { data: contactType } = useQuery("DropdownContactType ");
  const [state1, setState1] = useState({
    client_id: "",
    contact_type_id: "",
    contact_id: "",
    consignee_id: from?.consignee_id || "", // Assuming you want to capture this in the form as well
    first_name: "",
    last_name: "",
    position: "",
    Email: "",
    mobile: "",
    landline: "",
    birthday: "",
    Notes: "",
    Nick_name: "",
  });
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setState1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setDataCustomization((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { data: currency } = useQuery("getCurrency");
  const [data, setData] = useState([]);
  const [customization, setCustomization] = useState([]);

  const getAllContact = () => {
    axios
      .post(`${API_BASE_URL}/getContactList`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        setData(res.data.data || []);
      });
  };
  const getAllCustomization = () => {
    axios
      .post(`${API_BASE_URL}/getConsigneeCustomization`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        setCustomization(res.data.data || []);
      });
  };
  useEffect(() => {
    getAllContact();
    getAllCustomization();
  }, []);

  const submitCustomizationData = () => {
    console.log(dataCustomization);
    axios
      .post(
        `${API_BASE_URL}/createConsigneeCustomize`,
        dataCustomization // Use the updated state directly
      )
      .then((response) => {
        console.log(response);
        toast.success("Customization Data Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        getAllCustomization();
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
        let modalElement = document.getElementById("exampleModalCustomization");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const update = () => {
    axios
      .post(
        `${API_BASE_URL}/${from?.consignee_id ? "updateConsignee" : "createConsignee"
        }`,
        state // Use the updated state directly
      )
      .then((response) => {
        navigate("/shipToNew");
        toast.success("Updated", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const customizationDataSubmit = (e) => {
    console.log(dataCustomization);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateConsigneeCustomize`, dataCustomization)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Customize Update  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // Close the modal
        getAllCustomization();
        let modalElement = document.getElementById(
          "exampleModalCustomizationEdit"
        );
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Clear the form fields
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const contactDataSubmit = (e) => {
    console.log(state1);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/addContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // Close the modal
        let modalElement = document.getElementById("exampleModalContact");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Clear the form fields
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  const contactDetailsEdit = (e) => {
    console.log(state1);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact Update Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });

        // Close the modal
        let modalElement = document.getElementById("exampleModalEdit");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  const handleEditClick = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = data?.find((item) => item.contact_id === id);

    setState1((prevData) => ({
      ...prevData,
      client_id: selectedUser?.client_id || "",
      contact_type_id: selectedUser?.contact_type_id || "",
      consignee_id: selectedUser?.consignee_id || "",
      contact_id: contactId,
      first_name: selectedUser?.first_name || "",
      last_name: selectedUser?.last_name || "",
      position: selectedUser?.position || "",
      Email: selectedUser?.Email || "",
      mobile: selectedUser?.mobile || "",
      landline: selectedUser?.landline || "",
      birthday: selectedUser
        ? new Date(selectedUser.birthday).toISOString().split("T")[0]
        : "",
      Notes: selectedUser?.Notes || "",
      Nick_name: selectedUser?.Nick_name || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  const handleEditClickCustomization = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = customization?.find((item) => item.Id === id);
    console.log(selectedUser);
    setDataCustomization((prevData) => ({
      ...prevData,
      Consignee_Customize_id: contactId || "",
      ITF: selectedUser?.ITF || "",
      Custom_Name: selectedUser?.Custom_Name || "",
      Dummy_Price: selectedUser?.Dummy_Price || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  console.log(state.Commission_Currency);
  return (
    <Card
      title={`Consignee To / ${from?.consignee_id ? "Update" : "Create"} Form`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="first-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#first-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="first-tab-pane"
                >
                  Details
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                >
                  Contact
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                >
                  Customization
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="notify-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#notify-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="notify-tab-pane"
                >
                  Statistics
                </button>
              </li>

              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#contact-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="contact-tab-pane"
                  aria-selected="false"
                >
                  Accounting
                </button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="first-tab-pane"
                role="tabpanel"
                aria-labelledby="first-tab"
                tabindex="0"
              >
                <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                >
                  <div className="formCreate">
                    <form action="">
                      <div className="row">
                        <div className="form-group col-lg-3">
                          <h6> Client</h6>

                          <div className=" ">
                            <select
                              name="client_id"
                              onChange={handleChange}
                              value={state.client_id}
                            >
                              <option value="">Select Client</option>
                              {client?.map((item) => (
                                <option value={item.client_id}>
                                  {item.client_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Code</h6>
                          <input
                            type="text"
                            name="CODE"
                            className="w-full"
                            value={state.CODE}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Name</h6>
                          <input
                            type="text"
                            name="consignee_name"
                            className="w-full"
                            value={state.consignee_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Tax Number</h6>
                          <input
                            type="text"
                            className="w-full"
                            name="consignee_tax_number"
                            value={state.consignee_tax_number}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Email</h6>
                          <input
                            type="email"
                            className="w-full"
                            name="consignee_email"
                            value={state.consignee_email}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Phone Number</h6>
                          <input
                            type="text"
                            className="w-full"
                            name="consignee_phone"
                            value={state.consignee_phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-4">
                          <h6> Brand</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.brand}
                              name="brand"
                              onChange={handleChange}
                            >
                              <option value="">Select Brand</option>
                              {brands?.map((item) => (
                                <option value={item.brand_id}>
                                  {item.Brand_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-lg-3">
                          <h6> Location</h6>

                          <div className="ceateTransport">
                            <select
                              value={state.Default_location}
                              name="Default_location"
                              onChange={handleChange}
                            >
                              <option value="">Select Location</option>
                              {locations?.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Port of origin</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.port_of_orign}
                              name="port_of_orign"
                              onChange={handleChange}
                            >
                              <option value="">Select Airport</option>
                              {port?.map((item) => (
                                <option value={item.port_id}>
                                  {item.port_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Port of Destination</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.destination_port}
                              name="destination_port"
                              onChange={handleChange}
                            >
                              <option value="">Select Airport</option>
                              {port?.map((item) => (
                                <option value={item.port_id}>
                                  {item.port_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Airline</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.liner_Drop}
                              name="liner_Drop"
                              onChange={handleChange}
                            >
                              <option value="">Please Select Airline</option>
                              {liner?.map((item) => (
                                <option value={item.liner_id}>
                                  {item.liner_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6> Invoice Currency</h6>

                          <div className="ceateTransport">
                            <select
                              value={state.currency}
                              name="currency"
                              onChange={handleChange}
                            >
                              <option value="">Select Location</option>
                              {currency?.map((item) => (
                                <option value={item.currency_id}>
                                  {item.currency}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Markup </h6>
                          <div className="parentShip">
                            <div className="markupShip">
                              <input
                                type="number"
                                value={state.profit}
                                name="profit"
                                onChange={handleChange}
                              />
                            </div>
                            <div className="shipPercent">
                              <span>%</span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>Rebate</h6>
                          <div className="parentShip">
                            <div className="markupShip">
                              <input
                                type="number"
                                value={state.rebate}
                                name="rebate"
                                onChange={handleChange}
                              />
                            </div>
                            <div className="shipPercent">
                              <span>%</span>
                            </div>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6> Commission</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.commission}
                              name="commission"
                              onChange={handleChange}
                            >
                              <option value="">Select Commission</option>
                              {commission?.map((item) => (
                                <option value={item.id}>
                                  {item.commission_name_en}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Commission Value</h6>
                          <input
                            type="number"
                            className="w-full"
                            value={state.commission_value}
                            name="commission_value"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4 shipToToggle">
                          <h6>Commission Currency</h6>
                          <label
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                            className="toggleSwitch large"
                          >
                            <input
                              type="checkbox"
                              checked={state.Commission_Currency === "THB"}
                              onChange={handleChange}
                              name="Commission_Currency"
                            />
                            <span>
                              <span>FX</span>
                              <span> THB</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6> Delivery terms Incoterms</h6>
                          <div className="ceateTransport">
                            <select>
                              <option value="">
                                Select Delivery terms Incoterms
                              </option>

                              <option>option1</option>
                              <option>option2</option>
                              <option>option3</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-12">
                          <h6>Address</h6>
                          <textarea
                            name="consignee_address"
                            className="border-2 rounded-md border-[#203764] w-full"
                            onChange={handleChange}
                            value={state.consignee_address}
                          />
                        </div>

                        <div className="row">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            Notify
                          </h6>

                          <div className="form-group col-lg-6">
                            <h6> Name</h6>

                            <input
                              type="text"
                              className="form-control"
                              value={state.notify_name}
                              name="notify_name"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group col-lg-6">
                            <h6>Tax Number</h6>
                            <input
                              type="text"
                              className="form-control"
                              value={state.notify_tax_number}
                              name="notify_tax_number"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group col-lg-6">
                            <h6> Email</h6>
                            <input
                              type="email"
                              className="form-control"
                              value={state.notify_email}
                              name="notify_email"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group col-lg-6">
                            <h6> Phone Number</h6>
                            <input
                              type="text"
                              className="form-control"
                              value={state.notify_phone}
                              name="notify_phone"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group col-lg-12">
                            <h6>Address</h6>
                            <textarea
                              className="border-2 rounded-md border-[#203764] w-full"
                              value={state.notify_address}
                              name="notify_address"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        {/* <div className="col-lg-12">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            Bank Informations
                          </h6>
                          <div className="row ">
                            <div className="form-group col-lg-4">
                              <h6>Bank Name</h6>

                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="bank_name"
                                className="form-control"
                                placeholder="axis "
                                value={state.bank_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Name</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="account_name"
                                className="form-control"
                                placeholder="xxxxx "
                                value={state.account_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Number</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="account_number"
                                className="form-control"
                                placeholder="3345345435 "
                                value={state.account_number}
                              />
                            </div>
                          </div>
                        </div> */}
                        <div className="col-lg-12">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            Bank Informations
                          </h6>
                          <div className="row ">
                            <div className="form-group col-lg-4">
                              <h6>Bank Name</h6>

                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_account"
                                className="form-control"
                                placeholder="axis "
                                value={state.client_bank_account}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Name</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_name"
                                className="form-control"
                                placeholder="xxxxx "
                                value={state.client_bank_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Number</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_number"
                                className="form-control"
                                placeholder="3345345435 "
                                value={state.client_bank_number}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      className="btn btn-primary"
                      onClick={update}
                      type="button"
                    >
                      {from?.consignee_id ? "Update" : "Create"}
                    </button>
                    <Link className="btn btn-danger" to="/shipToNew">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="home-tab-pane"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Nick Name</th>
                      <th>Position </th>
                      <th>Type</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Action</th>
                    </tr>

                    {data?.map((item) => {
                      return (
                        <tr>
                          <td>{item.first_name}</td>
                          <td>{item.last_name}</td>
                          <td>{item.Nick_name}</td>
                          <td>{item.position}</td>
                          <td>{item.type}</td>
                          <td>{item.Email}</td>
                          <td>{item.mobile}</td>
                          <td>
                            <div class="editIcon">
                              {/* edit popup */}
                              <button
                                type="button"
                                onClick={() => handleEditClick(item.contact_id)}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalEdit"
                              >
                                {" "}
                                <i class="mdi mdi-pencil"></i>
                                {/* edit popup */}
                              </button>
                              <div
                                class="modal fade"
                                id="exampleModalEdit"
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modalShipTo modal-xl">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h1
                                        class="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Contact Update
                                      </h1>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <i class="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="formCreate">
                                        <form action="">
                                          <div className="row">
                                            <div className="col-lg-12">
                                              <div class="form-group col-lg-3">
                                                <h6>Client </h6>
                                                <div class="ceateTransport">
                                                  <select
                                                    name="client_id"
                                                    onChange={handleChange1}
                                                    value={state1.client_id}
                                                  >
                                                    <option value="">
                                                      Select Client
                                                    </option>
                                                    {client?.map((item) => (
                                                      <option
                                                        key={item.client_id}
                                                        value={item.client_id}
                                                      >
                                                        {item.client_name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Contact Type </h6>
                                              <div class="ceateTransport">
                                                <select
                                                  name="contact_type_id"
                                                  onChange={handleChange1}
                                                  value={state1.contact_type_id}
                                                >
                                                  <option value="">
                                                    Select Type
                                                  </option>
                                                  {contactType?.map((item) => (
                                                    <option
                                                      key={item.contact_type_id}
                                                      value={
                                                        item.contact_type_id
                                                      }
                                                    >
                                                      {item.type_en}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6> First Name </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="first_name"
                                                  onChange={handleChange1}
                                                  value={state1.first_name}
                                                  placeholder="first name"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Last Name </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="last_name"
                                                  onChange={handleChange1}
                                                  value={state1.last_name}
                                                  placeholder="last name"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Nick Name</h6>
                                              <div>
                                                <input
                                                  type="text"
                                                  name="Nick_name"
                                                  onChange={handleChange1}
                                                  value={state1.Nick_name}
                                                  placeholder="nick name"
                                                />
                                              </div>
                                            </div>

                                            <div class="form-group col-lg-3">
                                              <h6>Position </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="position"
                                                  onChange={handleChange1}
                                                  value={state1.position}
                                                  placeholder="position"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Email</h6>
                                              <div class=" ">
                                                <input
                                                  type="email"
                                                  name="Email"
                                                  onChange={handleChange1}
                                                  value={state1.Email}
                                                  placeholder="email"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Mobile</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="mobile"
                                                  onChange={handleChange1}
                                                  value={state1.mobile}
                                                  placeholder="mobile"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Landline</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="landline"
                                                  onChange={handleChange1}
                                                  value={state1.landline}
                                                  placeholder="landline"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-4">
                                              <h6>Birthday</h6>
                                              <div>
                                                <input
                                                  type="date"
                                                  name="birthday"
                                                  onChange={handleChange1}
                                                  value={state1.birthday}
                                                  placeholder="birthday"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-8">
                                              <h6>Notes</h6>
                                              <div>
                                                <textarea
                                                  name="Notes"
                                                  onChange={handleChange1}
                                                  value={state1.Notes}
                                                  cols="30"
                                                  rows="5"
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                    <div class="modal-footer justify-center">
                                      <button
                                        onClick={contactDetailsEdit}
                                        type="button"
                                        class="btn btn-primary mb-0"
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* edit popup end */}
                              <i class="mdi mdi-delete "></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <div className="row">
                  <Link
                    style={{ width: "170px" }}
                    className="btn btn-danger mb-4"
                    to="/"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalContact"
                  >
                    Add Contact
                  </Link>
                  {/* modal */}
                  <div
                    class="modal fade"
                    id="exampleModalContact"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modalShipTo modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Contact
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i class="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div class="form-group col-lg-3">
                                    <h6>Client </h6>
                                    <div class="ceateTransport">
                                      <select
                                        name="client_id"
                                        onChange={handleChange1}
                                        value={state1.client_id}
                                      >
                                        <option value="">Select Client</option>
                                        {client?.map((item) => (
                                          <option
                                            key={item.client_id}
                                            value={item.client_id}
                                          >
                                            {item.client_name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Contact Type </h6>
                                  <div class="ceateTransport">
                                    <select
                                      name="contact_type_id"
                                      onChange={handleChange1}
                                      value={state1.contact_type_id}
                                    >
                                      <option value="">Select Type</option>
                                      {contactType?.map((item) => (
                                        <option
                                          key={item.contact_type_id}
                                          value={item.contact_type_id}
                                        >
                                          {item.type_en}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6> First Name </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="first_name"
                                      onChange={handleChange1}
                                      value={state1.first_name}
                                      placeholder="first name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Last Name </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="last_name"
                                      onChange={handleChange1}
                                      value={state1.last_name}
                                      placeholder="last name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Nick Name</h6>
                                  <div>
                                    <input
                                      type="text"
                                      name="Nick_name"
                                      onChange={handleChange1}
                                      value={state1.Nick_name}
                                      placeholder="nick name"
                                    />
                                  </div>
                                </div>

                                <div class="form-group col-lg-3">
                                  <h6>Position </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="position"
                                      onChange={handleChange1}
                                      value={state1.position}
                                      placeholder="position"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Email</h6>
                                  <div class=" ">
                                    <input
                                      type="email"
                                      name="Email"
                                      onChange={handleChange1}
                                      value={state1.Email}
                                      placeholder="email"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Mobile</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="mobile"
                                      onChange={handleChange1}
                                      value={state1.mobile}
                                      placeholder="mobile"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Landline</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="landline"
                                      onChange={handleChange1}
                                      value={state1.landline}
                                      placeholder="landline"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-4">
                                  <h6>Birthday</h6>
                                  <div>
                                    <input
                                      type="date"
                                      name="birthday"
                                      onChange={handleChange1}
                                      value={state1.birthday}
                                      placeholder="birthday"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-8">
                                  <h6>Notes</h6>
                                  <div>
                                    <textarea
                                      name="Notes"
                                      onChange={handleChange1}
                                      value={state1.Notes}
                                      cols="30"
                                      rows="5"
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-primary mb-0"
                            onClick={contactDataSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* modal end */}
                </div>
              </div>
              {/* statics */}
              <div
                class="tab-pane fade"
                id="notify-tab-pane"
                role="tabpanel"
                aria-labelledby="notify-tab"
                tabindex="0"
              >
                <div className="statisticsContent">
                  <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card  ">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-calendar-range" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Date of First Shipment
                            </p>
                            <h4 className="mb-0">
                              {consigeeDetails?.First_Shipment}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +55%{" "}
                            </span>
                            than lask week
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-calendar-range" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Date of Last Shipment
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {consigeeDetails?.Last_Shipment}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +3%{" "}
                            </span>
                            than lask month
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-pipe" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {" "}
                              Shipments in Pipe Line{" "}
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {consigeeDetails?.Pipe_Line}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              -2%
                            </span>{" "}
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-weight" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Net Weigt Shipped
                            </p>
                            <h4 className="mb-0">
                              {consigeeDetails?.Total_NW}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-weight-gram" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Gross Weight Shipped
                            </p>
                            <h4 className="mb-0">
                              {consigeeDetails?.Total_GW}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Boxes Shipped
                            </p>
                            <h4 className="mb-0">
                              {consigeeDetails?.Total_Box}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-air-humidifier" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Top 5 Items Ordered
                            </p>
                            <h4 className="mb-0">
                              {/* {consigeeDetails?.Total_Box} */}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chartConsignee">
                    <ChartConsi />
                  </div>
                </div>
                <div className="card-footer text-center">
                  <Link className="btn btn-danger" to="/shipToNew">
                    Close
                  </Link>
                </div>
              </div>
              {/* customization */}
              <div
                class="tab-pane fade"
                id="profile-tab-pane"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th> ITF Name</th>
                      <th>Custom Name</th>
                      <th>Dummy Price</th>

                      <th>Action</th>
                    </tr>
                    {customization?.map((item) => {
                      return (
                        <tr>
                          <td>{item.itf_name_en}</td>
                          <td>{item.Custom_Name}</td>
                          <td>{item.Dummy_Price}</td>
                          <td>
                            <div class="editIcon">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditClickCustomization(item.Id)
                                }
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCustomizationEdit"
                              >
                                <i class="mdi mdi-pencil"></i>
                              </button>
                              {/* customixation modal */}
                              <div
                                className="modal fade"
                                id="exampleModalCustomizationEdit"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className=" modal-dialog modalShipTo">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Update customization
                                      </h1>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <i class="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="formCreate">
                                        <div className="row">
                                          <div className="form-group col-lg-12">
                                            <h6>ITF Name </h6>
                                            <div className="ceateTransport">
                                              <select
                                                name="ITF"
                                                onChange={handleChange2}
                                                value={dataCustomization.ITF}
                                              >
                                                <option value="">
                                                  Select ITF
                                                </option>
                                                {getItf?.map((item) => (
                                                  <option
                                                    key={item.itf_id}
                                                    value={item.itf_id}
                                                  >
                                                    {item.itf_name_en}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6> Custom Name </h6>
                                            <div className=" ">
                                              <input
                                                type="text"
                                                name="Custom_Name"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Custom_Name
                                                }
                                                placeholder="Custom Name"
                                              />
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6> Agreed price </h6>
                                            <div className=" ">
                                              <input
                                                type="number"
                                                name="Dummy_Price"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Dummy_Price
                                                }
                                                placeholder="Custom Name"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button "
                                        onClick={customizationDataSubmit}
                                        className="btn mb-0 btn-primary"
                                      >
                                        Update{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* customization modal end */}
                              <i class="mdi mdi-delete "></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <Link
                  style={{ width: "100px" }}
                  className="btn btn-danger mb-4"
                  to="/"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalCustomization"
                >
                  Add
                </Link>
                {/* customixation modal */}
                <div
                  className="modal fade"
                  id="exampleModalCustomization"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className=" modal-dialog  modalShipTo">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Add customization
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i class="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="formCreate">
                          <div className="row">
                            <div className="form-group col-lg-12">
                              <h6>ITF Name </h6>
                              <div className="ceateTransport">
                                <select
                                  name="ITF"
                                  onChange={handleChange2}
                                  value={dataCustomization.ITF}
                                >
                                  <option value="">Select ITF</option>
                                  {getItf?.map((item) => (
                                    <option
                                      key={item.itf_id}
                                      value={item.itf_id}
                                    >
                                      {item.itf_name_en}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6> Custom Name </h6>
                              <div className=" ">
                                <input
                                  type="text"
                                  name="Custom_Name"
                                  onChange={handleChange2}
                                  value={dataCustomization.Custom_Name}
                                  placeholder="Custom Name"
                                />
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6> Agreed price </h6>
                              <div className=" ">
                                <input
                                  type="number"
                                  name="Dummy_Price"
                                  onChange={handleChange2}
                                  value={dataCustomization.Dummy_Price}
                                  placeholder="Custom Name"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button "
                          onClick={submitCustomizationData}
                          className="btn mb-0 btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* customization modal end */}
              </div>
              {/* accounting */}
              <div
                class="tab-pane fade"
                id="contact-tab-pane"
                role="tabpanel"
                aria-labelledby="contact-tab"
                tabindex="0"
              >
                <div className="card-footer text-center d-flex justify-content-center">
                  {/* Button trigger modal */}
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modalState"
                  >
                    Statement
                  </button>
                  {/* Modal */}
                  <div
                    className="modal fade "
                    id="modalState"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modalShipTo">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Statement
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i className="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div className="modal-body">
                          <label htmlFor="fromDate">From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                          <label className="mt-2" htmlFor="toDate">
                            To Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="paymentSec">
                    <>
                      {/* Button trigger modal */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#modalPayment"
                      >
                        Payment
                      </button>
                      {/* Modal */}
                      <div
                        className="modal fade "
                        id="modalPayment"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modalShipTo  modal-xl">
                          <div className="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                Payment
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                <i class="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <form action="">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment">
                                      <p>Client Id</p>
                                      <div>
                                        <select name="" id="">
                                          <option value="0">
                                            select client Id
                                          </option>
                                          <option value="1">
                                            select client Id
                                          </option>
                                          <option value="2">
                                            select client Id
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Consignee Id</p>
                                      </div>
                                      <div>
                                        <select name="" id="">
                                          <option value="0">
                                            select Consignee Id
                                          </option>
                                          <option value="1">option 1</option>
                                          <option value="2">option 2</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Payment Date</p>
                                      </div>
                                      <div>
                                        <input type="date" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Client Payment Ref</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Payment Channel</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Bank Ref</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>FX Payment</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>FX Rate</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <p> FX Id</p>
                                      <div>
                                        <select name="" id="">
                                          <option value="0">
                                            234
                                          </option>
                                          <option value="1">
                                            4534
                                          </option>
                                          <option value="2">
                                            #435
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Intermittent Bank Charges</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Local Bank Charges</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>THB Received</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>Loss/Gain on Exchange Rate</p>
                                      </div>
                                      <div>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </form>
                              <div className="row mt-4" >
                                <div className="tableCreateClient tablepayment">
                                  <table>
                                    <tr>
                                      <th>Check</th>
                                      <th> Document Number</th>
                                      <th> Ship Date</th>
                                      <th>  AWB Number</th>
                                      <th> Net Amount</th>
                                      <th>Amount To Pay	</th>
                                      <th> Paid Amount</th>
                                    </tr>
                                    <tr>
                                      <td><input type="checkbox" /></td>
                                      <td> 34543</td>
                                      <td> 12/3/2024</td>
                                      <td> 99</td>
                                      <td> 67.00</td>
                                      <td> 4500</td>
                                      <td><input type="number" /></td>
                                    </tr>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                  <Link className="btn btn-danger">Claim List</Link>
                </div>
                <div className="statisticsContent">
                  <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card  ">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-package" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Shipments
                            </p>
                            <h4 className="mb-0">2323</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +55%{" "}
                            </span>
                            than lask week
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-invoice" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Invoices
                            </p>
                            <h4 className="mb-0">2/3/2023</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +3%{" "}
                            </span>
                            than lask month
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-cash" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {" "}
                              Total Payment{" "}
                            </p>
                            <h4 className="mb-0">3,462</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              -2%
                            </span>{" "}
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-credit-card-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Pending Payment
                            </p>
                            <h4 className="mb-0">103,430</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-weight-gram" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Claims
                            </p>
                            <h4 className="mb-0">103,430</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Profits
                            </p>
                            <h4 className="mb-0">103,430</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-air-humidifier" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              average Time of Payment{" "}
                            </p>
                            <h4 className="mb-0">103,430</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <Link className="btn btn-danger" to="/shipToNew">
                    Close
                  </Link>
                </div>
              </div>

              {/* accounting end */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddShipTo;
