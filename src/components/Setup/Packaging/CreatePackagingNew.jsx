import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"

const CreatePackagingNew = () => {
	const defaultState = {
		packaging_name: "",
		Inventory_ID: "",
		packaging_inventory_type_id: 0,
		packaging_weight: "",
	}

	const [state, setState] = useState(defaultState)

	const navigate = useNavigate()

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	const addPackaging = () => {
		const request = {
			user_id:localStorage.getItem("id"),
			packaging_name: state.packaging_name,
			Inventory_ID: state.Inventory_ID,
			packaging_inventory_type_id: state.packaging_inventory_type_id,
			packaging_weight: state.packaging_weight,
		}

		console.log(request, "check requestttttt")

		const fieldCheck =
			request.packaging_name == "" ||
			// request.Inventory_ID == "" ||
			request.packaging_inventory_type_id == "" ||
			request.packaging_weight == ""

		if (fieldCheck) {
			toast.warn("Please Fill All The Fields", {
				autoClose: 1000,
				theme: "colored",
			})
			return false
		}
		axios
			.post(`${API_BASE_URL}/addPackage`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success("Created Successfully", {
						autoClose: 1000,
						theme: "colored",
					})

					navigate("/packagingNew")
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<Card title="Packaging Management / Create Form">
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
															placeholder="packaging_name"
															name="packaging_name"
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Weight</h6>
											{/* <div className="parentShip">
                                                                        <div className="markupShip">
                                                                            <input type="number" placeholder='weight' onChange={handleChange} name='packaging_weight'/>
                                                                        </div>
                                                                        <div className="shipPercent">
                                                                            <span>g</span>
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
													/>
												</div>
												<div className="shipPercent">
													<span>g</span>
												</div>
											</div>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Inventory Type</h6>
											<div className="parentInventory ">
												<label htmlFor="html1">Inventory</label>
												<input
													onChange={handleChange}
													className="radio"
													type="radio"
													id="html1"
													name="packaging_inventory_type_id"
													value={0}
												/>
												<label htmlFor="css1">Non Inventory </label>
												<input
													type="radio"
													name="packaging_inventory_type_id"
													onChange={handleChange}
													id="css1"
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
						<div className="card-footer">
							<button
								className="btn btn-primary"
								type="submit"
								name="signup"
								onClick={addPackaging}
							>
								Create
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

export default CreatePackagingNew
