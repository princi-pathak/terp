import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import { TableView } from "../table";

const Invoice = () => {
  const navigate = useNavigate();
  // const { data, refetch } = useQuery("getOrders");
  const [quantity, setQuantity] = useState("");
  const [invoiceID, setInvoiceId] = useState("");
  const [invoiceID1, setInvoiceId1] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [invImage, setInvImage] = useState(null);

  const handleFileChangeInv = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvImage(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const [notes, setNotes] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [data, setData] = useState([]);
  const allInvoiceData = () => {
    axios.get(`${API_BASE_URL}/invoiceDetailsList`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    allInvoiceData();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data: liner } = useQuery("getLiner");
  const [id, setID] = useState(null);
  const dataFind = useMemo(() => {
    return data?.find((v) => +v.order_id == +id);
  }, [id, data]);
  const form = useForm({
    defaultValues: {
      Liner: dataFind?.Freight_liner || "",
      journey_number: dataFind?.Freight_journey_number || "",
      bl: dataFind?.Freight_bl || "",
      Load_date:
        new Date(dataFind?.Freight_load_date || null)
          .toISOString()
          .split("T")[0] || "",
      Load_time: dataFind?.Freight_load_time || "",
      Ship_date:
        new Date(dataFind?.Freight_ship_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETD: dataFind?.Freight_etd || "",
      Arrival_date:
        new Date(dataFind?.Freight_arrival_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETA: dataFind?.Freight_eta || "",
    },
    onSubmit: async ({ value }) => {
      if (dataFind?.order_id) {
        try {
          await axios.post(`${API_BASE_URL}/updateOrderFreight`, {
            order_id: dataFind?.order_id,
            ...value,
          });
          toast.success("Order update successfully");
          refetch();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
      closeModal();
    },
  });
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleChange2 = (e) => {
    setNotes(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };
  const openModal = (id = null) => {
    setID(id);
    form.reset();
    setIsOpenModal(true);
  };
  const deleteOrder = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/deleteOrder`, { id: id });
          toast.success("Order delete successfully");
          refetch();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const quotationConfirmation = async (Invoice_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/invoiceLoader`, {
        Invoice_id: Invoice_id,

        // Other data you may need to pass
      });
      console.log("API response:", response);
      allInvoiceData();
      toast.success("invoice  Loaded successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to invoice  Loaded");
    }
  };
  const inventoryBoxes = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };
  const inventoryAirplane = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };

  const handleChange1 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a PDF file.");
      setSelectedFile(null);
    }
  };
  const handleChange21 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile1(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a PDF file.");
      setSelectedFile1(null);
    }
  };
  const uploadData = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceAdjustWeight`, {
        Invoice_id: invoiceID,
        Port_weight: quantity,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("modalAdjustBox");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Invoice Adjustment  Weight Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setQuantity("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const uploadData1 = () => {
    if (!selectedFile) {
      setErrorMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("Invoice_id", invoiceID);
    formData.append("document", selectedFile);

    axios
      .post(`${API_BASE_URL}/InvoiceShipped`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let modalElement = document.getElementById("modalAdjustBox1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Call Invoice Shipped Successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile(null); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const uploadData2 = () => {
    if (!selectedFile1) {
      setErrorMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("Invoice_id", invoiceID);
    formData.append("document", selectedFile1);

    axios
      .post(`${API_BASE_URL}/InvoiceShipped`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let modalElement = document.getElementById("modalAdjustBox3");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Call Invoice Shipped Successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile1(null); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const quotationCopy = (Invoice_id) => {
    setInvoiceId1(Invoice_id);
  };

  const dataSubmit = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceNotes`, {
        invoice_id: invoiceID1,
        notes: notes,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModal2");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Invoice Note Updated Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setNotes("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const restoreEanPackage = (id) => {
    axios
      .post(`${API_BASE_URL}/cancle_invoice`, {
        Invoice_id: id,
      })
      .then((response) => {
        if (response.status === 400) {
          allInvoiceData();

          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        } else if (response.status === 200) {
          allInvoiceData();

          toast.success("Invoice cancel successful", {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          allInvoiceData();

          toast.warn("Something went wrong", {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Invoice Number",
        accessor: "Invoice_number",
      },
      {
        Header: "Order Number",
        accessor: "Order_number",
      },
      {
        Header: "Shipment Ref",
        accessor: "Shipment_ref",
      },
      {
        Header: "ConsigneeName",
        accessor: "Consignee_name",
      },
      {
        Header: "Client Ref",
        accessor: "Client_reference",
      },
      {
        Header: "AWB/BL",
        accessor: "bl",
      },

      {
        Header: "Ship Date",
        accessor: (a) =>
          `${new Date(a.Ship_date).getDate().toString().padStart(2, "0")}-${(
            new Date(a.Ship_date).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(a.Ship_date).getFullYear()}`,
      },
      {
        Header: "Status",
        accessor: (a) => ({ 2: "Confirmed" }[a.Status] || "Pending"),
      },

      {
        Header: "Action",
        accessor: (a) => (
          <div className="editIcon">
            <Link to=" " state={{ from: { ...a, isReadOnly: true } }}></Link>
            <Link to="/invoiceview" state={{ from: { ...a } }}>
              <i className="mdi mdi-eye" />
            </Link>
            {+a.Status !== 2 && (
              <>
                <Link to="/invoice_edit" state={{ from: { ...a } }}>
                  <i className="mdi mdi-pencil" />
                </Link>
                <button
                  type="button"
                  onClick={() => restoreEanPackage(a.Invoice_id)}
                >
                  <i className="mdi mdi-restore" />
                </button>
              </>
            )}
            <Link
              className="SvgAnchor"
              to="/custom_invoice_pdf"
              state={{ from: { ...a } }}
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                
                viewBox="0 0 24 24"
              >
                <title>alpha-c-box-outline</title>
                <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M5,5V19H19V5H5M11,7H13A2,2 0 0,1 15,9V10H13V9H11V15H13V14H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7Z"></path>
              </svg>
            </Link>
            <Link
              className="SvgAnchor"
              to="/invoice_pdf"
              state={{ from: { ...a } }}
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>invoice-text-check-outline</title>
                <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
              </svg>
            </Link>
            {/* <button onClick={invoiceFirstpdf}>
            <i className="mdi mdi-file-account-outline" />
            </button> */}
            {/* <i className="mdi mdi-note-outline" title="Notes" /> */}
            <Link className="SvgAnchor" to="/packing_list_pdf" state={{ from: { ...a } }}>
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>package-variant-closed</title>
                <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"></path>
              </svg>
            </Link>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
              onClick={() => quotationCopy(a.Invoice_id)}
            >

              <i className="mdi mdi-note-outline" />
            </button>
            {+a.Status == 0 && (
              <button
                type="button"
                onClick={() => quotationConfirmation(a.Invoice_id)}
              >
                {" "}
                <i
                  className="mdi mdi-check"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
            )}
            {+a.Status == 1 && (
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox"
                type="button"
                onClick={() => inventoryBoxes(a.Invoice_id)}
              >
                {/* <i className="ps-2 mdi mdi-pencil" /> */}
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>truck-check-outline</title>
                  <path d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17C19.5 16.17 18.83 15.5 18 15.5C17.17 15.5 16.5 16.17 16.5 17C16.5 17.83 17.17 18.5 18 18.5M19.5 9.5H17V12H21.46L19.5 9.5M6 18.5C6.83 18.5 7.5 17.83 7.5 17C7.5 16.17 6.83 15.5 6 15.5C5.17 15.5 4.5 16.17 4.5 17C4.5 17.83 5.17 18.5 6 18.5M20 8L23 12V17H21C21 18.66 19.66 20 18 20C16.34 20 15 18.66 15 17H9C9 18.66 7.66 20 6 20C4.34 20 3 18.66 3 17H1V6C1 4.89 1.89 4 3 4H17V8H20M3 6V15H3.76C4.31 14.39 5.11 14 6 14C6.89 14 7.69 14.39 8.24 15H15V6H3M5 10.5L6.5 9L8 10.5L11.5 7L13 8.5L8 13.5L5 10.5Z" />
                </svg>
              </button>
            )}
            {+a.Status == 2 && (
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox1"
                type="button"
                onClick={() => inventoryBoxes(a.Invoice_id)}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>airport</title>
                  <path d="M14.97,5.92C14.83,5.41 14.3,5.1 13.79,5.24L10.39,6.15L5.95,2.03L4.72,2.36L7.38,6.95L4.19,7.8L2.93,6.82L2,7.07L3.66,9.95L14.28,7.11C14.8,6.96 15.1,6.43 14.97,5.92M21,10L20,12H15L14,10L15,9H17V7H18V9H20L21,10M22,20V22H2V20H15V13H20V20H22Z" />
                </svg>
              </button>
            )}
            {+a.Status == 4 && (
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox1"
                type="button"
                onClick={() => inventoryBoxes(a.Invoice_id)}
              >
                <i class="mdi mdi-download"></i>
              </button>
            )}
            {+a.Status == 3 && (
              <button
                onClick={() => inventoryAirplane(a.Invoice_id)}
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox3"
                type="button"
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>airplane-check</title>
                  <path d="M15.97 13.83C15.08 14.35 14.34 15.09 13.82 16L11.55 11.63L7.66 15.5L8 18L6.95 19.06L5.18 15.87L2 14.11L3.06 13.05L5.54 13.4L9.43 9.5L2 5.62L3.41 4.21L12.61 6.33L16.5 2.44C17.08 1.85 18.03 1.85 18.62 2.44C19.2 3.03 19.2 4 18.62 4.56L14.73 8.45L15.97 13.83M21.34 15.84L17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84Z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#modalClaim"
            >
              <svg className="SvgQuo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>text-box-minus</title><path d="M22,17V19H14V17H22M12,17V15H7V17H12M17,11H7V13H14.69C13.07,14.07 12,15.91 12,18C12,19.09 12.29,20.12 12.8,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V12.8C20.12,12.29 19.09,12 18,12L17,12.08V11M17,9V7H7V9H17Z" /></svg>

            </button>
            {/* Modal */}
            <div
              className="modal fade"
              id="modalClaim"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Claim
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
                    <div className="claimParent">
                      <div><strong>Invoice Number : </strong> <span>INV-202407019</span> </div>
                      <div><strong>Client :</strong> <span>Finley DWC-LLC</span> </div>
                      <div><strong>Ship To :</strong> <span> Cape Fresh Industries LLC</span> </div>
                      <div><strong>Currency :  </strong> <span>USD</span> </div>
                      <div><strong>Items Info : </strong> <span>USD</span> </div>

                    </div>
                    <div className="uploadFileMain">
                      <div>
                        <p>
                          <strong>Claim Date</strong>
                        </p>
                        <input type="date" />
                      </div>
                      <div className="uploadFile">
                        <p><strong>Upload</strong></p>
                        <div className="parentInsideUp">
                          <div>
                            <input type="file" accept="image/*" onChange={handleFileChangeInv} />
                          </div>
                          {invImage && (
                            <div>
                              <img src={invImage} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="tableClaim">
                      <table>
                        <tr>
                          <th>ITF</th>
                          <th>Brand Name</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Number Box</th>
                          <th>Claim Quantity</th>
                          <th>Unit</th>
                          <th>Amount</th>
                          {/* <th>Upload</th> */}
                        </tr>
                        <tr>
                          <td>Papaya Holland - Kg x 3 (Frutulip)</td>
                          <td>None</td>
                          <td>16.00</td>
                          <td>KG</td>
                          <td>32.000</td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>


                        </tr>
                        <tr>
                          <td>Lemongrass - 500g (38cm) x 20 (F)	1,600.00</td>
                          <td>None</td>
                          <td>16.00</td>
                          <td>KG</td>
                          <td>32.000</td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>
                          {/* <td><img src={imageOne} alt="" /></td> */}
                        </tr>
                        <tr>
                          <td>Lemongrass - 500g (38cm) x 20 (F)	1,600.00</td>
                          <td>None</td>
                          <td>16.00</td>
                          <td>KG</td>
                          <td>32.000</td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>
                          <td><input type="number" /></td>
                          {/* <td><img src={imageOne} alt="" /></td> */}

                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                    // onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [data, form]
  );
  // const invoiceFirstpdf=()=>{
  //   navigate("/invoicefirsttpdf")
  // }
  return (
    <>
      <Card
        title="Invoice Management"
      // endElement={
      // <button
      //   type="button"
      //   onClick={() => navigate("")}
      //   className="btn button btn-info"
      // >
      //   Create
      // </button>
      // }
      >
        <TableView columns={columns} data={data} />
      </Card>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Invoice Adjust Weight
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Invoice Adjust Weight</h6>
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
                onClick={uploadData}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                Call Invoice Shipped
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Upload Pdf</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange1}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData1}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog InvoiceModal">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Set Invoice Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <textarea
                value={notes}
                onChange={handleChange2}
                placeholder="Type Notes Here"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={dataSubmit}
                className="btn btn-primary"
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalAdjustBox3"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                Upload Invoice Shipe
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Upload Pdf</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange21}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile1 && <p>Selected file: {selectedFile1.name}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData2}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
