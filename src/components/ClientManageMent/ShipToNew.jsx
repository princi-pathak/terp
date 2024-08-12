import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"
import { Card } from "../../card"
import { TableView } from "../table"

const ShipToNew = () => {
	const [isOn, setIsOn] = useState(true)
	const [data, setData] = useState([])
	const navigate = useNavigate()

	const columns = React.useMemo(
		() => [
			{
				Header: "Id",
				id: "index",
				accessor: (_row, i) => i + 1,
			},

			{
				Header: "Name / Company",
				accessor: "consignee_name",
			},
			{
				Header: "Status",
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							padding: "10px",
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
						<a> </a>
					</label>
				),
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/edit_ship_to" state={{ from: a }}>
						<i
							className="mdi mdi-pencil"
							style={{
								width: "20px",
								color: "#203764",
								fontSize: "22px",
								marginTop: "10px",
							}}
						/>
						<button className="SvgAnchor"> <svg className="SvgQuo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chart-bubble</title><path d="M7.2,11.2C8.97,11.2 10.4,12.63 10.4,14.4C10.4,16.17 8.97,17.6 7.2,17.6C5.43,17.6 4,16.17 4,14.4C4,12.63 5.43,11.2 7.2,11.2M14.8,16A2,2 0 0,1 16.8,18A2,2 0 0,1 14.8,20A2,2 0 0,1 12.8,18A2,2 0 0,1 14.8,16M15.2,4A4.8,4.8 0 0,1 20,8.8C20,11.45 17.85,13.6 15.2,13.6A4.8,4.8 0 0,1 10.4,8.8C10.4,6.15 12.55,4 15.2,4Z" /></svg></button>

						<button className="SvgAnchor">  <svg className="SvgQuo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chart-timeline-variant</title><path d="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></path></svg>		</button>

						<button className="SvgAnchor"> <svg className="SvgQuo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>cash-check</title><path d="M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"></path></svg> </button>
						<button className="SvgAnchor">
							<svg className="SvgQuo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>currency-eth</title><path d="M6,5H18V7H6M7,11H17V13H7M5.5,17H18.5V19H5.5"></path></svg>
						</button>
					</Link>
				),
			},

			{
				Header: "Salary",
				accessor: (a) => <>{"100000000"}</>,
			},
		],
		[],
	)

	const getAirportData = () => {
		axios
			.get(`${API_BASE_URL}/getConsignee`)
			.then((response) => {
				setData(response.data.data || [])
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
	}

	useEffect(() => {
		getAirportData()
	}, [])

	return (
		<Card
			title="Consignee Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/add_ship_to")}
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

export default ShipToNew
