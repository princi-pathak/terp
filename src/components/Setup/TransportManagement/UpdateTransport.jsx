import axios from "axios"
import { useState } from "react"
import { useQuery } from "react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"

const UpdateTransport = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}
	const defaultState = {
		user_id:localStorage.getItem("id"),
		transport_id: from?.transport_id || "",
		Transportation_provider: from?.Transportation_provider || 1,
		loading_from: from?.loading_from || 1,
		departure_port: from?.departure_port || 1,
		port_type: from?.port_type_id || 1,
		truck1: from?.truck1 || "",
		max_weight1: from?.max_weight1 || "",
		max_cbm1: from?.max_cbm1 || "",
		max_pallet1: from?.max_pallet1 || "",
		price1: from?.price1 || "",
		truck2: from?.truck2 || "",
		max_weight2: from?.max_weight2 || "",
		max_cbm2: from?.max_cbm2 || "",
		max_pallet2: from?.max_pallet2 || "",
		price2: from?.price2 || "",
		truck3: from?.truck3 || "",
		max_weight3: from?.max_weight3 || "",
		max_cbm3: from?.max_cbm3 || "",
		max_pallet3: from?.max_pallet3 || "",
		price3: from?.price3 || "",
	}

	const [editProduceData, setEditProduceData] = useState(defaultState)
	const { data: vendor } = useQuery("getAllVendor")
	const { data: fromLocation } = useQuery("getLocation")
	const { data: departurePort } = useQuery("getAllAirports")

	const handleChange = (event) => {
		const { name, value } = event.target
		setEditProduceData((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}
	const updatePort = () => {
		axios
			.post(
				`${API_BASE_URL}/${
					typeof from?.transport_id == "undefined"
						? "addTransportation"
						: "updateTransportation"
				}`,
				editProduceData,
			)
			.then((response) => {
				toast[response.data.success == true ? "success" : "error"](
					response.data.message,
					{
						autoClose: 1000,
						theme: "colored",
					},
				)
				if (response.data.success == true) navigate("/transportNew")
			})
			.catch((error) => {
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
	}
	return (
		<Card
			title={`Transportation Management / ${
				typeof from?.transport_id == "undefined" ? "Create" : "Update"
			} Form`}
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
										<div className="col-lg-3 form-group">
											<h6>Vendor</h6>
											<select
												name="Transportation_provider"
												value={editProduceData.Transportation_provider}
												onChange={handleChange}
											>
												{vendor?.map((item) => (
													<option value={item.vendor_id}>{item.name}</option>
												))}
											</select>
										</div>
										<div className="col-lg-3 form-group">
											<h6>From location</h6>
											<select
												name="loading_from"
												value={editProduceData.loading_from}
												onChange={handleChange}
											>
												{fromLocation?.map((item) => (
													<option value={item.id}>{item.name}</option>
												))}
											</select>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Depature Port</h6>
											<select
												name="departure_port"
												value={`${editProduceData.departure_port}_${editProduceData.port_type}`}
												onChange={(e) => {
													const p = e.target.value.split("_")
													setEditProduceData({
														...editProduceData,
														departure_port: p[0],
														port_type: p[1],
													})
												}}
											>
												{departurePort?.map((item) => (
													<option
														value={`${item.port_id}_${item.port_type_id}`}
													>
														{item.port_name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div
										id="datatable_wrapper"
										className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
									>
										<table
											id="example"
											className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
											style={{ width: "100%" }}
										>
											<thead>
												<tr>
													<th>Transportation</th>
													<th>Max Weight</th>
													<th className="w-5">Max CBM</th>
													<th>Pallets</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												<tr
													className="rowCursorPointer"
													data-bs-toggle="modal"
													data-bs-target="#myModal"
												>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="truck1"
																value={editProduceData.truck1}
															/>
														</div>
													</td>

													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_weight1"
																value={editProduceData.max_weight1}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_cbm1"
																value={editProduceData.max_cbm1}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_pallet1"
																value={editProduceData.max_pallet1}
															/>
														</div>
													</td>

													<td>
														<div className="thbFrieght ceateTransport">
															<div className="parentthb">
																<div className="childThb">
																	<input
																		type="text"
																		onChange={handleChange}
																		name="price1"
																		value={editProduceData.price1}
																	/>
																</div>
																<div className="childThbBtn">
																	<p>THB</p>
																</div>
															</div>
														</div>
													</td>
												</tr>

												<tr
													className="rowCursorPointer"
													data-bs-toggle="modal"
													data-bs-target="#myModal"
												>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="truck2"
																value={editProduceData.truck2}
															/>
														</div>
													</td>

													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_weight2"
																value={editProduceData.max_weight2}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_cbm2"
																value={editProduceData.max_cbm2}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_pallet2"
																value={editProduceData.max_pallet2}
															/>
														</div>
													</td>

													<td>
														<div className="thbFrieght ceateTransport">
															<div className="parentthb">
																<div className="childThb">
																	<input
																		type="text"
																		onChange={handleChange}
																		name="price2"
																		value={editProduceData.price2}
																	/>
																</div>
																<div className="childThbBtn">
																	<p>THB</p>
																</div>
															</div>
														</div>
													</td>
												</tr>
												<tr
													className="rowCursorPointer"
													data-bs-toggle="modal"
													data-bs-target="#myModal"
												>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="truck3"
																value={editProduceData.truck3}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_weight3"
																value={editProduceData.max_weight3}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_cbm3"
																value={editProduceData.max_cbm3}
															/>
														</div>
													</td>
													<td>
														<div className="ceateTransport">
															<input
																type="text"
																onChange={handleChange}
																name="max_pallet3"
																value={editProduceData.max_pallet3}
															/>
														</div>
													</td>
													<td>
														<div className="thbFrieght ceateTransport">
															<div className="parentthb">
																<div className="childThb">
																	<input
																		type="text"
																		onChange={handleChange}
																		name="price3"
																		value={editProduceData.price3}
																	/>
																</div>
																<div className="childThbBtn">
																	<p>THB</p>
																</div>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
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
							onClick={updatePort}
						>
							{typeof from?.transport_id == "undefined" ? "Create" : "Update"}
						</button>
						<Link className="btn btn-danger" to={"/transportNew"}>
							Cancel
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default UpdateTransport
