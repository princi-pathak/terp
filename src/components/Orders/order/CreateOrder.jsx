import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
import { Button, Modal } from "react-bootstrap";

import "./CreateOrder.css";
import { ComboBox } from "../../combobox";
const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const isReadOnly = from?.isReadOnly;
  const [isLoading, setIsLoading] = useState(false);
  const [orderErr, setOrderErr] = useState(true);
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [show, setShow] = useState(false);
  console.log(massageShow);
  console.log(massageShow1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(massageShow);
  console.log(massageShow1);
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  const [state, setState] = useState({
    created: from?.created
      ? new Date(from?.created).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    order_id: from?.order_id || "",
    Order_number: from?.Order_number || "",
    brand_id: from?.brand_id || "",
    client_id: from?.client_id || "",
    quote_id: from?.quote_id || "",
    loading_location: from?.loading_location || "",
    Freight_provider_: from?.Freight_provider_ || "",
    liner_id: from?.liner_id || "",
    from_port_: from?.from_port_ || "",
    destination_port_id: from?.destination_port_id || "",
    Clearance_provider: from?.Clearance_provider || "",
    Transportation_provider: from?.Transportation_provider || "",
    consignee_id: from?.consignee_id || "",
    fx_id: from?.fx_id || "",
    mark_up: from?.mark_up || 0,
    rebate: from?.rebate || 0,
    palletized: from?.palletized == "ON",
    Chamber: from?.Chamber == "ON",
    load_date: from?.load_date
      ? new Date(from?.load_date).toISOString().slice(0, 10)
      : "",
    fx_rate: from?.fx_rate,
  });
  console.log(state);
  const handleChange = (event) => {
    if (isReadOnly || isLoading) return;
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: brands } = useQuery("getBrand");
  const { data: locations } = useQuery("getLocation");
  const { data: freights } = useQuery("getFreight_Supplier");
  const { data: liners } = useQuery("getLiner");
  const { data: ports } = useQuery("getAllAirports");
  const { data: clearance } = useQuery("getClearance");
  const { data: transport } = useQuery("getTransportation_Supplier");
  const { data: consignee } = useQuery("getConsignee");
  const { data: currency } = useQuery("getCurrency");
  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");
  const { data: quote } = useQuery("getAllQuotation");
  const { data: summary, refetch: getSummary } = useQuery(
    `getOrderSummary?quote_id=${state.order_id}`,
    {
      enabled: !!state.order_id,
    }
  );
  console.log(summary);
  const [orderId, setOrderId] = useState("");
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");

  console.log(from?.order_id);
  console.log(orderId);
  console.log(grossMass);

  useEffect(() => {
    grossTransspotationErr();
    orderCrossFreight();
    if (state.order_id) getOrdersDetails();
  }, [orderId]);
  const computedState = useMemo(() => {
    const quoteFind = quote?.find((v) => v.quote_id == state.quote_id);
    const r = {
      ...state,
      consignee_id: state.consignee_id || quoteFind?.consignee_id,
      client_id: state.client_id || quoteFind?.client_id,
    };
    const consigneeFind = consignee?.find(
      (v) => v.consignee_id == state.consignee_id
    );

    const portDestinationFind = ports?.find(
      (v) =>
        v.port_id == (r.destination_port_id || consigneeFind?.destination_port)
    );
    const portOriginFind = ports?.find(
      (v) => v.port_id == (r.from_port_ || consigneeFind?.port_of_orign)
    );
    r.fx_id = r.fx_id || consigneeFind?.currency || quoteFind?.fx_id;
    r.fx_rate =
      state.fx_rate ||
      currency?.find((v) => +v.currency_id == +r.fx_id)?.fx_rate ||
      currency?.[
        consignee?.findIndex((v) => +v.consignee_id == +r.consignee_id)
      ]?.fx_rate ||
      quoteFind?.fx_rate ||
      0;
    r.rebate = r.rebate || consigneeFind?.rebate || quoteFind?.rebate;
    r.Clearance_provider =
      r.Clearance_provider ||
      portOriginFind?.preferred_clearance ||
      consigneeFind?.Clearance_provider ||
      quoteFind?.Clearance_provider;
    r.loading_location =
      r.loading_location ||
      consigneeFind?.Default_location ||
      quoteFind?.loading_location;
    r.brand_id = state.brand_id || consigneeFind?.brand || quoteFind?.brand_id;
    r.mark_up = r.mark_up || consigneeFind?.profit || quoteFind?.profit;
    r.Transportation_provider =
      r.Transportation_provider ||
      portOriginFind?.preferred_transport ||
      quoteFind?.Transportation_provider;
    r.from_port_ =
      r.from_port_ || consigneeFind?.port_of_orign || quoteFind?.port_of_orign;
    r.destination_port_id =
      r.destination_port_id ||
      consigneeFind?.destination_port ||
      quoteFind?.destination_port_id;
    r.liner_id =
      r.liner_id || portDestinationFind?.prefered_liner || quoteFind?.liner_id;
    r.Freight_provider_ =
      state.Freight_provider_ ||
      liners?.find((v) => v.liner_id == r.liner_id)?.preffered_supplier ||
      quoteFind?.Freight_provider_;
    return r;
  }, [
    state,
    consignee,
    currency,
    ports,
    brands,
    locations,
    liners,
    transport,
    clearance,
    freights,
    unit,
    itf,
  ]);
  console.log(from);
  console.log(computedState);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getOrdersDetails?id=${state.order_id}`,
    {
      enabled: !!state.order_id,
    }
  );
  console.log(details);

  const isError = useMemo(() => {
    return (details || []).some((v) => {
      return +v.Number_of_boxes % 1 != 0;
    });
  }, [details]);
  console.log(isError);
  const isMinWeightError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) <
      freights?.find(
        (v) => v.Freight_provider == computedState.Freight_provider_
      )?.min_weight
    );
  }, [freights, summary]);
  const isMinWeightTransportError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) <
        freights?.find(
          (v) => v.Freight_provider == computedState.Freight_provider_
        )?.min_weight &&
      (+summary?.Gross_weight || 0) >=
        transport?.find(
          (v) =>
            v.Transportation_provider == computedState.Transportation_provider
        )?.max_weight3
    );
  }, [freights, summary]);
  const isMinTransportError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) >=
      transport?.find(
        (v) =>
          v.Transportation_provider == computedState.Transportation_provider
      )?.max_weight3
    );
  }, [freights, summary]);
  console.log(isMinWeightError);
  console.log(isMinTransportError);

  const deleteDetail = async (i) => {
    if (isReadOnly || isLoading) return;
    if (details[i].od_id) {
      try {
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.post(`${API_BASE_URL}/deleteOrderDetails`, {
              id: details[i].od_id,
            });
            setDetails((prevState) => {
              return prevState.filter((v, index) => index != i);
            });
            toast.success("Order detail deleted successfully");
          }
        });
      } catch (e) {}
    } else {
      setDetails((prevState) => {
        return prevState.filter((v, index) => index != i);
      });
    }
  };
  const grossTransspotationErr = async () => {
    if (orderId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossTransportError`,
          { order_id: orderId }
        );
        console.log(response); // Log the response to the console
        if (response.data.success == true) {
          setGross(true);
          setGrossMass(response.data.message);
        }
        toast.success(response);
      } catch (e) {
        console.error("Something went wrong", e); // Log the error to the console
      }
    }
  };
  const orderCrossFreight = async () => {
    if (orderId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossFreightError`,
          { order_id: orderId }
        );
        console.log(response); // Log the response to the console
        if (response.data.success == true) {
          setFreight(true);
          setFreightMass(response.data.message);
        }
      } catch (e) {
        console.error("Something went wrong", e); // Log the error to the console
      }
    }
  };
  const deleteOrder = async () => {
    console.log(deleteOrderId);

    if (deleteOrderId) {
      try {
        await axios.post(`${API_BASE_URL}/deleteOrder`, { id: deleteOrderId });
        toast.success("Order cancel successfully");
        navigate("/orders");
        refetch();
      } catch (e) {
        // toast.error("Something went wrong");
        console.log(e);
      }
    } else {
      navigate("/orders");
    }
  };

  const update = async () => {
    if (orderErr) {
      toast.error("Please Add Order or Order Details");
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/createOrder`, {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: !!computedState.palletized,
            Chamber: !!computedState.Chamber,
            order_id: state.order_id,
          },
          details: details?.filter(
            (v) => v.ITF && v.itf_quantity && v.itf_unit
          ),
        });
        console.log(response); // Log the response here
        // let modalElement = document.getElementById("exampleQuo");
        // let modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (response.data.success == false) {
          // modalInstance.show();
          setShow(true);
          setMassageShow(response.data.message);
        } else if (response.data.success == true) {
          setShow(false);

          toast.success("Order Create successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/orders");
        }
      } catch (e) {
        console.error(e); // Log the error to the console
        toast.error("Something went wrong");
      }
    }
  };

  const calculate = async () => {
    const reai = details?.filter((v) => v.ITF && v.itf_quantity && v.itf_unit);
    console.log(reai);
    if (reai.length === 0) return;
    setIsLoading(true);
    loadingModal.fire();

    try {
      const { data } = await axios.post(`${API_BASE_URL}/newCalculateOrder`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: reai,
      });
      console.log(data);

      // let modalElement = document.getElementById("exampleQuo");
      // let modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (data.success === false) {
        // modalInstance.show();
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success === true) {
        setShow(false);
        toast.success("Order Calculated successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      }

      await getOrdersDetails(data.data);
      getSummary();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong", {
        autoClose: 1000,
        theme: "colored",
      });
    } finally {
      MySwal.close();
      setIsLoading(false);
    }
  };

  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const defaultDetailsValue = useMemo(() => {
    return details?.[selectedDetails] || null;
  }, [selectedDetails]);
  console.log(defaultDetailsValue);
  const [toEditDetails, setToEditDetails] = useState({});
  console.log(toEditDetails?.brand_id);
  console.log(defaultDetailsValue?.brand_id);
  console.log(defaultDetailsValue);
  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedDetails(null);
  };
  const openModal = () => {
    setIsOpenModal(true);
  };
  const setDetailsEdit = (id) => {
    console.log(id);
    setSelectedDetails(id);
    setToEditDetails({});
    openModal();
  };
  console.log(toEditDetails);

  const saveNewDetails = async () => {
    const values = {
      ...toEditDetails,
      ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
      itf_quantity:
        toEditDetails?.itf_quantity ?? defaultDetailsValue?.itf_quantity,
      itf_unit: toEditDetails?.itf_unit ?? defaultDetailsValue?.itf_unit,
      adjusted_price:
        toEditDetails?.adjusted_price ??
        defaultDetailsValue?.adjusted_price ??
        0,
      od_id: defaultDetailsValue?.od_id || undefined,
      // od_id:"91",

      brand_id:
        toEditDetails?.brand_id ?? defaultDetailsValue?.brand_id ?? undefined,
      is_changed: true,
    };
    if (!values.ITF || !values.itf_quantity || !values.itf_unit) {
      setOrderErr(true);
      return toast.error("Please fill all fields");
    }
    setOrderErr(false);
    loadingModal.fire();
    closeModal();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/addOrderInput`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: values,
      });
      setOrderId(data?.order_id);
      console.log(data.order_id);
      toast.success("Order detail added successfully");
      setDeleteOrderId(data?.order_id);
      setState((prevState) => {
        return {
          ...prevState,
          order_id: data?.order_id,
        };
      });

      getSummary();
      getOrdersDetails();
      // navigate("/orders");
      MySwal.close();
      closeModal();
    } catch (e) {
      console.error(e);
      MySwal.close();
      closeModal();
      toast.error("Something went wrong");
    } finally {
      MySwal.close();
      closeModal();
    }
  };
  const updateDetails = (e) => {
    if (isReadOnly || isLoading) return;
    setToEditDetails((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const fetchConsignees = async () => {
    console.log(computedState.client_id);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: computedState.client_id,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  useEffect(() => {
    if (computedState.client_id) {
      fetchConsignees();
    }
  }, [computedState.client_id]);
  const reCalculate = () => {
    axios
      .post(`${API_BASE_URL}/RecalculateOrder`, {
        order_id: state.order_id,
      })
      .then((response) => {
        getOrdersDetails();
        console.log(response);
        toast.success("Order Recalculate  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };
  console.log(state);
  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }

    if (massageShow1) {
      setMassageShow1("");
    }
  };
  return (
    <>
      <Card
        title={`Order Management /Create
         Form`}
      >
        <div className="top-space-search-reslute">
          <div className="tab-content px-2 md:!px-4">
            <div className="tab-pane active" id="header" role="tabpanel">
              <div
                id="datatable_wrapper"
                className="information_dataTables dataTables_wrapper dt-bootstrap4"
              >
                <div className="formCreate ">
                  <form action="">
                    <div className="row formEan">
                      <div className="col-lg-3 form-group">
                        <h6> Create Date </h6>
                        <input
                          type="date"
                          value={computedState.created}
                          onChange={handleChange}
                        />
                      </div>
                      {state.quote_id && (
                        <div className="col-lg-3 form-group">
                          <h6>Quote</h6>
                          <div className="ceateTransport">
                            <select
                              value={computedState.quote_id}
                              name="quote_id"
                            >
                              <option>Select Quote</option>
                              {quote?.map((v) => (
                                <option value={v.quote_id}>
                                  {v.client_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row formEan">
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Client</h6>
                        <ComboBox
                          options={clients?.map((v) => ({
                            id: v.client_id,
                            name: v.client_name,
                          }))}
                          value={computedState.client_id}
                          onChange={(e) => setState({ ...state, client_id: e })}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Consignee</h6>
                        <ComboBox
                          options={consignees?.map((v) => ({
                            id: v.consignee_id,
                            name: v.consignee_name,
                          }))}
                          value={computedState.consignee_id}
                          onChange={(e) =>
                            setState({
                              ...state,
                              rebate: "",
                              Clearance_provider: "",
                              Freight_provider_: "",
                              Transportation_provider: "",
                              brand_id: "",
                              fx_id: "",
                              mark_up: "",
                              fx_rate: "",
                              from_port_: "",
                              destination_port_id: "",
                              liner_id: "",
                              loading_location: "",
                              consignee_id: e,
                            })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Brands</h6>
                        <ComboBox
                          options={brands?.map((v) => ({
                            id: v.brand_id,
                            name: v.Brand_name,
                          }))}
                          value={computedState.brand_id}
                          onChange={(e) => setState({ ...state, brand_id: e })}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Currency</h6>
                        <ComboBox
                          options={currency?.map((v) => ({
                            id: v.currency_id,
                            name: v.currency,
                          }))}
                          value={computedState.fx_id}
                          onChange={(e) => setState({ ...state, fx_id: e })}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Loading Location</h6>
                        <ComboBox
                          options={locations?.map((v) => ({
                            id: v.id,
                            name: v.name,
                          }))}
                          value={computedState.loading_location}
                          onChange={(e) =>
                            setState({ ...state, loading_location: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Port of Origin</h6>
                        <ComboBox
                          options={ports?.map((v) => ({
                            id: v.port_id,
                            name: v.port_name,
                          }))}
                          value={computedState.from_port_}
                          onChange={(e) =>
                            setState({ ...state, from_port_: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Port of Destination</h6>
                        <ComboBox
                          options={ports?.map((v) => ({
                            id: v.port_id,
                            name: v.port_name,
                          }))}
                          value={computedState.destination_port_id}
                          onChange={(e) =>
                            setState({ ...state, destination_port_id: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Airline</h6>
                        <ComboBox
                          options={liners?.map((v) => ({
                            id: v.liner_id,
                            name: v.liner_name,
                          }))}
                          value={computedState.liner_id}
                          onChange={(e) => setState({ ...state, liner_id: e })}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Transportation</h6>
                        <ComboBox
                          options={transport?.map((v) => ({
                            id: v.Transportation_provider,
                            name: v.name,
                          }))}
                          value={computedState.Transportation_provider}
                          onChange={(e) =>
                            setState({ ...state, Transportation_provider: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Clearance</h6>
                        <ComboBox
                          options={clearance?.map((v) => ({
                            id: v.Clearance_provider,
                            name: v.name,
                          }))}
                          value={computedState.Clearance_provider}
                          onChange={(e) =>
                            setState({ ...state, Clearance_provider: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3">
                        <h6>Freight Provider</h6>
                        <ComboBox
                          options={freights?.map((v) => ({
                            id: v.Freight_provider,
                            name: v.name,
                          }))}
                          value={computedState.Freight_provider_}
                          onChange={(e) =>
                            setState({ ...state, Freight_provider_: e })
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>EX Rate</h6>
                        <input
                          type="number"
                          value={computedState.fx_rate}
                          onChange={handleChange}
                          name="fx_rate"
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Markup Rate</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="number"
                              placeholder="0"
                              value={computedState.mark_up}
                              onChange={handleChange}
                              name="mark_up"
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6> Rebate</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="number"
                              placeholder="0"
                              onChange={handleChange}
                              value={computedState.rebate || 0}
                              name="rebate"
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Palletized</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large" onclick="">
                            <input
                              name="palletized"
                              id="Palletized"
                              checked={computedState.palletized}
                              onChange={() => {
                                setState((prevState) => {
                                  return {
                                    ...prevState,
                                    palletized: !prevState.palletized,
                                  };
                                });
                              }}
                              type="checkbox"
                            />
                            <span>
                              <span>OFF</span>
                              <span>ON</span>
                            </span>
                            <a></a>
                          </label>
                          <label htmlFor="Palletized">Palletized</label>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>CO from Chamber</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large" onclick="">
                            <input
                              name="Chamber"
                              id="Chamber"
                              checked={computedState.Chamber}
                              onChange={() => {
                                setState((prevState) => {
                                  return {
                                    ...prevState,
                                    Chamber: !prevState.Chamber,
                                  };
                                });
                              }}
                              type="checkbox"
                            />
                            <span>
                              <span>OFF</span>
                              <span>ON</span>
                            </span>
                            <a> </a>
                          </label>
                          <label htmlFor="Chamber">CO from Chamber</label>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Loading Date</h6>
                        <input
                          type="date"
                          onChange={handleChange}
                          value={computedState.load_date}
                          name="load_date"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between flex-wrap">
                      {!isReadOnly && (
                        <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                          <button
                            type="button"
                            className=""
                            onClick={() => calculate()}
                          >
                            Calculate
                          </button>
                          {!isError && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDetails(null);
                                setToEditDetails({});
                                openModal();
                              }}
                            >
                              Add
                            </button>
                          )}
                        </div>
                      )}
                      {isError && (
                        <div className="my-4 text-red-500">
                          <i className="mdi mdi-alert" /> Please adjust Select
                          ITF to complete a box
                        </div>
                      )}
                      <div className="addBtnEan mb-4">
                        <button type="button" onClick={reCalculate}>
                          Recalculate
                        </button>
                      </div>
                    </div>
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                    >
                      <table
                        id="example"
                        className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ITF</th>
                            <th>Brand Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th> Number of Box</th>
                            <th>NW</th>
                            <th>Unit Price</th>
                            <th>Adjust Price</th>
                            <th>Profit</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {details?.map((v, i) => (
                            <tr
                              className={[
                                "rowCursorPointer",
                                +v.Number_of_boxes % 1 != 0
                                  ? "bg-red-500/50 [&>td]:!text-red-900"
                                  : "",
                              ].join(" ")}
                            >
                              <td>{v.itf_name_en}</td>
                              <td>{v.brand_name}</td>
                              <td>{v.itf_quantity}</td>
                              <td>{v.unit_name_en}</td>
                              <td>{v.Number_of_boxes}</td>
                              <td>{v.net_weight}</td>
                              <td>{v.NEW_UNIT_FX}</td>
                              <td>
                                {v.adjusted_price}
                                {/* {(+v.adjusted_price || 0).toLocaleString()} */}
                              </td>
                              <td>{v.NEW_Profit_percentage}%</td>
                              <td>
                                {!isReadOnly && v.status !== 0 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDetailsEdit(i);
                                        setToEditDetails({});
                                        openModal();
                                      }}
                                    >
                                      <i className="mdi mdi-pencil text-2xl" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteDetail(i);
                                      }}
                                    >
                                      <i className="mdi mdi-minus text-2xl" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid md:grid-cols-3 grid-cols-1 my-4">
                      <div>
                        Total NW{" "}
                        <b>{(+summary?.Net_Weight || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total FOB <b>{(+summary?.FOB || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Commission{" "}
                        <b>{(+summary?.Commission || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total GW{" "}
                        <b>{(+summary?.Gross_weight || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Freight{" "}
                        <b>{(+summary?.Freight || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Rebate{" "}
                        <b>{(+summary?.Rebate || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Box{" "}
                        <b>{(+summary?.Total_Box || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total CNF <b>{(+summary?.CNF || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Profit{" "}
                        <b>{(+summary?.Profit || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total CBM <b>{(+summary?.CBM || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total CNF FX{" "}
                        <b>{(+summary?.CNF_Price_FX || 0).toLocaleString()}</b>
                      </div>
                    </div>
                    {/* {(gross && freight) || gross || freight ? (
                      <p className="text-red-500">
                        <i className="mdi mdi-alert" />
                        {`${grossMass}  `}
                        &nbsp;
                        {freightMass}
                      </p>
                    ) : (
                      <></>
                    )} */}
                  </form>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {!isError ? (
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="signup"
                  onClick={() => update()}
                >
                  Create
                </button>
              ) : (
                ""
              )}

              {/* <Link className="btn btn-danger" to={"/orders"}>
                Cancel
              </Link> */}
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => deleteOrder()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
            <h3>Edit Details</h3>
            <div className="formEan formCreate">
              <div className="form-group mb-3">
                <label>ITF</label>
                <ComboBox
                  options={itf?.map((v) => ({
                    id: v.itf_id,
                    name: v.itf_name_en,
                  }))}
                  value={toEditDetails?.ITF ?? defaultDetailsValue?.ITF}
                  onChange={(e) => setToEditDetails((v) => ({ ...v, ITF: e }))}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.itf_quantity ??
                    defaultDetailsValue?.itf_quantity ??
                    0
                  }
                  name="itf_quantity"
                  onChange={updateDetails}
                />
              </div>
              <div className="form-group mb-3">
                <h6>Brands</h6>
                <ComboBox
                  options={brands?.map((v) => ({
                    id: v.brand_id,
                    name: v.Brand_name,
                  }))}
                  value={
                    toEditDetails?.brand_id ?? defaultDetailsValue?.brand_id
                  }
                  onChange={(e) =>
                    setToEditDetails((v) => ({ ...v, brand_id: e }))
                  }
                />
              </div>
              <div className="form-group mb-3">
                <label>Unit</label>
                <ComboBox
                  options={unit?.map((v) => ({
                    id: v.unit_id,
                    name: v.unit_name_en,
                  }))}
                  value={
                    toEditDetails?.itf_unit ?? defaultDetailsValue?.itf_unit
                  }
                  onChange={(e) =>
                    setToEditDetails((v) => ({ ...v, itf_unit: e }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Adjustment price</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.adjusted_price ??
                    defaultDetailsValue?.adjusted_price ??
                    0
                  }
                  name="adjusted_price"
                  onChange={updateDetails}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={saveNewDetails}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={show} onHide={handleClose} className="exampleQuo">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Freight or Transport Error
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck">
              <p className="text-red-500">
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
         
        </div>
      </Modal>
      {/* <div
        className="modal fade"
        id="exampleQuo"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Freight or transport Error
              </h1>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeIcon}
              >
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                {" "}
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default CreateOrder;
