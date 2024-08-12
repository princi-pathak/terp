import axios from "axios"
import { useState } from "react"
import { useQuery } from "react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"
import { Card } from "../../card"
import { ComboBox } from "../combobox"

const EditExpenseItems = () => {
	const location = useLocation()
	const { from } = location.state || {}
	const navigate = useNavigate()

	const { data: dropdownList } = useQuery("getDropdownType")
	const { data: ChartOfAccounts } = useQuery("getChartOfAccounts")

	const defaultState = {
		name_en: from?.name_en || "",
		name_th: from?.name_th || "",
		Type: from?.Type || "",
		chart_of_accounts: from?.chart_of_accounts || "",
	}

	const [editBoxData, setEditBoxData] = useState(defaultState)

	const handleChange = (event) => {
		const { name, value } = event.target
		setEditBoxData((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	// Edit Box Api
	const updateBoxData = async () => {
		const request = {
			ID: from?.ID,
			name_en: editBoxData?.name_en || "",
			name_th: editBoxData.name_th || "",
			Type: editBoxData.Type || "",
			chart_of_accounts: editBoxData.chart_of_accounts || "",
		}
		try {
			await axios.post(
				`${API_BASE_URL}/${
					request.ID ? "updateExpenseItems" : "createExpenseItems"
				}`,
				request,
			)
			toast.success("Successfully")
			navigate("/expenseItem")
		} catch (e) {
			toast.error("Network Error")
		}
	}

	// Edit Box Api
	return (
		<Card title={"Boxes Management / Edit Form"}>
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4 "
						>
							<div className="formCreate">
								<form action="">
									<div className="row">
										<div className="form-group col-lg-3">
											<label>English Name</label>
											<input
												type="text"
												id="name_en"
												name="name_en"
												onChange={handleChange}
												className="form-control"
												placeholder="name"
												defaultValue={editBoxData.name_en}
											/>
										</div>
										<div className="form-group col-lg-3">
											<label>Thai Name</label>
											<input
												type="text"
												id="name_th"
												name="name_th"
												onChange={handleChange}
												className="form-control"
												placeholder="name"
												defaultValue={editBoxData.name_th}
											/>
										</div>
										<div className="form-group col-lg-3">
											<label>Type</label>
											<ComboBox
												options={dropdownList?.map((v) => ({
													id: v.type_id,
													name: v.type_name_en,
												}))}
												value={editBoxData.Type}
												onChange={(e) => {
													setEditBoxData((prevState) => {
														return {
															...prevState,
															Type: e,
														}
													})
												}}
											/>
										</div>
										<div className="form-group col-lg-3">
											<label>Charts of Accounting</label>

											<ComboBox
												options={ChartOfAccounts?.map((v) => ({
													id: v.accounting_id,
													name: v.Name,
												}))}
												value={editBoxData.chart_of_accounts}
												onChange={(e) => {
													setEditBoxData((prevState) => {
														return {
															...prevState,
															chart_of_accounts: e,
														}
													})
												}}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="card-footer buttonCreate">
						<button
							onClick={updateBoxData}
							className="btn btn-primary"
							style={{ width: "125px" }}
							type="submit"
							name="signup"
						>
							{from?.ID ? "Update" : "Create"}
						</button>
						<Link className="btn btn-danger" to="/expenseItem">
							Cancel
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default EditExpenseItems
