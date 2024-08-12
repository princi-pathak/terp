import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Card } from "../../../card"

const UpdateLocation = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}

	const defaultState = {
		name: from?.name || "",
		address: from?.address || "",
		gps_location: from?.gps_location || "",
	}

	const [state, setState] = useState(defaultState)

	return (
		<Card title="Location Management / Create Form">
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4"
						>
							<div className="formCreate">
								<form action="">
									<div className="row justify-content-center">
										<div className="form-group col-lg-3">
											<h6>Name</h6>
											<input
												type="text"
												id="name_th"
												name="name"
												className="form-control"
												placeholder="Maersk"
												defaultValue={state.name}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Address</h6>
											<input
												type="text"
												id="name_th"
												name="name_th"
												className="form-control"
												placeholder="Address"
												defaultValue={state.address}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>GPS Location</h6>
											<input
												type="text"
												id="name_th"
												name="gps_location"
												className="form-control"
												placeholder="GPS location"
												defaultValue={state.gps_location}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="d-flex justify-content-center">
						<div className="card-footer">
							<button className="btn btn-primary" type="submit" name="signup">
								Update
							</button>
							<Link className="btn btn-danger" to={"/location"}>
								Cancel
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default UpdateLocation
