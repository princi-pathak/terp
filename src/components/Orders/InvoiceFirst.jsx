import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from "../../assets/logoT.jpg";
import "../../components/Orders/order/PdfSec.css";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";

const InvoiceFirst = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState("CIF");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [invoiceData, setInvoiceData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [messageSet, setMassageSet] = useState("");
  const [messageSet1, setMassageSet1] = useState("");
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/invoice_procedure`, {
        Invoice_id: from?.Invoice_id,
      })
      .then((response) => {
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
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }

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
        setCompanyAddress(response?.data?.Company_Address);
        setData(from);

        setTableData(response?.data?.InvoiceDetails);
        setTotalDetails(response?.data?.TotalDetails);
        setHeaderData(response?.data?.invoice_header);
        setInvoiceData(response?.data?.invoice_total);
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
      doc.text(`Invoice ${data.Invoice_number}`, 130, 9.5);
      // rect end
      // order part

      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: `${data.Order_number}` },
        { label: "TT Ref :", value: `${data.Shipment_ref}` },
        { label: "PO Number", value: `${data.Client_reference}` },
        { label: "AWB :", value: `${headerData?.bl}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 94.5;
        const valueXLeft = 123;

        // Split the value text if it exceeds maxWidth
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);

        // Print the label
        doc.text(item.label, labelXLeft, yLeft);

        // Print the value, split into multiple lines if needed
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
        });

        // Increment y to move to the next section
        yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
      });

      // Second part (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthRight = 32; // Maximum width in pixels
      let yRight = 16;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements
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
      const textDataRight = [
        { label: "Date:", value: `${formatDate(data.created)}` },
        { label: "Due Date : ", value: "" },
        { label: "Ship Date :", value: `${headerData?.Ship_date}` },
        { label: "Delivery By :", value: `${messageSet1}` },
      ];
      textDataRight.forEach((item) => {
        const labelXRight = 155;
        const valueXRight = 175;
        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);
        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });
        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });
      // **********************************************
      // client
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(7, 33, 96, 7, "FD");
      // doc.setFont('Helvetica');
      doc.text("Client", 50, 37.5);
      // consignee
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(106, 33, 96, 7, "FD");
      // Place text inside the rectangle
      doc.text("Consignee", 145, 37.5);
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
      let startY1 = 45;
      const lineHeight1 = 4.2;
      doc.setFont("Helvetica");
      // doc.setFontSize(11);
      const longText1_1 =
        selectedInvoice === "Consignee"
          ? `${data?.Consignee_name} (${data?.consignee_tax_number})`
          : `${data.Client_name} (${data.client_tax_number})`;
      const longText1_2 =
        selectedInvoice === "Consignee"
          ? `${data?.client_address}`
          : `${data?.consignee_address}`;
      const longText1_3 =
        selectedInvoice === "Consignee"
          ? `${data?.client_email} / ${data?.client_phone}`
          : `${data?.consignee_email}/${data?.consignee_phone}`;
      //     const longText1_2 = `${data?.client_address}`;
      // const longText1_3 = `${data?.client_email} / ${data?.client_phone}`;

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
      let startY2 = 45;
      const lineHeight2 = 4.2;
      const longText2_1 = `${data?.Consignee_name}(${data?.consignee_tax_number})`;
      const longText2_2 = `${data?.consignee_address}`;
      const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;
      doc.setFontSize(11);

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
    };

    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 68;

    // Sample table data
    const formatterThree = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
    });
    const formatterNo = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const rows = !itemDetails
      ? tableData.map((item, index) => ({
        index: index + 1,
        net_weight: formatterThree.format(item.net_weight),
        Number_of_boxes: formatterNo.format(item.Number_of_boxes),
        Packages: formatterNo.format(item.Packages),
        ITF_name: item.ITF_name,
        itf_quantity: formatterThree.format(item.itf_quantity),
        itf_unit_name: item.itf_unit_name,
        Final_Price: useAgreedPricing
          ? item.Price_displaye
          : item.Final_Price,
        Line_Total: useAgreedPricing
          ? newFormatter.format(item.final_Line_Total)
          : newFormatter.format(item.Line_Total),
      }))
      : tableData.map((item, index) => ({
        index: index + 1,
        net_weight: formatterThree.format(item.net_weight),
        Number_of_boxes: formatterNo.format(item.Number_of_boxes),
        Packages: formatterNo.format(item.Packages),
        ITF_name:
          !item.customize_Custom_Name && item.ITF_name
            ? item.ITF_name
            : item.customize_Custom_Name && item.ITF_name
              ? item.ITF_name
              : item.customize_Custom_Name,
        itf_quantity: formatterThree.format(item.itf_quantity),
        itf_unit_name: item.itf_unit_name,
        Final_Price: useAgreedPricing
          ? item.Price_displaye
          : item.Final_Price,
        Line_Total: useAgreedPricing
          ? newFormatter.format(item.final_Line_Total)
          : newFormatter.format(item.Line_Total),
      }));

    doc.autoTable({
      head: [
        [
          "#",
          "N.W (KG)",
          "Box",
          "Packages",
          "Item Detail",
          "QTY",
          "Unit",
          "Unit Price",
          "Line Total",
        ],
      ],
      body: rows.map((row) => [
        row.index,
        row.net_weight, // Ensure Thai text displays correctly
        row.Number_of_boxes,
        row.Packages,
        row.ITF_name,
        row.itf_quantity,
        row.itf_unit_name,
        row.Final_Price,
        row.Line_Total,
      ]),
      startY: yTop, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "center" },
        7: { halign: "right" },
        8: { halign: "right" },
      },
      tableWidth: "auto",
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [32, 55, 100],
      },
      didParseCell: function (data) {
        if (data.section === "body") {
          // Apply alternate row coloring
          const rowIndex = data.row.index;
          if (rowIndex % 2 === 0) {
            data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
          } else {
            data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
          }
        }
      },
    });
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
    doc.text(
      "Total Box : ",
      7,
      finalY + 1
    );
    doc.text(`${formatterNo.format(totalDetails?.total_box)}`, 35, finalY + 1)
    doc.text(
      "Total Packages :",
      7,
      finalY + 5.5
    );
    doc.text(`${formatterNo.format(totalDetails?.packages)}`, 35, finalY + 5.5)
    doc.text(
      "Total Items :",
      7,
      finalY + 10
    );
    doc.text(`${formatterNo.format(totalDetails?.Items)}`, 35,
      finalY + 10
    )
    if (exchangeRate) {
      doc.text(
        "Exchange Rate : ",
        7,
        finalY + 14.5
      );
      doc.text(`${newFormatter.format(data?.fx_rate)}`, 35, finalY + 14.5);
    }
    doc.text(
      `Total Net Weight : `,
      75,
      finalY + 1
    );
    doc.text(`${formatterThree.format(totalDetails?.Net_Weight)}`, 109, finalY + 1)
    if (cbm) {
      doc.text(
        "Total Gross Weight :",
        75,
        finalY + 5.5
      );
      doc.text(`${formatterNo.format(totalDetails?.Gross_weight)}`, 109, finalY + 5.5)
      doc.text("Total CBM : ", 75, finalY + 10);
      doc.text(`${totalDetails?.CBM}`, 109, finalY + 10)
    }
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
    // total part

    const MARGIN = 6.8;
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const xLeft = 147;
    const maxValueWidth = 50;
    function fitText(value, maxWidth) {
      let truncatedValue = value;
      while (doc.getTextWidth(truncatedValue) > maxWidth) {
        truncatedValue = truncatedValue.slice(0, -1);
      }
      return truncatedValue;
    }
    doc.setTextColor(0, 0, 0);
    const label = "Total";
    let value = useAgreedPricing ? `${newFormatter.format(invoiceData)}` : `${newFormatter.format(data?.CNF_FX)}`;

    value = fitText(value, maxValueWidth);
    const valueWidth = doc.getTextWidth(value);
    const xValue = PAGE_WIDTH - MARGIN - valueWidth;

    // Draw label and value
    doc.setFillColor(32, 55, 100);
    doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
    doc.text(label, xLeft, finalY + 1);
    doc.text(value, xValue, finalY + 1);

    // Setting the second label and value
    const label1 = "Discount";
    let value1 = useAgreedPricing ? `${newFormatter.format(invoiceData)}` : `${newFormatter.format(data?.CNF_FX)}`;
    value1 = fitText(value1, maxValueWidth);
    const valueWidth1 = doc.getTextWidth(value1);
    const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1;

    // Draw second label and value
    doc.setFillColor(32, 55, 100);
    doc.rect(xLeft, finalY + 8, 55.5, 0.2, "FD");
    doc.text(label1, xLeft, finalY + 6.5);
    doc.text(value1, xValue1, finalY + 6.5);

    // Setting the third label and value
    const label2 = "Payable";
    let value2 = "10700789.00";

    value2 = fitText(value2, maxValueWidth); // Ensure value fits within the max width
    const valueWidth2 = doc.getTextWidth(value2);
    const xValue2 = PAGE_WIDTH - MARGIN - valueWidth2; // Position value to the right side of the page

    // Draw third label and value
    doc.setFillColor(32, 55, 100);
    doc.rect(xLeft, finalY + 14, 55.5, 0.5, "FD");
    doc.text(label2, xLeft, finalY + 12.5);
    doc.text(value2, xValue2, finalY + 12.5);


    //note   
    const longText = messageSet;
    const textX = 7;
    const textY = finalY + 20;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(doc.splitTextToSize(longText, 201), textX, textY);

    doc.setDrawColor(32, 55, 100); // Set the color of the rectangle
    function drawRoundedRect(doc, x, y, width, height, radius) {
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, width, height, radius, radius);
    }

    // Example usage in your existing code
    const inputFieldValue = data?.NOTES;
    if (inputFieldValue && inputFieldValue.trim() !== "") {
      const inputX = 7; // Adjust as needed
      const inputY = finalY + 31; // Adjust as needed
      const inputWidth = 196; // Adjust as needed
      const padding = 5; // Adjust as needed
      const borderRadius = 1; // 5px border radius

      const textDimensions = doc.getTextDimensions(inputFieldValue);
      const inputHeight = textDimensions.h + padding * 2;

      doc.text("note :", 7, finalY + 29);
      drawRoundedRect(
        doc,
        inputX,
        inputY,
        inputWidth,
        inputHeight,
        borderRadius
      );
      doc.text(inputFieldValue, inputX + padding, inputY + padding); // Adjust position for padding
    }
    // Draw the value

    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };

    // Add page numbers
    addPageNumbers(doc);
    // Generate PDF Blob
    const pdfBlob = doc.output("blob");
    // Upload the PDF to the server
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Invoice_number || "default"}_Invoice_${formatDate(
        new Date()
      )}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Invoice_number}_Invoice_${formatDate(
            new Date()
          )}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  const newFormatter2 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const formatterNo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatterThree = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const handleChange = (event) => {
    setSelectedDeliveryTerm(event.target.value);
  };
  return (
    <div>
      <button
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
                        id="cif"
                        name="delivery_term"
                        value="CIF"
                        checked={selectedDeliveryTerm === "CIF"}
                        onChange={handleChange}
                      />
                      <label htmlFor="cif">CIF</label>
                      <input
                        type="radio"
                        id="cnf"
                        name="delivery_term"
                        value="CNF"
                        checked={selectedDeliveryTerm === "CNF"}
                        onChange={handleChange}
                      />
                      <label htmlFor="cnf">CNF</label>
                      <input
                        type="radio"
                        id="dap"
                        name="delivery_term"
                        value="DAP"
                        checked={selectedDeliveryTerm === "DAP"}
                        onChange={handleChange}
                      />
                      <label htmlFor="dap">DAP</label>
                      <input
                        type="radio"
                        id="fob"
                        name="delivery_term"
                        value="FOB"
                        checked={selectedDeliveryTerm === "FOB"}
                        onChange={handleChange}
                      />
                      <label htmlFor="fob">FOB</label>
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

export default InvoiceFirst;
