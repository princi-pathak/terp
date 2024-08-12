import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { ComboBox } from "../combobox";

export const EanRepack = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const { from } = location.state || {};
  

  const form = useForm({
    defaultValues: {
      packing_ean_id: from?.packing_ean_id || "",
      name: from?.name || "",
      oldqty: from?.qty_available || "",
      start_time: "",
      end_time: "",
      number_of_staff: "",
      user_id:localStorage.getItem("id"),
      details: [
        {
          eanID: "",
          quantity: "",
          unit: "",
          brand: "",
        },
      ],
    },
    onSubmit: async ({ value }) => {
      if (!value.details.length) return toast.error("Please add ean");
      if (value.details[value.details.length - 1].eanID === "")
        return toast.error("Please select ean");
      // console.log(value)
      try {
        await axios.post(`${API_BASE_URL}/doRepackEan`, value);
        toast.success("Repack Ean success");
        navigate("/adjustEan");
      } catch (e) {
        toast.error("Something went wrong");
      }
    },
  });

  // const handleNewSlecter = () => {
  //   axios
  //     .post(`https://siameats.com/api/AssignOrderDropDownList`,{
  //       produce_id:from.Produce_id
  //     })
  //     .then((response) => {
  //       console.log(response.data.data[0], "this is new item");
  //       setAssigned(response.data.data[0]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // useEffect(() => {
  //   handleNewSlecter();
  // }, []);


  const { data: units } = useQuery("getAllUnit");
  const { data: brands } = useQuery("getBrand");
  const { data: eanList } = useQuery(
    `getAdjustEanStockById?id=${from?.ean_id}`
  );
  const fetchUsers = () => {
    return axios.post(`${API_BASE_URL}/dropDownAdjustEan`, {
      produce_id: from.produce_id,
    })
    .then((response) => {
      console.log(response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  };
  
  const { data, status } = useQuery("users", fetchUsers);
  console.log(data,'this is ENS DAta')
  return (
    <Card title={"Repack Ean"}>
      <div className="formCreate ">
        <form.Provider>
          <form
            className="formEan formCreat px-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="form-group">
                <label>Name</label>
                <form.Field
                  name="name"
                  children={(field) => (
                    <input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      disabled
                      className="border-0"
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="form-group">
                <label>New Quantity</label>
                <form.Field
                  name="oldqty"
                  children={(field) => (
                    <input
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>Number of staff</label>
                <form.Field
                  name="number_of_staff"
                  children={(field) => (
                    <input
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <form.Field
                  name="start_time"
                  children={(field) => (
                    <input
                      type="time"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <form.Field
                  name="end_time"
                  children={(field) => (
                    <input
                      type="time"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
            <form.Field
              name="details"
              mode="array"
              children={(eanField) => (
                <>
                  <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const t =
                          eanField.state.value[eanField.state.value.length - 1];
                        if (!t?.eanID || !t?.quantity || !t?.unit)
                          return toast.error("Please select ean");
                        eanField.pushValue({
                          eanID: "",
                          quantity: "",
                          unit: "",
                          brand: "",
                        });
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div
                    id="datatable_wrapper"
                    className="mt-4 information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>EAN</th>
                          <th>Quanlity</th>
                          <th>Unit</th>
                          <th>Brand</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!eanField.state.value.length
                          ? null
                          : eanField.state.value.map((_, i) => (
                              <tr key={`tab_${i}`}>
                                <td>
                                  <eanField.Field
                                    name="eanID"
                                    index={i}
                                    children={(field) => (
                                      <ComboBox
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e)}
                                        options={(data || [])?.map((v) => ({
                                          id: v?.ean_id,
                                          name: v?.New_ean_name_en,
                                        }))}
                                      />
                                    )}
                                  />
                                </td>
                                <td>
                                  <eanField.Field
                                    index={i}
                                    name="quantity"
                                    children={(field) => {
                                      return (
                                        <input
                                          id={field.name}
                                          name={field.name}
                                          value={field.state.value}
                                          onBlur={field.handleBlur}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                        />
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <eanField.Field
                                    name="unit"
                                    index={i}
                                    children={(field) => (
                                      <ComboBox
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e)}
                                        options={(units || [])?.map((v) => ({
                                          id: v?.unit_id,
                                          name: v?.unit_name_en,
                                        }))}
                                      />
                                    )}
                                  />
                                </td>
                                <td>
                                  <eanField.Field
                                    name="brand"
                                    index={i}
                                    children={(field) => (
                                      <ComboBox
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e)}
                                        options={(brands || [])?.map((v) => ({
                                          id: v?.brand_id,
                                          name: v?.Brand_name,
                                        }))}
                                      />
                                    )}
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="text-xl"
                                    onClick={() => {
                                      if (eanField.state.value.length === 1)
                                        return toast.error(
                                          "Can not remove EAN"
                                        );
                                      eanField.removeValue(i);
                                    }}
                                  >
                                    <i className="mdi mdi-minus" />
                                  </button>
                                </td>
                                {/* <hobbiesField.Field
																	index={i}
																	name="name"
																	children={(field) => {
																		return (
																			<div>
																				<label htmlFor={field.name}>
																					Name:
																				</label>
																				<input
																					id={field.name}
																					name={field.name}
																					value={field.state.value}
																					onBlur={field.handleBlur}
																					onChange={(e) =>
																						field.handleChange(e.target.value)
																					}
																				/>
																				<button
																					type="button"
																					onClick={() =>
																						hobbiesField.removeValue(i)
																					}
																				>
																					X
																				</button>
																				<FieldInfo field={field} />
																			</div>
																		)
																	}}
																/> */}
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            />

            <div className="card-footer">
              <button className="btn btn-primary" type="submit" name="signup">
                Update
              </button>
              <Link className="btn btn-danger" to={"/orders"}>
                Cancel
              </Link>
            </div>
          </form>
        </form.Provider>
      </div>
    </Card>
  );
};
