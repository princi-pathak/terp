import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"

const UpdatePackaging = () => {
	const location = useLocation()
	const { from } = location.state || {}
	const navigate = useNavigate()
	const [selected, setSelected] = useState(
		from?.packaging_inventory_type_id || "",
	)

	const radioHandleChange = (event) => {
		setSelected(event.target.value)
	}

	const defalutState = {
		packaging_name: from?.packaging_name || "",
		packaging_weight: from?.packaging_weight || "",
		Inventory_ID: from?.Inventory_ID || "",
		packaging_inventory_type_id: from?.packaging_inventory_type_id || "",
	}

	const [editPackageData, setEditPackageData] = useState(defalutState)

	const handleChange = (event) => {
		const { name, value } = event.target
		setEditPackageData((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	const EditPackaging = async () => {
		const request = {
			packaging_id: from?.packaging_id,
			packaging_name: editPackageData.packaging_name,
			packaging_weight: editPackageData.packaging_weight,
			Inventory_ID: editPackageData.Inventory_ID,
			packaging_inventory_type_id: editPackageData.packaging_inventory_type_id,
		}

		await axios
			.post(`${API_BASE_URL}/updatePackaging`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					navigate("/packagingNew")
					return
				}

				if (response.data.success == false) {
					toast.error(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// Edit Packaging Api

	return (
		<Card title="Packaging Management / Edit Form">
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4"
						>
							<div className="formCreate createPackage">
								<form action="">
									<div className="row justify-content-center">
										<div className="col-lg-3 form-group">
											<h6>Pack</h6>
											<div className="thbFrieght">
												<div className="parentthb packParent">
													<div className="childThb">
														<input
															type="text"
															onChange={handleChange}
															name="packaging_name"
															defaultValue={from?.packaging_name}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Weight</h6>
											{/* <div className="thbFrieght">
                                                                    <div className="parentthb">
                                                                        <div className="childThb">
                                                                            <input type="text" onChange={handleChange} name='packaging_weight' defaultValue={from?.packaging_weight}/>
                                                                        </div>
                                                                        <div className="childThbBtn">
                                                                            <p>g</p>
                                                                        </div>
                                                                    </div>
                                                                </div> */}

											<div className="parentShip">
												<div className="markupShip">
													<input
														type="text"
														id="name_en"
														name="packaging_weight"
														onChange={handleChange}
														className="form-control"
														placeholder="weight"
														defaultValue={editPackageData.packaging_weight}
													/>
												</div>
												<div className="shipPercent">
													<span>g</span>
												</div>
											</div>
										</div>
										<div className="col-lg-3 form-group">
											<h6> Inventory Id </h6>
											<div className="thbFrieght">
												<div className="parentthb packParent">
													<div className="childThb">
														<input
															onChange={handleChange}
															name="Inventory_ID"
															type="text"
															defaultValue={from?.Inventory_ID}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Inventory Type</h6>
											<div className="parentInventory ">
												<label htmlFor="html1">Inventory</label>
												<input
													onChange={(e) => {
														handleChange(e)
														radioHandleChange(e)
													}}
													className="radio"
													checked={selected == 0}
													type="radio"
													id="html1"
													name="packaging_inventory_type_id"
													value={0}
												/>
												<label htmlFor="css1">Non Inventory </label>
												<input
													onChange={(e) => {
														handleChange(e)
														radioHandleChange(e)
													}}
													type="radio"
													checked={selected == 1}
													id="css1"
													name="packaging_inventory_type_id"
													value={1}
												/>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="d-flex justify-content-center">
						<div className="card-footer ">
							<button
								onClick={EditPackaging}
								className="btn btn-primary"
								type="submit"
								name="signup"
							>
								Update
							</button>
							<Link className="btn btn-danger" to="/packagingNew">
								Cancel
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default UpdatePackaging
