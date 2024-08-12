import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"

const Acceptreceiving = () => {
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)

	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}

	const defaultState = {
		pod_code: from?.pod_code,
		rcv_crate: from?.crates,
		rcvd_qty: from?.qty_to_rcv,
		rcv_crate_weight: "",
		rcv_gross_weight: "",
		rcvd_unit_id: from?.unit_id,
		user_id:localStorage.getItem("id"),
	}

	const [state, setState] = useState(defaultState)
	const [unitType, setUnitType] = useState([])

	const getUnitType = () => {
		axios
			.get(`${API_BASE_URL}/getAllUnit`)
			.then((response) => {
				setUnitType(response.data.data || [])
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getUnitType()
	}, [])

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	const addBank = () => {
		if (isButtonDisabled) return;
		setIsButtonDisabled(true);
	
		axios
			.post(`${API_BASE_URL}/addreceving`, {
				...state,
				pod_type_id: from?.pod_type_id,
				user_id:localStorage.getItem("id")

			})
			.then((response) => {
				console.log(response, "Check response");
				toast.success("receiving Added Successfully", {
					autoClose: 1000,
					theme: "colored",
				});
				navigate("/receiving");
			})
			.catch((error) => {
				console.log(error);
				setIsButtonDisabled(false); // Re-enable the button on error
			});
	};
	
	return (
		<main className="main-content">
			<div className="container-fluid">
				<nav
					className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
					id="navbarBlur"
					navbar-scroll="true"
				>
					<div className="container-fluid py-1 px-0">
						<nav aria-label="breadcrumb"></nav>
					</div>
				</nav>

				<div className="container-fluid pt-1 py-4 px-0">
					<div className="row">
						<div className="col-lg-12 col-md-12 mb-4">
							<div className="bg-white">
								<div className="databaseTableSection pt-0">
									<div className="grayBgColor" style={{ padding: "18px" }}>
										<div className="row">
											<div className="col-md-6">
												<h6 className="font-weight-bolder mb-0">
													Operation / Accept Reciving
												</h6>
											</div>
										</div>
									</div>

									<div className="top-space-search-reslute">
										<div className="tab-content px-2 md:!px-4">
											<div
												className="tab-pane active"
												id="header"
												role="tabpanel"
											>
												<div
													id="datatable_wrapper"
													className="information_dataTables dataTables_wrapper dt-bootstrap4"
												>
													<div className="d-flex exportPopupBtn"></div>
													<div className="formCreate">
														<form action="">
															<div className="row">
																<div className="form-group col-lg-3">
																	<h6>POD Code</h6>
																	<input
																		type="text"
																		name="rcv_crate"
																		className="form-control border-0"
																		readOnly
																		value={from?.pod_code}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Name</h6>
																	<input
																		type="text"
																		name="rcv_crate"
																		className="form-control border-0"
																		readOnly
																		value={from?.produce_name}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Unit</h6>
																	<input
																		type="text"
																		name="rcv_crate"
																		className="form-control border-0"
																		readOnly
																		value={from?.unit}
																	/>
																</div>
															</div>
															<div className="row">
																<div className="form-group col-lg-3">
																	<h6>Crate</h6>
																	<input
																		onChange={handleChange}
																		type="text"
																		name="rcv_crate"
																		className="form-control"
																		value={state.rcv_crate}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Quantity</h6>
																	<input
																		onChange={handleChange}
																		type="text"
																		name="rcvd_qty"
																		className="form-control"
																		value={state.rcvd_qty}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Crate Weight</h6>
																	<input
																		onChange={handleChange}
																		type="text"
																		name="rcv_crate_weight"
																		className="form-control"
																		value={state.rcv_crate_weight}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Gross Weight</h6>
																	<input
																		onChange={handleChange}
																		type="text"
																		name="rcv_gross_weight"
																		className="form-control"
																		value={state.rcv_gross_weight}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Unit</h6>
																	<select
																		onChange={handleChange}
																		name="rcvd_unit_id"
																		className="form-control"
																		value={state.rcvd_unit_id}
																	>
																		<option value="">Select Unit</option>
																		{unitType.map((unit) => (
																			<option value={unit.unit_id}>
																				{unit.unit_name_en}
																			</option>
																		))}
																	</select>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="card-footer">
												<button
													onClick={addBank}
													className="btn btn-primary"
													disabled={isButtonDisabled}
													type="submit"
													name="signup"
												>
													Accept
												</button>
												<Link className="btn btn-danger" to="/receiving">
													Cancel
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Acceptreceiving
