import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

// import { usePDF } from "react-to-pdf";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import logo from "../../assets/logoT.jpg";
import { API_BASE_URL } from "../../Url/Url";
const QuotationProforma = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [messageSet1, setMassageSet1] = useState("");
  const [messageSet, setMassageSet] = useState("");

  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/quotation_proforma`, {
        params: {
          quotation_id: from?.quotation_id,
        },
      })
      .then((response) => {
        console.log(response);
        setTableData(response?.data?.data);
        setTotalDetails(response?.data?.quotationFinance);
        setData(from);
        setCompanyAddress(response?.data?.Company_Address);
        setHeaderData(response?.data?.invoice_header);
        // setDetails(response.data.data || []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/quotation_delivery_terms`, {
        quotation_id: from?.quotation_id,
      })
      .then((response) => {
        if (response.data.success === true) {
          setMassageSet(response.data.message);
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet(error.response.data.message);
        }
      });
  };
  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/quotation_pdf_delivery_by  `, {
        quotation_id: from?.quotation_id,
      })
      .then((response) => {
        if (response.data.success === true) {
          setMassageSet1(response.data.message);
        }
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
        return false;
      });
  };
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/InvoicePdfDetails`, {
        order_id: from?.order_id,
        invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response.data);
        // setCompanyAddress(response?.data?.Company_Address);
        setData(from);

        setTableData(response?.data?.InvoiceDetails);
        setTotalDetails(response?.data?.TotalDetails);
        setHeaderData(response?.data?.invoice_header);
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
  console.log(data);
  useEffect(() => {
    pdfAllData();
    dynamicMessage();
    getOrdersDetails();
    delivery();
  }, []);
  const handleAgreedPricingChange = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
    pdfAllData();
  };
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    pdfAllData();
  };
  const handleAgreedPricingChange2 = (e) => {
    setCbm(e.target.checked);
    console.log(cbm);
    pdfAllData();
  };

  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
    pdfAllData();
  };
  const clearData = () => {
    setUseAgreedPricing(false);
    setItemDetails(false);
    setCbm(true);
    setExchangeRate(false);
    setSelectedInvoice("Client");
  };
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const { id } = useParams(); // Assuming 'id' is part of the route parameters
  // const { toPDF, targetRef } = usePDF({
  //     filename: `${from?.Invoice_number || "default"} Invoice ${formatDate(
  //         new Date()
  //     )}.pdf`,
  // });
  const tableRef = useRef();
  const submitAndCloseModal = () => {
    // toPDF();
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const totalPages = Math.ceil(
        pdfHeight / pdf.internal.pageSize.getHeight()
      );

      for (let i = 0; i < totalPages; i++) {
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -i * pdf.internal.pageSize.getHeight(),
          pdfWidth,
          pdfHeight
        );
        pdf.setFontSize(8);
        // Page number at the top right corner
        pdf.text(
          ` This documnet is  ${totalPages} Pages  (${
            i + 1
          } out of ${totalPages} )`,
          pdf.internal.pageSize.getWidth() - 57,
          4 // Adjust this value if you want it lower or higher from the top
        );
        if (i < totalPages - 1) {
          pdf.addPage();
        }
      }

      const filename = `${
        from?.Quotation_number || "default"
      } proforma ${formatDate(new Date())}.pdf`;
      pdf.save(filename);
    });
    //
    let modalElement = document.getElementById("exampleModalCustomization");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      setUseAgreedPricing(false);
      setItemDetails(false);
      setCbm(true);
      setExchangeRate(false);
      setSelectedInvoice("Client");
      modalInstance.hide();
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  return (
    <div>
      {/* <button type="button" onClick={toPDF} className="btn btn-primary mb-4">
        Download
      </button> */}
      <button
        className="btn btn-primary mb-4"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCustomization"
      >
        Download
      </button>
      {/* modal */}
      <div
        className="modal fade"
        id="exampleModalCustomization"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className=" modal-dialog  modalShipTo modalInvoice">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Invoice Modal
              </h1>
              <button
                onClick={clearData}
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
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6> Use Agreed pricing ?</h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={useAgreedPricing}
                            onChange={handleAgreedPricingChange}
                          />
                          <span>
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Use custom name? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={itemDetails}
                            onChange={handleAgreedPricingChange1}
                          />
                          <span>
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Show Gross weight and CBM ? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={cbm}
                            onChange={handleAgreedPricingChange2}
                          />
                          <span>
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal">
                      <h6>Invoice Name Can be -</h6>
                      <input
                        type="radio"
                        id="html1"
                        name="fav_language"
                        value="Client"
                        checked={selectedInvoice === "Client"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="html1">Client</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice === "Consignee"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="css1">Consignee</label>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Show exchange rate ? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={exchangeRate}
                            onChange={handleAgreedPricingChange3}
                          />
                          <span>
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal">
                      <h6>Delivery Terms - </h6>
                      <input
                        type="radio"
                        id="html"
                        name="fav_language"
                        defaultValue="HTML"
                      />
                      <label htmlFor="html">CIF</label>
                      <input
                        type="radio"
                        id="css"
                        name="fav_language"
                        defaultValue="CSS"
                      />
                      <label htmlFor="css">CNF</label>
                      <input
                        type="radio"
                        id="javascript"
                        name="fav_language"
                        defaultValue="JavaScript"
                      />{" "}
                      <label htmlFor="javascript">DAP</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={submitAndCloseModal}
                className="btn btn-primary mb-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal end */}

      <div style={{ width: "792px" }} ref={tableRef}>
        <table className="proformaTable quotationPdf">
          <tbody style={{ width: "100%", display: "block" }}>
            <tr style={{ width: "100%", display: "block" }}>
              <td style={{ width: "100%", display: "block" }}>
                <table
                  style={{
                    width: "100%",
                    display: "block",
                    borderBottom: "4px solid #203764",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: 90,
                          padding: "0px 10px 0px 0px",
                          position: "relative",
                          top: "-10px",
                        }}
                      >
                        <img
                          crossOrigin="anonymous"
                          alt=""
                          src={logo}
                          style={{ height: 90, maxWidth: "unset" }}
                        />
                      </td>
                      <td style={{ width: "95%", padding: 0 }}>
                        <div style={{ display: "flex" }}>
                          <div
                            className="addressPara"
                            style={{ width: 300, padding: "0px 10px 0px 0px" }}
                          >
                            <h5 style={{ fontSize: 16, margin: 0 }}>
                              {companyAddress?.Line_1}
                            </h5>
                            <p style={{ marginTop: 0, whiteSpace: "normal" }}>
                              {companyAddress?.Line_2}
                            </p>
                            <p style={{ marginTop: 0, whiteSpace: "normal" }} />
                            {companyAddress?.Line_3}
                            <p style={{ marginTop: 0, whiteSpace: "normal" }} />
                            {companyAddress?.Line_4}
                          </div>
                          <div style={{ width: "50%" }}>
                            <div style={{ paddingTop: 0 }}>
                              <h5
                                style={{
                                  // textAlign: "center",
                                  fontSize: 18,
                                  position: "relative",
                                  lineHeight: "16px",
                                  paddingBottom: 12,
                                }}
                              >
                                Proforma Invoice
                              </h5>
                            </div>
                            <table className="orderInvoiceTab">
                              <tbody>
                                <tr>
                                  <td>
                                    <div
                                      className="totalSpaceBot"
                                      style={{ display: "flex" }}
                                    >
                                      <div
                                        style={{ marginRight: 10, width: 100 }}
                                      >
                                        <p>
                                          <strong>Order</strong>
                                        </p>
                                      </div>
                                      <div style={{ width: 10 }}>
                                        <strong>:</strong>
                                      </div>
                                      <div>
                                        <p> {from?.Quotation_number}</p>
                                      </div>
                                    </div>

                                    <div
                                      className="totalSpaceBot"
                                      style={{ display: "flex", marginTop: 0 }}
                                    >
                                      <div
                                        style={{ marginRight: 10, width: 100 }}
                                      >
                                        <p>
                                          {" "}
                                          <strong>Loading Date</strong>{" "}
                                        </p>
                                      </div>
                                      <div style={{ width: 10 }}>
                                        <strong>:</strong>
                                      </div>
                                      <div>
                                        <p />
                                        {formatDate(data.load_Before_date)}
                                      </div>
                                    </div>
                                    <div
                                      className="totalSpaceBot"
                                      style={{ display: "flex", marginTop: 0 }}
                                    >
                                      <div
                                        style={{ marginRight: 10, width: 100 }}
                                      >
                                        <p>
                                          <strong>Delivery By</strong>
                                        </p>
                                      </div>
                                      <div style={{ width: 10 }}>
                                        <strong>:</strong>
                                      </div>
                                      <div>
                                        <p> {messageSet1}</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: "100%", marginTop: 5 }}>
                  <tbody>
                    <tr style={{ width: "100%", display: "block" }}>
                      <td
                        style={{ padding: 0, width: "100%", display: "block" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            marginBottom: 5,
                          }}
                        >
                          <div
                            style={{
                              paddingTop: 0,
                              width: "50%",
                              marginRight: 5,
                            }}
                          >
                            <h5
                              style={{
                                fontSize: 18,
                                position: "relative",
                                top: "-3px",
                                paddingBottom: 2,
                              }}
                            >
                              Invoice to
                            </h5>
                          </div>
                          <div
                            style={{
                              width: "50%",
                              fontWeight: 500,
                            }}
                          >
                            <h5
                              style={{
                                paddingBottom: 2,
                                position: "relative",
                                top: "-3px",
                                fontSize: 18,
                              }}
                            >
                              Consignee Details
                            </h5>
                          </div>
                        </div>
                        <div className="retazParent">
                          <div style={{ marginLeft: "0px" }}>
                            <p>
                              {data?.client_name} ({data?.client_tax_number}){" "}
                            </p>
                            <p>{data?.client_address} </p>
                            <p>
                              {data?.client_email} / {data?.client_phone}
                            </p>
                          </div>
                          <div>
                            <p>
                              {data?.consignee_name} (
                              {data?.consignee_tax_number})
                            </p>
                            <p>{data?.consignee_address} </p>
                            <p>
                              {data?.consignee_email} / {data?.consignee_phone}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  className="tableBorder tableInvoiceFirst"
                  style={{ width: "100%", padding: 2 }}
                >
                  <tbody>
                    <tr className="darkTh invoiceFirst">
                      <th>
                        <p>#</p>
                      </th>
                      <th>
                        <p>Hs code</p>
                      </th>
                      <th>
                        <p>N.W (KG)</p>
                      </th>
                      <th style={{ width: 50 }}>
                        <p>Box</p>
                      </th>

                      <th style={{ textAlign: "left" }}>
                        <p>Item Detail</p>
                      </th>
                      <th style={{ width: 50 }}>
                        <p>QTY</p>
                      </th>
                      <th style={{ width: 69 }}>
                        <p>Unit</p>
                      </th>
                      <th>
                        <p>Unit Price</p>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <p>Line Total</p>
                      </th>
                    </tr>
                    {tableData?.map((item, index) => {
                      return (
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              paddingBottom: 13,
                              width: 20,
                            }}
                          >
                            {index + 1}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.HS_CODE}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.net_weight}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{formatter.format(item?.Number_of_boxes)}</p>
                          </td>

                          <td style={{ textAlign: "left" }}>
                            <p>{item?.itf_name_en}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.itf_quantity}</p>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <p>{item?.unit_name_en}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.calculated_price}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>
                              {newFormatter3.format(
                                item?.itf_quantity * item?.calculated_price
                              )}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table
                  className="totalBox proformaBottom"
                  style={{ marginTop: 0, width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="bottomTotalBox">
                            <div
                              className="totalSpaceBot"
                              style={{ display: "flex" }}
                            >
                              <div style={{ marginRight: 10, width: 130 }}>
                                <p>
                                  <strong>Total Box </strong>
                                </p>
                              </div>
                              <div style={{ width: 30 }}>
                                <strong>:</strong>
                              </div>
                              <div>
                                <p /> {totalDetails?.box}
                              </div>
                            </div>

                            <div
                              className="totalSpaceBot"
                              style={{ display: "flex" }}
                            >
                              <div style={{ marginRight: 10, width: 130 }}>
                                <p>
                                  {" "}
                                  <strong>Total Items </strong>{" "}
                                </p>
                              </div>
                              <div style={{ width: 30 }}>
                                <strong>:</strong>
                              </div>
                              <div>
                                <p>{totalDetails?.Items}</p>
                              </div>
                            </div>
                          </div>
                          <div style={{ marginLeft: 24 }}>
                            <div
                              className="totalSpaceBot"
                              style={{ display: "flex" }}
                            >
                              <div style={{ marginRight: 10, width: 130 }}>
                                <p>
                                  <strong>Total Net Weight</strong>
                                </p>
                              </div>
                              <div style={{ width: 20 }}>
                                <strong>:</strong>
                              </div>
                              <div>
                                <p>{totalDetails?.nw}</p>
                              </div>
                            </div>
                            <div
                              className="totalSpaceBot"
                              style={{ display: "flex" }}
                            >
                              <div style={{ marginRight: 10, width: 130 }}>
                                <p>
                                  {" "}
                                  <strong>Total Gross Weight </strong>{" "}
                                </p>
                              </div>
                              <div style={{ width: 20 }}>
                                <strong>:</strong>
                              </div>
                              <div>
                                <p>{totalDetails?.gw}</p>
                              </div>
                            </div>
                            <div
                              className="totalSpaceBot"
                              style={{ display: "flex" }}
                            >
                              <div style={{ marginRight: 10, width: 130 }}>
                                <p>
                                  <strong>Total CBM </strong>
                                </p>
                              </div>
                              <div style={{ width: 20 }}>
                                <strong>:</strong>
                              </div>
                              <div>
                                <p>{totalDetails?.cbm}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <table>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        color: "rgb(255, 255, 255)",
                                        padding: 0,
                                      }}
                                    >
                                      <div class="toatalThbTwo quoTotal">
                                        <div>
                                          <strong> TOTAL </strong>
                                        </div>
                                        <div>
                                          <p> {totalDetails?.CNF_FX}</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: "100%" }}>
                  <tr>
                    <td style={{ padding: 0 }}>
                      <div className="noteMessage">{messageSet}</div>
                      {/* Above mentioned products are Products of Thailand and
                      price is based on INTERCOM {selectedDeliveryTerm} in{" "}
                      {data.currency} {data.Airport} , {data.port_country} */}
                      {/* {data?.NOTES ? (
                        <>
                          <h3 style={{ fontWeight: 700 }}>Note :</h3>
                          <div className="noteRe">{data?.NOTES}</div>
                        </>
                      ) : (
                        ""
                      )} */}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationProforma;
