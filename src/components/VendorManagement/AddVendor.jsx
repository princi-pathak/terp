import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";

const AddVendor = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();
  const [state, setState] = useState({
    user_id: localStorage.getItem("id"),

    vendor_id: from?.vendor_id ?? undefined,
    name: from?.name ?? "",
    id_card: from?.id_card ?? "",
    Entity: from?.Entity ?? "",
    address: from?.address ?? "",
    subdistrict: from?.subdistrict ?? "",
    district: from?.district ?? "",
    provinces: from?.provinces ?? "",
    postcode: from?.postcode ?? "",
    country: from?.country ?? "",
    line_id: from?.line_id ?? "",
    phone: from?.phone ?? "",
    email: from?.email ?? "",
    bank_name: from?.bank_name ?? "",
    bank_number: from?.bank_number ?? "",
    bank_account: from?.bank_account ?? "",
  });
  const { data: dropdownVendor } = useQuery("getDropdownVendor");
  const { data: dropdownProvinces } = useQuery("getDropdownAddressProvinces");
  const { data: dropdownDistrict } = useQuery("getDropdownAddressDistrict");
  const { data: dropdownSubDistrict } = useQuery(
    "getDropdownAddressSub-district"
  );
  const availableDistrict = useMemo(() => {
    return dropdownDistrict?.filter((item) => item._id == state.provinces);
  }, [state.provinces, dropdownDistrict]);

  const availableSubDistrict = useMemo(() => {
    return dropdownSubDistrict?.filter((item) => item._id == state.district);
  }, [state.provinces, dropdownDistrict, state.district, dropdownSubDistrict]);
  useEffect(() => {
    const p = dropdownSubDistrict?.find(
      (item) => item.code == state.id
    )?.zipcode;
    if (p)
      setState((prevState) => {
        return {
          ...prevState,
          postcode: p,
        };
      });
  }, [state.subdistrict, dropdownSubDistrict]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updateVendor = async () => {
    try {
      setIsButtonClicked(true); // Set button clicked state to true
      await axios.post(
        `${API_BASE_URL}/${
          typeof state.vendor_id == "undefined" ? "addVendor" : "vendorUpdate"
        }`,
        state
      );
      toast.success("Success");

      navigate("/vendor");
    } catch (error) {
      toast.error("Error while saving information");
    }
  };

  const { t, i18n } = useTranslation();

  return (
    <Card
      title={`Vendor Management /
		${typeof state.vendor_id !== "undefined" ? "Update" : "Create"}
		Form`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="form-group col-lg-4">
                      <h6>Name</h6>
                      <input
                        type="text"
                        id="name_th"
                        onChange={handleChange}
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        defaultValue={state.name}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>ID Card</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="id_card"
                        className="form-control"
                        placeholder="ID Card"
                        defaultValue={state.id_card}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Entity</h6>
                      <select
                        onChange={handleChange}
                        value={state.Entity}
                        name="Entity"
                        id=""
                        className=""
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {dropdownVendor?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.entity_name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-12">
                      <h6>Address</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="address"
                        className="form-control"
                        placeholder="Address"
                        defaultValue={state.address}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6 className="whitespace-nowrap">Postal Code</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="postcode"
                        className="form-control"
                        placeholder="Postal Code"
                        defaultValue={state.postcode}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Province</h6>
                      <select
                        onChange={handleChange}
                        value={state.provinces}
                        name="provinces"
                        id=""
                        className=""
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {dropdownProvinces?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>District</h6>
                      <select
                        onChange={handleChange}
                        value={state.district}
                        name="district"
                        id=""
                        className=""
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {availableDistrict?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Sub District</h6>
                      <select
                        onChange={handleChange}
                        value={state.subdistrict}
                        name="subdistrict"
                        id=""
                        className=""
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {availableSubDistrict?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-4">
                      <h6>Line ID</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="line_id"
                        className="form-control"
                        placeholder="LINE ID"
                        defaultValue={state.line_id}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Phone</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="phone"
                        className="form-control"
                        placeholder="Phone"
                        defaultValue={state.phone}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Email</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        defaultValue={state.email}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Bank</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_name"
                        className="form-control"
                        placeholder="Bank Name"
                        defaultValue={state.bank_name}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Bank Number</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_number"
                        className="form-control"
                        placeholder="Bank Number"
                        defaultValue={state.bank_number}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>Name of bank holder</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_account"
                        className="form-control"
                        placeholder="Name of Bank account holder"
                        defaultValue={state.bank_account}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={updateVendor}
              disabled={isButtonClicked} // Disable button if it has been clicked
            >
              {typeof state.vendor_id !== "undefined" ? "Update" : "Create"}
            </button>
            <Link className="btn btn-danger" to={"/vendor"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddVendor;
