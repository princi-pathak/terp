import jsPDF from "jspdf";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import logo from "../../assets/logoT.jpg";
import { API_BASE_URL } from "../../Url/Url";

const InvoiceThird = () => {
  const [messageSet1, setMassageSet1] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [currency, setCurrency] = useState("");

  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);

  const customInvoiceDetails = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceDetails`, {
        order_id: from?.order_id,
        Invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response.data.Invoice);
        setTotalDetails(response.data.Invoice);
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
  const pdfTableData = () => {
    axios
      .post(`${API_BASE_URL}/invoicePdfTable`, {
        invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response);

        setTableData(response.data.results);
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
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/CustomeInvoicePdfDetails`, {
        order_id: from?.order_id,
        invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(from);
        setCurrency(response?.data?.currencyResults);
        // setTableData(response.data.results);
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
    customInvoiceDetails();
    pdfTableData();
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
  //   filename: `${from?.Invoice_number || "default"} Invoice ${formatDate(
  //     new Date()
  //   )}.pdf`,
  // });

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

  // Create a number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
  const newFormatter1 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const formatDate1 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
  };
  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response.status);
        setMassageSet1(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }

        return false;
      });
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
        { label: "Order :", value: `${data?.Order_number}` },
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
        { label: "AWB/BL:", value: `${data?.bl}` },
        { label: "Ship Date: ", value: `${formatDate1(data?.Ship_date)}` },
        { label: "Delivery By:", value: `${messageSet1}` },
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
    doc.setFontSize(10);
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
    const longText1_1 = `${data.Client_name}(${data.client_tax_number})`;
    const longText1_2 = `${data?.client_address}`;
    const longText1_3 = `${data?.client_email} / ${data?.client_phone}`;

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
    const longText2_1 = `${data?.Consignee_name}(${data?.consignee_tax_number})`;
    const longText2_2 = `${data?.consignee_address}`;
    const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;

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
      { header: "QTY", dataKey: "Net_Weight" },
      { header: "UNIT", dataKey: "unit" },
      { header: "Box", dataKey: "Boxes" },
      { header: "FOB (THB)", dataKey: "FOB" },
    ];

    const rows = tableData.map((item, index) => ({
      index: index + 1,
      itf_th: item.itf_th, // Thai text should be correctly displayed
      HS_CODE: item.HS_CODE,
      Net_Weight: newFormatter1.format(item.Net_Weight),
      unit: "KG",
      Boxes: item.Boxes,
      FOB: newFormatter.format(item.FOB),
    }));

    // Define startY dynamically
    const startY = 83; // Start Y position for the table

    // Draw the table
    doc.autoTable({
      head: [
        ["#", "Item Detail", "Hs Code", "QTY", "UNIT", "Box", "FOB (THB)"],
      ],
      body: rows.map((row) => [
        row.index,
        row.itf_th, // Ensure Thai text displays correctly
        row.HS_CODE,
        row.Net_Weight,
        row.unit,
        row.Boxes,
        row.FOB,
      ]),
      startX: 0, // Start the table from the left edge
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
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
    const endY = doc.autoTable.previous.finalY + 1;
    // doc.rect(7, endY, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    const maxWidthLeft = 45;
    let yLeft = endY + 4;
    const yIncrementLeft = 1;

    const textDataLeft = [
      {
        label: "Total:",
        value: `${totalDetails?.box} Boxes /${totalDetails?.Items} Item`,
      },
      {
        label: "Total Net Weight: ",
        value: `${totalDetails?.nw}`,
      },
      {
        label: "Total Gross Weight:",
        value: `${formatter.format(totalDetails?.gw)}`,
      },
      { label: "Total CBM:", value: `${totalDetails?.cbm}` },
    ];

    textDataLeft.forEach((item) => {
      const labelXLeft = 7;
      const valueXLeft = 43;
      const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
      doc.text(item.label, labelXLeft, yLeft);
      valueLinesLeft.forEach((line, index) => {
        doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
      });
      yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
    });

    // Draw the text for the order part (right side)
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    const maxWidthRight = 40; // Maximum width in pixels
    let yRight = endY + 4; // Start below the table
    const yIncrementRight = 1; // Adjust this value based on your spacing requirements

    const textDataRight = [
      { label: "Total Packages:", value: `${from?.packages}` },
      { label: "FOB (THB): ", value: `${formatter.format(totalDetails?.FOB)}` },
      {
        label: "Air Freight:",
        value: `${formatter.format(totalDetails?.freight)}`,
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

    const cnfText = `${formatter.format(totalDetails?.CNF)}`;
    const cnfFXText = `${formatter.format(totalDetails?.CNF_FX)}`;
    const textWidthCNF = doc.getTextWidth(cnfText);
    const textWidthCNFFX = doc.getTextWidth(cnfFXText);
    const rightAlignX = 200; // Example x position for right alignment

    // Total THB
    doc.text("Total THB", 147, endY + 4);
    doc.text(cnfText, rightAlignX - textWidthCNF, endY + 4);

    // Separator line
    doc.rect(147, endY + 6, 55.5, 0.5, "FD");

    // Total with currency
    doc.text(`Total ${currency?.currency}`, 147, endY + 11);
    doc.text(cnfFXText, rightAlignX - textWidthCNFFX, endY + 11);

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

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default InvoiceThird;
