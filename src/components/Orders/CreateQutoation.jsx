import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import { Button, Modal } from "react-bootstrap";

const CreateQutoation = () => {
  const location = useLocation();
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [toEditDetails, setToEditDetails] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tableAllData, setTableAllData] = useState([]);
  const [consignees, setConsignees] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  console.log(massageShow);
  console.log(massageShow1);
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isReadOnly = from?.isReadOnly;

  const [isLoading, setIsLoading] = useState(false);
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
    quotation_id: from?.quotation_id,
    Quote_Number: from?.Quote_Number,
    user_id: localStorage.getItem("id"),
    brand_id: from?.brand_id,
    client_id: from?.client_id,
    loading_location: from?.loading_location,
    Freight_provider_: from?.Freight_provider_,
    liner_id: from?.liner_id,
    quote_id: from?.quote_id || "",

    from_port_: from?.from_port_,
    destination_port_id: from?.destination_port_id,
    Clearance_provider: from?.Clearance_provider,
    Transportation_provider: from?.Transportation_provider,
    consignee_id: from?.consignee_id,
    fx_id: from?.fx_id,
    mark_up: from?.mark_up,
    rebate: from?.rebate,
    palletized: from?.palletized,
    Chamber: from?.Chamber,
    load_date: from?.load_Before_date
      ? new Date(from?.load_Before_date).toISOString().slice(0, 10)
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
  const { data: quote } = useQuery("getAllQuotation");

  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");
  useEffect(() => {
    quotationTableData();
    getSummary();
    getQuotationDetails();
    getToCopyDetails();
  }, [deleteOrderId, gross, freight]);
  const [editValues, setEditValues] = useState([]);
  const handleEditValues = (index, e) => {
    if (isReadOnly || isLoading) return;
    const newEditProduce = [...editValues];
    newEditProduce[index][e.target.name] = e.target.value;
    setEditValues(newEditProduce);
  };
  const getQuotationDetails = () => {
    if (!state.quote_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationDetials?quote_id=${state.quote_id}`)
      .then((response) => {
        if (response.data.data.length) setEditValues(response.data.data);
      });
  };
  const [formValues, setFormValues] = useState([
    {
      ITF: "",
      itf_quantity: 0,
      itf_unit: "",
      Number_of_boxes: "",
      net_weight: "",
      exw_cost: "",
      cbm: "",
      calculated_price: 0,
    },
  ]);
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
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getQuotationDetailsView?quotation_id=${state.quotation_id}`,
    {
      enabled: !!state.quotation_id,
    }
  );
  console.log(from?.quotation_id);

  console.log(details);
  useEffect(() => {
    if (state.quotation_id) getOrdersDetails();
  }, []);
  console.log(details);
  const defaultDetailsValue = useMemo(() => {
    return details?.[selectedDetails] || null;
  }, [selectedDetails]);
  console.log(defaultDetailsValue);

  const updateDetails = (e) => {
    if (isReadOnly || isLoading) return;
    setToEditDetails((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const saveNewDetails = async () => {
    console.log(gross);
    console.log(freight);
    const values = {
      ...toEditDetails,
      user: localStorage.getItem("id"),

      ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
      Quantity: toEditDetails?.Quantity ?? defaultDetailsValue?.itf_quantity,
      Unit: toEditDetails?.Unit ?? defaultDetailsValue?.itf_unit,
      quotation_price:
        toEditDetails?.quotation_price ??
        defaultDetailsValue?.Quotation_price ??
        0,
      qod_id: defaultDetailsValue?.qod_id || undefined,
      // od_id:"91",

      Brand: toEditDetails?.Brand ?? defaultDetailsValue?.brand_id ?? undefined,
      is_changed: true,
    };
    // if (!values.ITF || !values.Quantity || !values.Unit)
    //   return toast.error("Please fill all fields");
    loadingModal.fire();
    closeModal();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/insertQuotationDetails`,
        {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: !!computedState.palletized,
            Chamber: !!computedState.Chamber,
          },
          details: values,
        }
      );
      console.log(data); // Add this line to log the response
      //   setOrderId(data?.order_id);
      // console.log(data.order_id)
      getSummary();
      getOrdersDetails();
      quotationTableData();

      toast.success("Quotation detail added successfully");
      if ((gross && freight) || gross || freight) {
        setShow(true);
      } else {
        setShow(false);
      }

      setDeleteOrderId(data.insertId);
      setState((prevState) => {
        return {
          ...prevState,
          quotation_id: data.insertId,
        };
      });
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
  const addFieldHandleChange = (i, e) => {
    if (isReadOnly || isLoading) return;
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    if (isReadOnly || isLoading) return;
    setFormValues([
      ...formValues,
      {
        ITF: "",
        itf_quantity: 0,
        itf_unit: "",
        Number_of_boxes: "",
        net_weight: "",
        exw_cost: "",
        calculated_price: 0,
        cbm: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    if (isReadOnly || isLoading) return;
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
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
  console.log(computedState);
  const update = () => {
    if (isReadOnly || isLoading) return;
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/addQuotation`, computedState)
      .then(async (response) => {
        // let modalElement = document.getElementById("exampleQuo");
        // let modalInstance = bootstrap.Modal.getInstance(modalElement);
        // console.log(response);
        if (response.data.success == false) {
          setShow(true);
          // modalInstance.show();
          setMassageShow(response.data.message);
        } else if (response.data.success == true) {
          // modalInstance.hide();
          setShow(false);
          toast.success("Added Quotation Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/quotation");
        }
      })
      .catch((e) => {
        toast.error("Something went wrong", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .finally(() => {
        setIsLoading(false);
        MySwal.close();
      });
  };
  const [summary, setSummary] = useState({});
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
  const getSummary = () => {
    if (!state.quotation_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationSummary?quote_id=${state.quotation_id}`)
      .then((response) => {
        console.log(response);
        setSummary(response.data.data);
      });
  };
  const deleteQuotationInput = (id) => {
    console.log(id);
    if (isReadOnly || isLoading) return;
    setIsLoading(true);
    axios
      .post(`${API_BASE_URL}/deleteQuotationDetials`, {
        qod_id: id,
        user_id: localStorage.getItem("id"),
      })
      .then(async (response) => {
        console.log(response);
        toast.success("Deleted", {
          autoClose: 1000,
          theme: "colored",
        });
        quotationTableData();
        setEditValues((prevState) => {
          const copyFrom = [...prevState];
          copyFrom.splice(id, 1);
          return copyFrom;
        });
      })
      .catch((e) => {
        toast.error("Something went wrong", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const quotationTableData = () => {
    axios
      .post(`${API_BASE_URL}/getQuotationDetailsView`, {
        quotation_id: state.quotation_id,
      })
      .then((response) => {
        console;
        console.log(response.data.data);
        setTableAllData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getToCopyDetails = () => {
    if (!from?.to_copy_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationDetials?quote_id=${from?.to_copy_id}`)
      .then((response) => {
        setFormValues(response.data.data);
      });
  };
  const calculate = async () => {
    const reai = details?.filter((v) => v.ITF && v.itf_quantity && v.itf_unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/calculateQuotation`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: details?.filter((v) => v.ITF && v.itf_quantity && v.itf_unit),
      });
      console.log(data);
      // let modalElement = document.getElementById("exampleQuo");
      // let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (data.success == false) {
        setShow(true);
        // modalInstance.show();
        setMassageShow1(data.message);
      } else if (data.success == true) {
        setShow(false);
        // modalInstance.hide();

        toast.success("Quotation Calculated successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      }

      setState((prevState) => {
        return {
          ...prevState,
          order_id: data.data,
        };
      });
      await getOrdersDetails(data.data);
      MySwal.close();
      setIsLoading(false);
      getSummary();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      MySwal.close();
      setIsLoading(false);
    }
  };
  const reCalculate = () => {
    axios
      .post(`${API_BASE_URL}/RecalculateOrder`, {
        order_id: summary?.order_id || orderId,
      })
      .then((response) => {
        console.log(response);
        toast.success("Order Recalculate  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOrder = async () => {
    console.log(deleteOrderId);

    if (deleteOrderId) {
      try {
        await axios.post(`${API_BASE_URL}/deleteQuotation`, {
          quotation_id: deleteOrderId,
        });
        toast.success("Quotation cancel successfully");
        navigate("/quotation");
        refetch();
      } catch (e) {
        // toast.error("Something went wrong");
        console.log(e);
      }
    } else {
      navigate("/quotation");
    }
  };
  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }

    if (massageShow1) {
      setMassageShow1("");
    }
  };
  console.log(state);
  return (
    <>
      <Card title={`Quotation Management Create Form`}>
        <div className="formCreate px-4">
          <form action="">
            <div className="row formEan">
              <div className="col-lg-3 form-group">
                <h6> Create Date </h6>
                <input
                  type="date"
                  name="created"
                  onChange={handleChange}
                  value={computedState.created}
                />
              </div>
            </div>
            <div className="row formEan">
              <div className="col-lg-3 form-group">
                <h6>Client</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.client_id}
                    onChange={handleChange}
                    name="client_id"
                  >
                    <option>Select Client</option>
                    {clients?.map((v) => (
                      <option value={v.client_id}>{v.client_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* <div className="col-lg-3 form-group">
                <h6>Consignee</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.consignee_id}
                    onChange={handleChange}
                    name="consignee_id"
                  >
                    <option>Select Consignee</option>
                    {(consignee || [])
                      .filter((v) => v.client_id == state.client_id)
                      ?.map((v) => (
                        <option value={v.consignee_id}>
                          {v.consignee_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div> */}
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
              <div className="col-lg-3 form-group">
                <h6>Brands</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.brand_id}
                    onChange={handleChange}
                    name="brand_id"
                  >
                    <option>Select Brands</option>
                    {brands?.map((v) => (
                      <option value={v.brand_id}>{v.Brand_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Currency</h6>
                <ComboBox
                  options={currency?.map((v) => ({
                    id: v.currency_id,
                    name: v.currency,
                  }))}
                  value={computedState.fx_id}
                  onChange={(e) => setState({ ...state, fx_id: e })}
                />
                {/* <div className="ceateTransport">
                  <select
                    value={computedState.fx_id}
                    onChange={handleChange}
                    name="fx_id"
                  >
                    <option>Select Currency</option>
                    {currency?.map((v) => (
                      <option value={v.fx_id}>{v.currency}</option>
                    ))}
                  </select>
                </div> */}
              </div>
              <div className="col-lg-3 form-group">
                <h6>Loading Location</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.loading_location}
                    onChange={handleChange}
                    name="loading_location"
                  >
                    <option>Select Loading</option>
                    {locations?.map((v) => (
                      <option value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Port of Origin</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.from_port_}
                    onChange={handleChange}
                    name="from_port_"
                  >
                    <option>Select Origin</option>
                    {ports?.map((v) => (
                      <option value={v.port_id}>{v.port_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Port of Destination</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.destination_port_id}
                    onChange={handleChange}
                    name="destination_port_id"
                  >
                    <option>Select Destination</option>
                    {ports?.map((v) => (
                      <option value={v.port_id}>{v.port_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Airline</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.liner_id}
                    onChange={handleChange}
                    name="liner_id"
                  >
                    <option>Select Airline</option>
                    {liners?.map((v) => (
                      <option value={v.liner_id}>{v.liner_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Transportation</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.Transportation_provider}
                    onChange={handleChange}
                    name="Transportation_provider"
                  >
                    <option>Select Transportation</option>
                    {transport?.map((v) => (
                      <option value={v.Transportation_provider}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 form-group">
                <h6>Clearance</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.Clearance_provider}
                    onChange={handleChange}
                    name="Clearance_provider"
                  >
                    <option>Select Clearance</option>
                    {clearance?.map((v) => (
                      <option value={v.Clearance_provider}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>Freight Provider</h6>
                <ComboBox
                  options={freights?.map((v) => ({
                    id: v.Freight_provider,
                    name: v.name,
                  }))}
                  value={computedState.Freight_provider_}
                  onChange={(e) => setState({ ...state, Freight_provider_: e })}
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
                      value={
                        state.mark_up ||
                        consignee?.find(
                          (v) => v.consignee_id == state.consignee_id
                        )?.profit
                      }
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
                      readOnly
                      value={computedState.rebate}
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
                    <a> </a>
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
                <h6>Ship Before Date</h6>
                <input
                  type="date"
                  onChange={handleChange}
                  value={computedState.load_date}
                  name="load_date"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center justify-between flex-wrap">
              {isReadOnly ? null : (
                <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                  <button type="button" onClick={() => calculate()}>
                    Calculate
                  </button>
                  {isReadOnly ? null : (
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
              {!isReadOnly ? null : (
                <div className="my-4 text-red-500">
                  <i className="mdi mdi-alert" /> Please adjust Select ITF to
                  complete a box
                </div>
              )}
              <div className="addBtnEan mb-4">
                <button type="button" onClick={reCalculate}>
                  Recalculate
                </button>
              </div>
            </div>
            {/* <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive w-full"
            >
              <table
                id="example"
                className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ITF</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th> Number of Box</th>
                    <th>NW</th>
                    <th>Unit Price</th>
                    <th>Adjust Price</th>
                    <th>Profit</th>
                    {!isReadOnly && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {editValues?.map((v, i) => (
                    <tr
                      className="rowCursorPointer"
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                    >
                      <td>
                        <select
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.ITF}
                          name="ITF"
                          style={{ width: "280px" }}
                        >
                          <option value="">Select ITF</option>
                          {itf?.map((v) => (
                            <option value={v.itf_id}>{v.itf_name_en}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.itf_quantity}
                          name="itf_quantity"
                          type="number"
                          placeholder="enter quantity"
                        />
                      </td>
                      <td>
                        <select
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.itf_unit}
                          style={{ width: "100px" }}
                          name="itf_unit"
                        >
                          <option value="">Select Unit</option>
                          {unit?.map((v) => (
                            <option value={v.unit_id}>{v.unit_name_en}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          readOnly
                          value={v.Number_of_boxes}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>
                        <input readOnly value={v.net_weight} />
                      </td>
                      <td>
                        <input type="number" value={v.calculated_price} />
                      </td>
                      <td>
                        <input
                          type="number"
                          onChange={(e) => handleEditValues(i, e)}
                          name="adjusted_price"
                          value={v.adjusted_price || 0}
                        />
                      </td>
                      <td>
                        <div className="flex border-2 border-[#203764] rounded-md overflow-hidden items-center">
                          <input
                            className="border-0 w-20 mb-0 !rounded-none"
                            type="number"
                            placeholder="0"
                            value={v.profit_percentage}
                          />
                          <span className="px-1.5 bg-gray-200 py-2">%</span>
                        </div>
                      </td>
                      {!isReadOnly && (
                        <td>
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() =>
                              MySwal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) deleteQuotationInput(i);
                              })
                            }
                          >
                            <i className={"mdi mdi-minus text-2xl"} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {!isReadOnly &&
                    formValues?.map((v, i) => (
                      <tr
                        className="rowCursorPointer"
                        data-bs-toggle="modal"
                        data-bs-target="#myModal"
                      >
                        <td>
                          <select
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.ITF}
                            name="ITF"
                            style={{ width: "280px" }}
                          >
                            <option value="">Select ITF</option>
                            {itf?.map((v) => (
                              <option value={v.itf_id}>{v.itf_name_en}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.itf_quantity}
                            name="itf_quantity"
                            type="number"
                            placeholder="enter quantity"
                          />
                        </td>
                        <td>
                          <select
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.itf_unit}
                            style={{ width: "100px" }}
                            name="itf_unit"
                          >
                            <option value="">Select Unit</option>
                            {unit?.map((v) => (
                              <option value={v.unit_id}>
                                {v.unit_name_en}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            readOnly
                            value={v.Number_of_boxes}
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td>
                          <input readOnly value={v.net_weight} />
                        </td>
                        <td>
                          <input type="number" value={v.calculated_price} />
                        </td>
                        <td>
                          <input
                            type="number"
                            onChange={(e) => addFieldHandleChange(i, e)}
                            name="adjusted_price"
                            value={v.adjusted_price || 0}
                          />
                        </td>
                        <td>
                          <div className="flex border-2 border-[#203764] rounded-md overflow-hidden items-center">
                            <input
                              className="border-0 w-24 mb-0 !rounded-none"
                              type="number"
                              placeholder="0"
                              value={v.profit_percentage}
                            />
                            <span className="px-1.5 bg-gray-200 py-2">%</span>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => removeFormFields(i)}
                          >
                            <i className={"mdi mdi-minus text-2xl"} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}
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
                      <td>{v.Calculated_price}</td>
                      <td>
                        {v.Quotation_price}
                        {/* {(+v.adjusted_price || 0).toLocaleString()} */}
                      </td>
                      <td>{v.NEW_Profit_percentage}%</td>
                      <td>
                        {!isReadOnly && (
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
                                deleteQuotationInput(v.qod_id);
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
          </form>
        </div>

        {/* {isReadOnly ? null : (
				<div className="addBtnEan px-4">
					<button className="mt-0" type="button" onClick={addFormFields}>
						Add
					</button>
				</div>
			)} */}
        <div className="row py-4 px-4">
          <div className="col-lg-4">
            <b> Total NW : </b>
            {summary?.Net_Weight || 0}
          </div>
          <div className="col-lg-4">
            <b> Total FOB : </b>
            {summary?.FOB || 0}
          </div>
          <div className="col-lg-4">
            <b> Total Commission : </b>
            {summary?.Commission || 0}
          </div>
          <div className="col-lg-4">
            <b> Total GW : </b>
            {summary?.Gross_weight || 0}
          </div>
          <div className="col-lg-4">
            <b> Total Freight : </b>
            {summary?.Freight || 0}
          </div>
          <div className="col-lg-4">
            <b> Total Rebate : </b>
            {summary?.rebate || 0}
          </div>
          <div className="col-lg-4">
            <b> Total Box : </b>
            {summary?.Box || 0}
          </div>
          <div className="col-lg-4">
            <b> Total CNF : </b>
            {summary?.CNF || 0}
          </div>
          <div className="col-lg-4">
            <b> Total Profit : </b>
            {summary?.Profit || 0}
          </div>
          <div className="col-lg-4">
            <b> Total CBM : </b>
            {summary?.CBM || 0}
          </div>
          <div className="col-lg-4">
            <b> Total CNF FX : </b>
            {summary?.CNF_FX || 0}
          </div>
          =
        </div>
        <div className="card-footer">
          {!isReadOnly ? (
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              // data-bs-toggle="modal"
              // data-bs-target="#exampleQuo"
              onClick={() => update()}
            >
              Create
            </button>
          ) : (
            ""
          )}

          <button
            className="btn btn-danger"
            type="button"
            onClick={() => deleteOrder()}
          >
            Cancel
          </button>
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
                    toEditDetails?.Quantity ??
                    defaultDetailsValue?.itf_quantity ??
                    0
                  }
                  name="Quantity"
                  onChange={updateDetails}
                />
              </div>
              <div className="form-group mb-3">
                <label>Unit</label>
                <ComboBox
                  options={unit?.map((v) => ({
                    id: v.unit_id,
                    name: v.unit_name_en,
                  }))}
                  value={toEditDetails?.Unit ?? defaultDetailsValue?.itf_unit}
                  onChange={(e) => setToEditDetails((v) => ({ ...v, Unit: e }))}
                />
              </div>
              <div className="form-group mb-3">
                <h6>Brands</h6>
                <ComboBox
                  options={brands?.map((v) => ({
                    id: v.brand_id,
                    name: v.Brand_name,
                  }))}
                  value={toEditDetails?.Brand ?? defaultDetailsValue?.brand_id}
                  onChange={(e) =>
                    setToEditDetails((v) => ({ ...v, Brand: e }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Adjustment price</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.quotation_price ??
                    defaultDetailsValue?.Quotation_price ??
                    0
                  }
                  name="quotation_price"
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
      {/* <Modal show={show} onHide={handleClose}>
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
            >
              <span class="mdi mdi-close"></span>
            </button>
          </div>
          <div className="modal-body">
            <p>No rates available</p>
          </div>
        </div>
      </Modal> */}
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
              <p style={{ color: "#631f37" }}>
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateQutoation;
