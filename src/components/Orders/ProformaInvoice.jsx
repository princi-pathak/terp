import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/logoT.jpg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";

const ProformaInvoice = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [messageSet, setMassageSet] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const [messageSet1, setMassageSet1] = useState("");
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/order_delivery_terms`, {
        Order_id: from?.order_id,
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
      .post(`${API_BASE_URL}/pdf_delivery_by`, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response.status);
        if (response.data.success === true) {
          setMassageSet1(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }
        return false;
      });
  };

  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/proformaMain_Order`, {
        params: {
          order_id: from?.order_id,
        },
      })
      .then((response) => {
        console.log(response);
        setTableData(response?.data?.orderDetails);
        setTotalDetails(response?.data?.orderFinancialDetails);
        setData(from);
        setCompanyAddress(response?.data?.Company_Address);
        setHeaderData(response?.data?.invoice_header);
      })
      .catch((e) => {
        console.log(e);
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
        setData(from);
        setHeaderData(response?.data?.invoice_header);
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };
  useEffect(() => {
    pdfAllData();
    getOrdersDetails();
    dynamicMessage();
    delivery();
  }, []);
  const generatePdf = async () => {
    const doc = new jsPDF();
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

    const addLogoWithDetails = async () => {
      const logoData = await convertImageToBase64(logo);
      doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
      // logo end
      doc.setFontSize(12);
      doc.setTextColor("#0000");
      doc.text(`${companyAddress.Line_1}`, 30, 8);
      doc.setFontSize(10);
      doc.setTextColor("#0000");
      doc.text(`${companyAddress.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // doc.setFontSize(10);
      // doc.setTextColor("#7b809a");
      // doc.text(`${companyAddress.Line_1}`, 70, 10);
      // doc.text(`${companyAddress.Line_2}`, 70, 15);
      // const splitText = doc.splitTextToSize(companyAddress.Line_3, 55);
      // doc.text(splitText, 70, 20);
      // doc.text(`${companyAddress.Line_4}`, 70, 26);
      doc.setFontSize(12);
      doc.setTextColor("#0000");
      doc.text(`Proforma Invoice`, 127, 7.5);
      doc.setFontSize(10);
      doc.setTextColor("#0000");
      doc.text(`Order: ${data?.Order_number}`, 127, 12);
      doc.text(`TT Ref: ${data.Shipment_ref}`, 127, 16.5);
      doc.text(`Loading Date: ${formatDate(data.load_date)}`, 127, 20);
      doc.text(`Delivery By: ${messageSet1}`, 127, 24.5);
    };
    doc.setFillColor("#203764");
    doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(12);
    doc.setTextColor("#0000");
    doc.setFontSize(12);
    doc.text("Invoice to", 7, 31.5);
    doc.text("Consignee Details", 127.2, 31.5);

    doc.setFillColor("#203764");
    // doc.rect(7, 32.5, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(11);
    doc.setTextColor("#0000");
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
    const maxWidth1 = 72;
    const startX1 = 7;
    let startY1 = 36.3;
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
    const maxWidth2 = 72;
    const startX2 = 127.2;
    let startY2 = 36.2;
    const lineHeight2 = 4.2;
    doc.setFontSize(11);

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

    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 65;
    const columns = [
      { header: "#", dataKey: "index" },
      { header: "Hs code", dataKey: "hs_code" },
      { header: "N.W (KG)", dataKey: "net_weight" },
      { header: "Box", dataKey: "Number_of_boxes" },
      { header: "Item Detail", dataKey: "ITF_Name" },
      { header: "QTY", dataKey: "itf_quantity" },
      { header: "Unit", dataKey: "Unit_Name" },
      { header: "Unit Price", dataKey: "Final_Price" },
      { header: "Line Total", dataKey: "line_total" },
    ];
    const rows = tableData.map((item, index) => ({
      index: index + 1,
      hs_code: item.hs_code,
      net_weight: `${formatterNg.format(item.net_weight)}`,
      Number_of_boxes: `${formatterNo.format(item.Number_of_boxes)}`,
      ITF_Name: item.ITF_Name,
      itf_quantity: `${formatterNg.format(item.itf_quantity)}`,
      Unit_Name: item.Unit_Name,
      Final_Price: `${formatterNg.format(item.Final_Price)}`,
      line_total: (item?.line_total).toFixed(2),
    }));

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startY: yTop,
      headStyles: {
        fillColor: "#203764",
        textColor: "#FFFFFF",
      },
      pageBreak: "auto",
      bodyStyles: { valign: "top" },
      styles: {
        overflow: "linebreak",
      },
      columnStyles: {
        2: { halign: "right" }, // Right align the FOB column (index 6)
        3: { halign: "center" }, // Right align the FOB column (index 6)
        5: { halign: "right" }, // Right align the FOB column (index 6)
        7: { halign: "right" }, // Right align the FOB column (index 6)
        8: { halign: "right" }, // Right align the FOB column (index 6)
      },
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto",
      headStyles: {
        fillColor: "#203764", // Set the header background color
        textColor: "#FFFFFF", // Set the header text color
      },

      styles: {
        textColor: "#000000", // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: "#203764", // Border color
      },
    });
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;

    doc.setFontSize(10);
    doc.setTextColor("#0000");

    doc.text(
      `Total Box: ${formatterNo.format(totalDetails[0]?.box)}`,
      7,
      finalY + 1
    );
    doc.text(`Total Items: ${totalDetails[0]?.Items}`, 7, finalY + 5);
    doc.text(
      `Total Net Weight: ${newFormatter2.format(totalDetails[0]?.nw)}`,
      75,
      finalY + 5
    );
    doc.text(
      `Total Gross Weight: ${formatterNo.format(totalDetails[0]?.gw)}`,
      75,
      finalY + 9
    );
    doc.text(`Total CBM: ${totalDetails[0]?.cbm}`, 75, finalY + 1);

    doc.setFont("helvetica", "bold");
    doc.setTextColor("#0000 ");
    const PAGE_WIDTH = 210; // A4 page width in mm
    const MARGIN = 7; // margin from the right edge

    // Set the text and value
    const label = "Total USD CNF: ";
    const value = `${formatterNo.format(totalDetails[0]?.CNF_FX)}`;

    // Calculate the width of the label and the value
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);

    // Calculate the x-coordinate for right alignment
    const xRight = PAGE_WIDTH - MARGIN - valueWidth;

    // Set the font and color for the label
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#0000");

    // Draw the label
    doc.text(
      label,
      PAGE_WIDTH - MARGIN - labelWidth - valueWidth - 5,
      finalY + 1
    );

    // Draw the value
    doc.text(value, xRight, finalY + 1);

    doc.rect(147, finalY + 2, 55.5, 0.5, "FD");
    const longText = messageSet;
    const textX = 7;
    const textY = finalY + 15;

    doc.setFontSize(10);
    doc.setTextColor("#0000");
    doc.text(doc.splitTextToSize(longText, 201), textX, textY);

    const inputX = 20; // X position of the input field
    const inputY = textY + 8; // Y position of the input field
    const inputWidth = 180; // Width of the input field
    const inputHeight = 10; // Height of the input field
    doc.setDrawColor("#7b809a"); // Set the color of the rectangle
    const inputFieldValue = data?.NOTES;
    if (inputFieldValue && inputFieldValue.trim() !== "") {
      // Add the input field value inside the rectangle
      doc.rect(inputX, inputY, inputWidth, inputHeight); // Draw the rectangle
      doc.text(inputFieldValue, inputX + 2, inputY + 7); // Adjust position for padding
    }
    // Add more content if needed
    // Generate PDF as a Blob
      const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };

    // Add page numbers
    addPageNumbers(doc);
    const pdfBlob = doc.output("blob");
    // Create a Blob URL
    const blobUrl = URL.createObjectURL(pdfBlob);
    // Open the PDF in a new tab with a custom filename
    const fileName = `${from?.Order_number || "default"} proforma ${formatDate(
      new Date()
    )}.pdf`;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
    // Clean up the Blob URL
    URL.revokeObjectURL(blobUrl);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatterNg = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const formatterLine = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 1,
  });
  const formatterNo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const newFormatter2 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default ProformaInvoice;
