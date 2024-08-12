import { useMemo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../card";
import { TableView } from "../table";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const PurchaseOrder = () => {
  // const { data } = useQuery("getPurchaseOrder")

  const [data, setData] = useState([]);
  const getPurchaseOrder = () => {
    axios.get(`${API_BASE_URL}/getPurchaseOrder`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getPurchaseOrder();
  }, []);
  const navigate = useNavigate();
  // const purchseView = () => {
  // 	navigate("/purchaseview")
  // }
  const columns = useMemo(
    () => [
      {
        Header: "PO Number",
        accessor: "po_code",
      },

      {
        Header: "Vendor",
        accessor: "vendor_name",
      },
      {
        Header: "Created",
        accessor: (a) =>
          `${new Date(a.created).getDate().toString().padStart(2, "0")}-${(
            new Date(a.created).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(a.PO_date).getFullYear()}`,
      },
      {
        Header: "Total",
        accessor: (a) => `${(+(a.total_with_vat || "0")).toLocaleString()} THB`,
      },
	  {
        Header: "Invoice",
        accessor: "supplier_invoice_number"
      },
      {
        Header: "Stauts",
        accessor: (a) =><div>-</div>,
      },

      {
        Header: "Recived",
        accessor: (a) => <div>-</div>,
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon">
            <button
              onClick={() => navigate("/purchaseview", { state: { from: a } })}
            >
              <i className="mdi mdi-eye" />
            </button>
            <i className="ps-2 mdi mdi-file-find" />
            <Link to="/updatePurchaseOrder" state={{ from: a }}>
              <i className="mdi mdi-pencil pl-2" />
            </Link>
            <i className="ps-2 mdi mdi-delete" />
            <i className=" ps-2 mdi mdi-restore" />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card
      title="Purchase Order"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createPurchaseOrder")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <TableView
        columns={columns}
        data={data || []}
        customElement={
          <div className="flex flex-wrap justify-center text-center gap-2">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              PO Status Report
            </button>

            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      PO Status Report
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">All</option>
                            <option value="">
                              Excel Transport International Co., Ltd.
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>From</h6>
                        <input type="date" className="form-control" />
                      </div>

                      <div className="col-lg-6 form-group">
                        <h6>To</h6>
                        <input className="form-control" type="date" />
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>Paid</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">SCB</option>
                            <option value="">K Bank </option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6 form-group RadioInvocie">
                        <h6>Payment Status</h6>
                        <div style={{ textAlign: "left" }}>
                          <input
                            type="radio"
                            id="html"
                            name="fav_language"
                            value="HTML"
                          />
                          <label htmlFor="html" className="pe-3">
                            Paid
                          </label>
                          <input
                            type="radio"
                            id="css"
                            name="fav_language"
                            value="CSS"
                          />
                          <label htmlFor="css">Non Paid</label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary"
                    >
                      Generate
                    </button>
                  </div>
                  <div className="modal-footer"></div>
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-primary">
              LRP Report
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
            >
              Combined Payment
            </button>

            <div
              className="modal fade"
              id="exampleModal1"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Combined Payment
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">SCB</option>
                            <option value="">k Bank</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>Staff press payment</h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="zeid"
                        />
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>Payment Date</h6>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="zeid"
                        />
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>Paid By</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">SCB</option>
                            <option value="">k Bank</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 form-group">
                        <h6>Staff Name</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">SCB</option>
                            <option value="">k Bank</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-12 form-group">
                        <h6>Note</h6>
                        <textarea name="" id=""></textarea>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
            >
              Statement
            </button>

            <div
              className="modal fade"
              id="exampleModal2"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Statement
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          <select name="" id="" className="form-select">
                            <option value="">Choose THB</option>
                            <option value="">
                              Mirak Royal Nature Fruit and Vegetables
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-12 form-group">
                        <h6>From</h6>
                        <input className="form-control" type="date" />
                      </div>
                      <div className="col-lg-12 form-group">
                        <h6>To</h6>
                        <input className="form-control" type="date" />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default PurchaseOrder;
