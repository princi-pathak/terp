 import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/logoT.jpg";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
//import thaiFont from "../../../assets/TH Sarabun New Regular.ttf"; // Replace with your font path
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";

export const Pdf_View = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [allData, setAllData] = useState("");
  // const [totalDetails, setTotalDetails] = useState("");
  const [tableData, setTableData] = useState([]);
  const [messageSet, setMassageSet] = useState("");

  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  console.log(from?.order_id);
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
          setMassageSet(error.response.data.message);
        }
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
        return false;
      });
  };
  const tableDataAll = () => {
    axios
      .post(`${API_BASE_URL}/orderPdfTable`, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response);

        setTableData(response?.data?.results);
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
        return false;
      });
  };
  const { data: totalDetails, refetch: getSummary } = useQuery(
    `getOrderSummary?quote_id=${from?.order_id}`,
    {
      enabled: !!from?.order_id,
    }
  );
  console.log(totalDetails);
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/GetOrderPdfDetails`, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(response?.data?.orderResults);
        setAllData(response?.data);

        // setTotalDetails(response?.data?.totalDetails);
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

  useEffect(() => {
    pdfAllData();
    tableDataAll();
    delivery();
    getSummary();
  }, []);
  const formatDate1 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
  };
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0"); // Adds leading zero if needed
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const newFormatter1 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });

  const generatePdf = async () => {
    const doc = new jsPDF();
    doc.setFont("helvetica"); // Default built-in font
    doc.setFontSize(16);
    //doc.text("สวัสดีครับ", 10, 10);
    // Add the font file to the VFS
    // doc.addFileToVFS("THSarabun-Regular.ttf", thaiFont);

    // // Register the font
    //doc.addFont("THSarabun-Regular.ttf", "thai", "normal");

    // // Set the font
    //doc.setFont("thai");

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
      doc.setTextColor("#0000");
      doc.text(`${companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor("#0000");
      doc.text(`${companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // two line
      doc.setFillColor("#203764");
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor("#0000");
      doc.setFontSize(12);
      doc.text("Packing List / Invoice", 83, 27.5);
      doc.setFillColor("#203764");
      doc.rect(7, 29, doc.internal.pageSize.width - 15, 0.5, "FD");
      // order part left
      doc.setFontSize(10);
      doc.setTextColor("#000000");
      const maxWidthLeft = 72; // Maximum width in pixels
      let yLeft = 33;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: `${data?.order_number}` },
        { label: "Loading Date :", value: `${formatDate1(data?.load_date)}` },
        { label: "Shipment Ref :", value: `${from?.Shipment_ref}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 7;
        const valueXLeft = 40;

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
      doc.setTextColor("#000000");
      const maxWidthRight = 72; // Maximum width in pixels
      let yRight = 33;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      const textDataRight = [
        { label: "AWB/BL:", value: `${allData?.freightDetailsResults?.awb}` },
        {
          label: "Ship Date: ",
          value: `${formatDate1(allData?.freightDetailsResults?.ship_date)}`,
        },
        { label: "Delivery By:", value: `${messageSet}` },
      ];

      textDataRight.forEach((item) => {
        const labelXRight = 100;
        const valueXRight = 127;

        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });

        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });

      // invoice to
      doc.setFontSize(12);
      doc.text("Invoice to", 7, 48.5);
      doc.text("Consignee Details", 100, 48.5);
    };
    doc.setFillColor("#203764");
    doc.rect(7, 50.5, doc.internal.pageSize.width - 15, 0.5, "FD");
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
    let startY1 = 55;
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
    const startX2 = 100.3;
    let startY2 = 55;
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
    //  ***************************************************************************************

    const columns = [
      { header: "#", dataKey: "index" },
      { header: "Item Detail", dataKey: "itf_th" },
      { header: "Hs Code", dataKey: "HS_CODE" },
      { header: "QTY", dataKey: "qty" },
      { header: "UNIT", dataKey: "unit" },
      { header: "Box", dataKey: "box" },
      { header: "FOB (THB)", dataKey: "fob" },
    ];

    const newFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    });

    const newFormatter1 = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
    });
    const newFormatter5 = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
    });

    const rows = tableData.map((item, index) => ({
      index: index + 1,
      itf_th: item.itf_th, // Thai text should be correctly displayed
      HS_CODE: item.HS_CODE,
      qty: newFormatter1.format(item.Net_Weight),
      unit: "KG",
      box: item.Boxes,
      fob: newFormatter5.format(item.FOB),
    }));
    const startY = 83; // Start Y position for the table

    // Draw the table
    doc.autoTable({
      head: [
        ["Index", "Item Detail", "Hs Code", "Qty", "Unit", "Box", "FOB (THB)"],
      ],
      body: rows.map((row) => [
        row.index,
        row.itf_th, // Ensure Thai text displays correctly
        row.HS_CODE,
        row.qty,
        row.unit,
        row.box,
        row.fob,
      ]),
      columnStyles: {
        3: { halign: "right" }, // Right align the FOB column (index 6)
        5: { halign: "right" }, // Right align the FOB column (index 6)
        6: { halign: "right" }, // Right align the FOB column (index 6)
      },
      startX: 0, // Start the table from the left edge
      startY: startY, // Start Y position of the table
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto", // Make the table width adjust to the available space
      headStyles: {
        fillColor: "#203764", // Set the header background color
        textColor: "#FFFFFF",
        halign: "center", // Set the header text color
      },
      styles: {
        textColor: "#000000", // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: "#203764", // Border color
      },
    });

    // Get the Y position after the table is drawn
    const endY = doc.autoTable.previous.finalY + 1; // Adding some margin below the table
    // doc.rect(7, endY, doc.internal.pageSize.width - 15, 0.5, "FD");

    // Draw the text for the order part (left side)
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    const maxWidthLeft = 45; // Maximum width in pixels
    let yLeft = endY + 4; // Start below the table
    const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

    const textDataLeft = [
      {
        label: "Total:",
        value: `${totalDetails?.Total_Box} Boxes /${totalDetails?.Items} Item`,
      },
      {
        label: "Total Net Weight: ",
        value: `${formatterThree.format(totalDetails?.Net_Weight)}`,
      },
      // { label: "Total Gross Weight:", value: `${totalDetails?.Gross_weight}` },
      {
        label: "Total Gross Weight:",
        value: ` ${formatterGross.format(totalDetails?.FOB)}`,
      },
      { label: "Total CBM:", value: `${totalDetails?.CBM}` },
    ];

    textDataLeft.forEach((item) => {
      const labelXLeft = 7;
      const valueXLeft = 43;

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

    // Draw the text for the order part (right side)
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    const maxWidthRight = 40; // Maximum width in pixels
    let yRight = endY + 4; // Start below the table
    const yIncrementRight = 1; // Adjust this value based on your spacing requirements

    const textDataRight = [
      { label: "Total Packages:", value: `${totalDetails?.Total_Box}` },
      { label: "FOB (THB): ", value: `${formatter.format(totalDetails?.FOB)}` },
      {
        label: "Air Freight:",
        value: `${formatter.format(totalDetails?.Freight)}`,
      },
      { label: "Exchange Rate:", value: `${from?.fx_rate}` },
    ];

    textDataRight.forEach((item) => {
      const labelXRight = 85;
      const valueXRight = 117;

      // Split the value text if it exceeds maxWidth
      const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

      // Print the label
      doc.text(item.label, labelXRight, yRight);
      valueLinesRight.forEach((line, index) => {
        doc.text(line, valueXRight, yRight + index * 4);
      });

      yRight += valueLinesRight.length * 4 + yIncrementRight;
    });
    const totalTHBText = formatter.format(totalDetails?.total_THB);
    const totalCurrencyText = formatter.format(totalDetails?.total_USD);

    const totalTHBWidth = doc.getTextWidth(totalTHBText);
    const totalCurrencyWidth = doc.getTextWidth(totalCurrencyText);

    const maxWidth = 50;
    const startX_THB = 150 + maxWidth - totalTHBWidth;
    const startX_Currency = 150 + maxWidth - totalCurrencyWidth;

    doc.text("Total THB", 147, endY + 4);
    doc.text(totalTHBText, startX_THB, endY + 4);
    doc.setFillColor("#203764");
    doc.rect(147, endY + 6, 55.5, 0.5, "FD");
    doc.text(`Total ${allData?.currencyResults?.currency}`, 147, endY + 11);
    doc.text(totalCurrencyText, startX_Currency, endY + 11);
    doc.setFillColor("#203764");
    doc.rect(147, endY + 12, 55.5, 0.5, "FD");

    //*****************************************************************************************

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

    // Open the PDF in a new tab
    window.open(doc.output("bloburl"));
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
  const formatterGross = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const formatterThree = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
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
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};
