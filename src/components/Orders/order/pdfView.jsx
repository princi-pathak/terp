// import { useId } from "react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import jsPDF from "jspdf";

import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import logo from "../../../assets/logoNew.png";
import "./PdfSec.css";

export const OrderPdfView = () => {
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
      doc.setFont('ThaiFont');
      // Place text inside the rectangle
      doc.text("Order/Load", 130, 9.5);
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
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
        doc.text(item.label, labelXLeft, yLeft);
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + (index * 4)); // Adjust y position for each line of value
        });
        yLeft += (valueLinesLeft.length * 4) + yIncrementLeft; // Adjust spacing between sections
      });
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
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + (index * 4));
        });
        yRight += (valueLinesRight.length * 4) + yIncrementRight;
      });
    }
    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 33;

    // Sample table data
    const headers = [
      [
        { content: 'Product details', colSpan: 4, rowSpan: 1, styles: { halign: 'center' } },
        { content: 'Order', colSpan: 3, rowSpan: 1, styles: { halign: 'center' } },
        { content: 'Load', colSpan: 1, rowSpan: 2, styles: { halign: 'center' } }
      ],
      [
        { content: 'Packing', styles: { halign: 'center' } },
        { content: 'Boxes', styles: { halign: 'center' } },
        { content: 'Brand	', styles: { halign: 'center' } },
        { content: 'ITF', styles: { halign: 'center' } },
        { content: 'EAN', styles: { halign: 'center' } },
        { content: ' Net Weight	', styles: { halign: 'center' } },
        { content: 'BOXES' },
        { content: 'empty1', styles: { halign: 'center' } },
      ]
    ];
    const data = [
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
      ['Plastic tray - T315', 'Foam 13.5 (Phu Lae Yai)', 'TropiThai', 'Asparagus Baby - 100g x 100', '100.000', '10.000', '1', " "],
    ];
    // Adding the table to the PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: yTop,
      theme: 'grid',
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
        halign: 'center'
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        // cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.010, // Adjust the border width
        lineColor: [26, 35, 126], // Border color
      },
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto",
      columnStyles: {
        6: { halign: "center" },

      },
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
      },

    });
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
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
  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button> 
    </div>
  );
};

 
