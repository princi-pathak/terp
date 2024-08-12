import axios from "axios"
import React, { useEffect, useState } from "react"
import Barcode from "react-barcode"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"

const ItfNew = () => {
	const navigate = useNavigate()
	const [data, setData] = useState([])
	const [isOn, setIsOn] = useState(true)
	const getItfData = () => {
		axios
			.get(`${API_BASE_URL}/getItf`)
			.then((response) => {
				if (response.data.success == true) {
					setData(response.data.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getItfData()
	}, [])

	const columns = React.useMemo(
		() => [
			{
				Header: "Name",
				accessor: (a) => a.itf_name_en,
			},
			{
				Header: "ITF Code",
				accessor: (a) => (
					<div style={{}}>
						<Barcode width={0.8} height={30} value={"1000000"} />
					</div>
				),
			},

			{
				Header: "ITF NET Weight",
				accessor: (a) => `${(a.itf_net_weight / 1000).toFixed(1)} KG`,
			},
			{
				Header: "ITF Gross Weight",
				accessor: (a) => `${(a.itf_gross_weight / 1000).toFixed(1)} KG`,
			},
			{
				Header: "ITF VVSW",
				accessor: (a) => a.vvsw,
			},
			{
				Header: "Box Pallete",
				accessor: (a) => a.box_pallet,
			},
			{
				Header: "Status",
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "10px",
						}}
						className="toggleSwitch large"
						onclick=""
					>
						<input
							onChange={() => setIsOn(!isOn)}
							type="checkbox"
							defaultChecked
						/>
						<span>
							<span>OFF</span>
							<span>ON</span>
						</span>
						<a></a>
					</label>
				),
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/edit_itf" state={{ from: a }}>
						<i
							i
							className="mdi mdi-pencil"
							style={{
								width: "20px",
								color: "#203764",
								fontSize: "22px",
								marginTop: "10px",
							}}
						/>
					</Link>
				),
			},

			{
				Header: "Salaries",
				accessor: (a) => <div style={{ marginTop: "10px" }}>{"10000000"}</div>,
			},
		],
		[],
	)

	return (
		<Card
			title="ITF Setup Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/add_itf")}
					className="btn button btn-info"
				>
					Create
				</button>
			}
		>
			<TableView columns={columns} data={data} />
		</Card>
	)
}

export default ItfNew
