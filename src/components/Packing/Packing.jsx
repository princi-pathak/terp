import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";

const EanPacking = () => {
  const [data, setData] = useState([]);
  const getEanPackaging = () => {
    axios.get(`${API_BASE_URL}/getToPack`).then((res) => {
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getEanPackaging();
  }, []);

  const [id, setId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restoredRows, setRestoredRows] = useState([]);

  const form = useForm({
    defaultValues: {
      USER: localStorage.getItem("id"),
      Sorting_id: id,
      Qty_on_hand: "",
      Crates_on_hand: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/Adjust_sorting_stock`,
          {
            ...value,
            Qty_on_hand: parseInt(value.Qty_on_hand, 10),
            Crates_on_hand: parseInt(value.Crates_on_hand, 10),
          }
        );
        console.log(response.status); // Log the response object
        if (response.status == 200) {
          toast.success("Ean Packing update successful");
          getEanPackaging();
          setIsOpen(false);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (id = null) => {
    setId(id);
    form.reset();
    setIsOpen(true);
  };

  const restoreEanPackage = (id, id1) => {
    if (restoredRows.includes(id)) {
      return; // Do nothing if already restored
    }

    axios
      .post(`${API_BASE_URL}/restoreEanPacking`, {
        sorting_id: id,
        pod_code: id1,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        if (response?.data?.success == false) {
          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getEanPackaging();
        }
        console.log(response);
        if (response?.data?.success == true) {
          getEanPackaging();
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        }

        setRestoredRows([...restoredRows, id]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "pod_code",
      },
      {
        Header: "Name",
        accessor: "produce",
      },
      {
        Header: "Quantity",
        accessor: "available_qty",
      },
      {
        Header: "Unit",
        accessor: "Unit",
      },
      {
        Header: "Cost",
        accessor: "sorted_cost",
      },
      {
        Header: "Actions",
        accessor: (a) => {
          return (
            <>
              <Link state={{ from: a }} to="/newEanPacking">
                <i
                  className="mdi mdi-check"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </Link>
              <button type="button" onClick={() => openModal(a.sorting_id)}>
                <i
                  className="mdi mdi-delete"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
              <button
                type="button"
                onClick={() => restoreEanPackage(a.sorting_id, a.pod_code)}
                disabled={restoredRows.includes(a.sorting_id)}
              >
                <i
                  className="mdi mdi-restore"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
            </>
          );
        },
      },
    ],
    [restoredRows]
  );

  return (
    <>
      <Card title="EAN Packing Management">
        <TableView columns={columns} data={data} />
      </Card>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
            <h3>Edit Details</h3>
            <form.Provider>
              <form
                className="formEan formCreate"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <div className="form-group">
                  <label>Quantity on Hand</label>
                  <form.Field
                    name="Qty_on_hand "
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
                  <label>Crates on Hand</label>
                  <form.Field
                    name="Crates_on_hand "
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
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={closeModal}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </form.Provider>
          </div>
        </div>
      )}
    </>
  );
};

export default EanPacking;
