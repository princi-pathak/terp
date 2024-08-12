import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from "../../assets/logoNew.png";
import "../../components/Orders/order/PdfSec.css";

// import { usePDF } from "react-to-pdf";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const InvoiceSecPdf = () => {
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
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
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
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
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
        // setDetails(response.data.data || []);
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
        // setCompanyAddress(response?.data?.Company_Address);
        setData(from);

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
    getOrdersDetails();
    dynamicMessage();
    delivery();
  }, []);
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
      doc.text("Siam Eats Co.,Ltd. (0395561000010)", 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text("16/8 Mu 11", 30, 12)
      const longTextOne = "Khlong Nueng, Khlong Luang, Pathum Thani 12120 THAILAND";
      const maxWidthOne = 59;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + (index * 4.2)); // Adjust the line height (10) as needed
      });
      // end company
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(95, 5, 107, 7, 'FD');
      // Place text inside the rectangle
      doc.text("PACKING LIST", 130, 9.5);
      // rect end
      // order part

      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: "o-1234567 " },
        { label: "TT Ref :", value: "12-5-2024 " },
        { label: " PO Number :", value: "LDM025- 2024q" },
        { label: "AWB :", value: "LDM025- 2024q" },
      ];

      textDataLeft.forEach(item => {
        const labelXLeft = 95;
        const valueXLeft = 123;

        // Split the value text if it exceeds maxWidth
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);

        // Print the label
        doc.text(item.label, labelXLeft, yLeft);

        // Print the value, split into multiple lines if needed
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + (index * 4)); // Adjust y position for each line of value
        });

        // Increment y to move to the next section
        yLeft += (valueLinesLeft.length * 4) + yIncrementLeft; // Adjust spacing between sections
      });

      // Second part (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthRight = 32; // Maximum width in pixels
      let yRight = 16;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      const textDataRight = [
        { label: "Date:", value: "o-12345678" },
        { label: "Due Date : ", value: "12-5-2024" },
        { label: "Ship Date :", value: "LDM025- 2024" },
        { label: "Delivery By :", value: "LDM025- 2024" },
      ];

      textDataRight.forEach(item => {
        const labelXRight = 155;
        const valueXRight = 175;

        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + (index * 4));
        });

        yRight += (valueLinesRight.length * 4) + yIncrementRight;
      });

      // **********************************************
      // client
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(7, 33, 96, 7, 'FD');
      // doc.setFont('Helvetica');
      doc.text("Invoice to", 50, 37.5);
      // consignee
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(106, 33, 96, 7, 'FD');
      // Place text inside the rectangle
      doc.text("Consignee", 145, 37.5)
      // client under text
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      function renderWrappedText1(doc, text, startX, startY, maxWidth, lineHeight) {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, startX, startY + (index * lineHeight));
        });
        return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
      }

      function renderWrappedText2(doc, text, startX, startY, maxWidth, lineHeight) {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, startX, startY + (index * lineHeight));
        });
        return startY + lines.length * lineHeight; // Return the new Y position after rendering the text       chunti
      }

      // First set of texts
      const maxWidth1 = 92;
      const startX1 = 8;
      let startY1 = 45;
      const lineHeight1 = 4.2;
      doc.setFont('Helvetica');
      // doc.setFontSize(11);
      const longText1_1 = "HLB Tropical Food GmbH (undefined)";
      const longText1_2 = "Office 43-44, Al Fahidi, Bur Dubai, Dubai, Dubai, United Arab Emirates,";
      const longText1_3 = "Bur Dubai, Dubai, Dubai, United Arab Emirates, 211860";

      startY1 = renderWrappedText1(doc, longText1_1, startX1, startY1, maxWidth1, lineHeight1);
      doc.setFontSize(10);
      startY1 = renderWrappedText1(doc, longText1_2, startX1, startY1, maxWidth1, lineHeight1);
      startY1 = renderWrappedText1(doc, longText1_3, startX1, startY1, maxWidth1, lineHeight1);

      // Consignee detail
      const maxWidth2 = 92;
      const startX2 = 107;
      let startY2 = 45;
      const lineHeight2 = 4.2;
      const longText2_1 = "HLB Tropical Food GmbH (undefined)";
      const longText2_2 = "Office 43-44, Al Fahidi, Bur Dubai, Dubai, Dubai, United Arab Emirates,";
      const longText2_3 = "Bur Dubai, Dubai, Dubai, United Arab Emirates"
      doc.setFontSize(11);

      startY2 = renderWrappedText2(doc, longText2_1, startX2, startY2, maxWidth2, lineHeight2);
      doc.setFontSize(10);

      startY2 = renderWrappedText2(doc, longText2_2, startX2, startY2, maxWidth2, lineHeight2);
      startY2 = renderWrappedText2(doc, longText2_3, startX2, startY2, maxWidth2, lineHeight2);
    }


    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 65;

    // Sample table data
    const columns = [
      { header: '#', dataKey: 'id' },
      { header: 'N.W (KG)', dataKey: 'ng' },
      { header: 'Box', dataKey: 'box' },
      { header: 'Packages', dataKey: 'package' },
      { header: 'Item Detail', dataKey: 'itemDetail' },
      { header: 'HS Code', dataKey: 'hsCode' },

    ];

    const rows = [];

    for (let i = 1; i <= 10; i++) {
      rows.push({
        id: i,
        ng: formatterThree.format(45.756754),
        box: formatterNo.format(32.324),
        package: formatterNo.format(52.3242),
        itemDetail: 'Papaya Holland - Kg x 3 (Frutulip)',
        hsCode: "100.00.11",
      });
    }

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startY: yTop, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        5: { halign: "center" },

      },
      tableWidth: 'auto',
      headStyles: {
        fillColor: [32, 55, 100],
        textColor: [255, 255, 255],
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width  
        lineColor: [32, 55, 100] // Border color
      },
      didParseCell: function (data) {
        if (data.section === 'body') {
          // Apply alternate row coloring
          const rowIndex = data.row.index;
          if (rowIndex % 2 === 0) {
            data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
          } else {
            data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
          }
        }
      }
    });
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
    doc.text(
      "Total Box:",
      7,
      finalY + 1
    );

    doc.text(`${formatterNo.format(76586.768657)}`, 35, finalY + 1)
    doc.text(
      "Total Packages:",
      7,
      finalY + 5.5
    );
    doc.text(`${formatterNo.format(5645.456456)}`, 35, finalY + 5.5);

    doc.text("Total Items:",
      7,
      finalY + 10
    );
    doc.text(`${formatterNo.format(totalDetails[0]?.box)}`, 35, finalY + 10)


    doc.text("Exchange Rate:",
      7,
      finalY + 14.5
    );
    doc.text(`${newFormatter.format(435.43534)}`, 35, finalY + 14.5)

    doc.text(
      "Total Net Weight:",
      75,
      finalY + 1
    );
    doc.text(`${newFormatter2.format(76867578.57685)}`, 105, finalY + 1)
    doc.text(
      " Gross Weight:",
      75,
      finalY + 5.5
    );
    doc.text(`${formatterNo.format(totalDetails[0]?.gw)}`, 105, finalY + 5.5)
    doc.text("Total CBM:", 75, finalY + 10),
      doc.text(`${totalDetails[0]?.cbm}`, 105, finalY + 10)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const PAGE_WIDTH = 210; // A4 page width in mm
    const MARGIN = 7; // margin from the right edge

    // Set the text and value
    const label = "Total";
    const value = `${newFormatter.format(4353242342.324234)}`;

    // Calculate the width of the label and the value
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);
    const xRight = PAGE_WIDTH - MARGIN - valueWidth;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);


    //note end

    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };
    // Add page numbers
    addPageNumbers(doc);
    window.open(doc.output("bloburl"));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()} - ${d.getMonth() + 1} - ${d.getFullYear()}`;
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
  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default InvoiceSecPdf;
