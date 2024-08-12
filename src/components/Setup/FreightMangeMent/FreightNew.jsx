import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"

const FreightNew = () => {
	const navigate = useNavigate()
	const [data, setData] = useState([])
	const [isOn, setIsOn] = useState(true)

	const getFreight = () => {
		axios
			.get(`${API_BASE_URL}/getFreight`)
			.then((response) => {
				setData(response.data.freightData)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => getFreight(), [])

	const columns = useMemo(
		() => [
			{
				Header: "ID",
				Id: "index",
				accessor: (_rows, i) => _rows.id,
			},
			{
				Header: "Vendor",
				accessor: (a) => a.Vendor,
			},
			{
				Header: "Port of Origin",
				accessor: (a) => a.FromPort,
			},
			{
				Header: "Destination",
				accessor: (a) => a.DestinationPort,
			},
			{
				Header: "Airline",
				accessor: (a) => a.Airline,
			},

			{
				Header: "Status",
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
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
					<Link to="/update_freight" state={{ from: a }}>
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
				Header: "Salary",
				accessor: (a) => "100000000",
			},
		],
		[],
	)

	return (
		<Card
			title="Freight Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/add_freight")}
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

export default FreightNew
