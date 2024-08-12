import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"

const TransportNew = () => {
	const navigate = useNavigate()
	const [data, setData] = useState([])

	const getTransport = () => {
		axios
			.get(`${API_BASE_URL}/getTransport`)
			.then((response) => {
				if (response.data.success == true) {
					setData(response.data.transportData)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => getTransport(), [])

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				id: "index",
				accessor: (_row, i) => i + 1,
			},
			{
				Header: "Vendor",
				accessor: "name",
			},
			{
				Header: "Location",
				accessor: "location",
			},
			{
				Header: "Port",
				accessor: "port",
			},
			{
				Header: "Port Type",
				accessor: "port_type",
			},

			{
				Header: "Status",
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: "6px",
						}}
						className="toggleSwitch large"
						onclick=""
					>
						<input type="checkbox" checked />
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
					<Link to="/updateTransport" state={{ from: a }}>
						<i
							i
							className="mdi mdi-pencil"
							style={{
								width: "20px",
								color: "#203764",
								fontSize: "20px",
								marginTop: "10px",
							}}
						/>
					</Link>
				),
			},

			{
				Header: "Salary",
				accessor: (a) => "1000000",
			},
		],
		[],
	)

	return (
		<Card
			title="Transportation Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/addTransport")}
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

export default TransportNew
