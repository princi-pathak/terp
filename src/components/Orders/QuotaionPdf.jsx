import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/logoNew.png";
import { useLocation, useParams } from "react-router-dom";

import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const ProformaInvoice = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/QuotationPDF`, {
        quotation_id: from?.quotation_id,
      })
      .then((response) => {
        console.log(response);
        setCompanyAddress(response?.data?.Company_Address);
        setData(from);
        setTableData(response?.data?.quotationDetails);
        setTotalDetails(response?.data?.quotationFinance);
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
  const generatePdf = async () => {
    const doc = new jsPDF();
    // Convert image to base64
    const convertImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
      });
    };
    // Add a logo with Proforma Address and Proforma Invoice
    const addLogoWithDetails = async () => {
      const logoData = await convertImageToBase64(logo);
      doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
      // logo end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress?.Line_3}`;
      const maxWidthOne = 59;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // end company
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(95, 5, 107, 7, "FD");
      // Place text inside the rectangle
      doc.text("Quotations", 130, 9.5);
      // rect end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Quotation :", 95, 16);
      doc.text("date :", 95, 20);
      doc.text("Valid Before :", 95, 24);
      doc.text("Min Weight :", 95, 28);
      doc.text(`${data?.Quotation_number}`, 117, 16);
      doc.text(`${formatDate(data?.created)}`, 117, 20);
      doc.text(`${data?.load_Before_date}`, 117, 24);
      doc.text(`${totalDetails[0]?.nw}`, 117, 28);
      doc.text("Destination:", 143, 16);
      doc.text("Origin:", 143, 20);
      doc.text("Liner:", 143, 24);
      // doc.text("Destination:",143,28)
      doc.text(`${data?.port_name}`, 165, 16);
      doc.text("Thailand", 165, 20);
      doc.text("Sellers'Choice", 165, 24);
      // ******************
      // client
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(7, 30, 96, 7, "FD");
      doc.text("Client", 50, 35);
      // consignee
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(106, 30, 96, 7, "FD");
      // Place text inside the rectangle
      doc.text("Consignee", 145, 35);
      // client under text
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      function renderWrappedText1(
        doc,
        text,
        startX,
        startY,
        maxWidth,
        lineHeight
      ) {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, startX, startY + index * lineHeight);
        });
        return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
      }

      function renderWrappedText2(
        doc,
        text,
        startX,
        startY,
        maxWidth,
        lineHeight
      ) {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, startX, startY + index * lineHeight);
        });
        return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
      }
      // First set of texts
      const maxWidth1 = 92;
      const startX1 = 8;
      let startY1 = 42;
      const lineHeight1 = 4.2;
      const longText1_1 = `${from.client_name}(${from.client_tax_number})`;
      const longText1_2 = `${from?.client_address}`;
      const longText1_3 = `${from?.client_email} / ${from?.client_phone}`;
      startY1 = renderWrappedText1(
        doc,
        longText1_1,
        startX1,
        startY1,
        maxWidth1,
        lineHeight1
      );
      doc.setFontSize(10);
      startY1 = renderWrappedText1(
        doc,
        longText1_2,
        startX1,
        startY1,
        maxWidth1,
        lineHeight1
      );
      startY1 = renderWrappedText1(
        doc,
        longText1_3,
        startX1,
        startY1,
        maxWidth1,
        lineHeight1
      );
      // Consignee detail
      const maxWidth2 = 92;
      const startX2 = 107;
      let startY2 = 42;
      const lineHeight2 = 4.2;
      const longText2_1 = `${from?.consignee_name}(${from?.consignee_tax_number})`;
      const longText2_2 = `${from?.consignee_address}`;
      const longText2_3 = `${from?.consignee_email}/${from?.consignee_phone}`;
      startY2 = renderWrappedText2(
        doc,
        longText2_1,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
      doc.setFontSize(10);
      startY2 = renderWrappedText2(
        doc,
        longText2_2,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
      startY2 = renderWrappedText2(
        doc,
        longText2_3,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
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

    await addLogoWithDetails(); // Wait for logo and details to be added

    // Sample table data
    const columns = [
      { header: "#", dataKey: "index" },
      { header: "Item", dataKey: "ITF_Name" },
      { header: "Scientific Name", dataKey: "ITF_Scientific_name",colSpan: 3 },
      { header: "Hs Code", dataKey: "ITF_HSCODE" },
      { header: "Price", dataKey: "quotation_price" },
      { header: "Unit", dataKey: "Unit_price"  },
    ];

    const rows = tableData.map((item, index) => ({
      index: index + 1,
      ITF_Name: item.ITF_Name,
      ITF_Scientific_name: item.ITF_Scientific_name,
      ITF_HSCODE: item.ITF_HSCODE,
      quotation_price: item.quotation_price,
      Unit_price: item.Unit_price,
    }));

    // Calculate total height needed for the table
    const rowHeight = 10; // Assuming each row height is 10 (adjust as needed)
    const tableHeight = rows.length * rowHeight;

    // Define startY dynamically
    const pageHeight = doc.internal.pageSize.height;
    const startY = (pageHeight - tableHeight) / 2; // Center the table vertically on the page

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startX: 0, // Start the table from the left edge
      startY: 68, // Adjusted startY to position below the company address section
      margin: {
        left: 9,
        right: 9,
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "left", cellWidth: 55 },
        2: { halign: "left", cellWidth: 50 },
        3: { halign: "center", },
        4: { halign: "right" },
        5: { halign: "center" },
      },
      tableWidth: 193, // Make the table width adjust to the available space
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255],
        halign: "center" // Set the header text color
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: [32, 55, 100] // Border color
      },
    });
    // Custom page number function
    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };
    // Add page numbers
    addPageNumbers(doc);
    // Add page numbers
    addPageNumbers(doc);

    // Generate PDF as a Blob
    const pdfBlob = doc.output("blob");
    // Create a Blob URL
    const blobUrl = URL.createObjectURL(pdfBlob);
    // Open the PDF in a new tab with a custom filename
    const fileName = `${from?.Quotation_number || "default"
      } Quotation ${formatDate(new Date())}.pdf`;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
    // Clean up the Blob URL
    URL.revokeObjectURL(blobUrl);
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
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
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCustomization"
      >
        Generate PDF
      </button>
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
                      <h6>Do you want image ? </h6>
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
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={generatePdf}
                className="btn btn-primary mb-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoice;
