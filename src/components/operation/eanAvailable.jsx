import { useMemo } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import { Card } from "../../card"
import { TableView } from "../table"

export const EANAvailable = () => {
	const navigate = useNavigate()
	const { data } = useQuery("getEanAvailable")
	const columns = useMemo(
		() => [
			{
				Header: "Name",
				accessor: "name",
			},
			{
				Header: "Brand",
				accessor: "brand",
			},
			{
				Header: "Quantity Available",
				accessor: "qty_available",
			},
			{
				Header: "Average Weight(g)",
				accessor: "Average Weight(g)",
			},
			{
				Header: "Average Cost",
				accessor: "avg_cost",
			},
			{
				Header: "Actions",
				accessor: (a) => <div className="editIcon gap-2"></div>,
			},
		],
		[],
	)

	return (
		<Card title={"EAN Available"}>
			<TableView columns={columns} data={data} />
		</Card>
	)
}
