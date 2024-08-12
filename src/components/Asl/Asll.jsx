const Asll = () => {
	return (
		<main className="main-content">
			<div className="container-fluid">
				<nav
					className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
					id="navbarBlur"
					navbar-scroll="true"
				>
					<div className="container-fluid py-1 px-0">
						<nav aria-label="breadcrumb">
							<ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
								<li className="breadcrumb-item text-sm">
									<a className="text-dark">Setup</a>
								</li>
								<li
									className="breadcrumb-item text-sm text-dark active"
									aria-current="page"
								>
									Operation
								</li>
							</ol>
						</nav>
					</div>
				</nav>
				<div className="container-fluid pt-1 py-4 px-0">
					<div className="row">
						<div className="col-lg-12 col-md-12 mb-4">
							<div className="bg-white">
								<div className="databaseTableSection pt-0">
									<div className="grayBgColor p-4 pt-2 pb-2">
										<div className="row">
											<div className="col-md-6">
												<h6 className="font-weight-bolder mb-0 pt-2">
													ASL Management
												</h6>
											</div>
										</div>
									</div>
									<div className="top-space-search-reslute">
										<div className="tab-content px-2 md:!px-4">
											<div className="parentProduceSearch">
												<div className="entries">
													<small> show</small>{" "}
													<select>
														<option value="10">10</option>
														<option value="25">25</option>
														<option value="50">50</option>
														<option value="100">100</option>
													</select>{" "}
													<small>entries</small>
												</div>
												<div>
													<input type="search" placeholder="search" />
												</div>
											</div>
											<div
												className="tab-pane active"
												id="header"
												role="tabpanel"
											>
												<div
													id="datatable_wrapper"
													className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
												>
													<div className="d-flex exportPopupBtn"></div>
													<table
														id="example"
														className="display table table-hover table-striped borderTerpProduce"
														style={{ width: "100%" }}
													>
														<thead>
															<tr>
																<th>Code</th>
																<th>Name</th>
																<th>Quantity</th>
																<th>Unit</th>
																<th>Price/Unit </th>
																<th>Blue Crate </th>
																<th>AVG Weights</th>
																<th> Date</th>
																<th>Action</th>
															</tr>
														</thead>
														<tbody>
															<tr className="rowCursorPointer">
																<td scope="row">Q-202309003</td>
																<td>ลำไย / Longan </td>
																<td>140.00 </td>
																<td>กก / KG </td>
																<td>17.42 THB</td>
																<td>0</td>
																<td>1.0000 </td>
																<td> 02-Oct-2023 10:32:22</td>
																<td className="editIcon">
																	<i className="mdi mdi-delete"></i>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Asll
