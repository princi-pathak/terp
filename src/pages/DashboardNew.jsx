import CodeIcon from "@mui/icons-material/Code"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VpnKeyIcon from "@mui/icons-material/VpnKey"
import pic from "../assets/pic.jpg"
import "./dashboard.css"
const DashboardNew = () => {
	return (
		<div>
			<main className="main-content position-relative  border-radius-lg ">
				<div className="container-fluid">
					<nav
						className="navbar navbar-main navbar-expand-lg px-0  shadow-none border-radius-xl"
						id="navbarBlur"
						navbar-scroll="true"
					>
						<div className="container-fluid py-1 px-0">
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
									<li className="breadcrumb-item text-sm">
										<a className="text-dark">Pages</a>
									</li>
									<li
										className="breadcrumb-item text-sm text-dark active"
										aria-current="page"
									>
										Dashboard
									</li>
								</ol>
								<h6 className="font-weight-bolder mb-0">Dashboard</h6>
							</nav>
							<div
								className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
								id="navbar"
							>
								<div className="ms-md-auto pe-md-3 d-flex align-items-center">
									<div className="input-group input-group-outline">
										<label className="form-label">Type here...</label>
										<input type="text" className="form-control" />
									</div>
								</div>
								<ul className="navbar-nav  justify-content-end">
									<li className="nav-item dropdown pe-2 d-flex align-items-center">
										<a
											className="nav-link text-body p-0"
											id="dropdownSettingButton"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i className="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
										</a>
										<ul
											className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
											aria-labelledby="dropdownSettingButton"
										>
											<li className="mb-2">
												<a className="dropdown-item border-radius-md">
													<div className="d-flex py-1">
														<div className="my-auto">
															<img
																src="../assets/img/team-2.jpg"
																className="avatar avatar-sm  me-3 "
															/>
														</div>
														<div className="d-flex flex-column justify-content-center">
															<h6 className="text-sm font-weight-normal mb-1">
																{" "}
																<span className="font-weight-bold">
																	New message
																</span>
																from Laur{" "}
															</h6>
															<p className="text-xs text-secondary mb-0">
																{" "}
																<i className="fa fa-clock me-1"></i> 13 minutes
																ago{" "}
															</p>
														</div>
													</div>
												</a>
											</li>
											<li className="mb-2">
												<a className="dropdown-item border-radius-md">
													<div className="d-flex py-1">
														<div className="my-auto">
															<img
																src="../assets/img/small-logos/logo-spotify.svg"
																className="avatar avatar-sm bg-gradient-dark  me-3 "
															/>
														</div>
														<div className="d-flex flex-column justify-content-center">
															<h6 className="text-sm font-weight-normal mb-1">
																{" "}
																<span className="font-weight-bold">
																	New album
																</span>
																by Travis Scott{" "}
															</h6>
															<p className="text-xs text-secondary mb-0">
																{" "}
																<i className="fa fa-clock me-1"></i> 1 day{" "}
															</p>
														</div>
													</div>
												</a>
											</li>
										</ul>
									</li>
									<li className="nav-item dropdown pe-2 d-flex align-items-center">
										<a
											className="nav-link text-body p-0"
											id="dropdownMenuButton"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i className="fa fa-bell cursor-pointer"></i>
										</a>
										<ul
											className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
											aria-labelledby="dropdownMenuButton"
										>
											<li className="mb-2">
												<a className="dropdown-item border-radius-md">
													<div className="d-flex py-1">
														<div className="my-auto">
															<img
																src="../assets/img/team-2.jpg"
																className="avatar avatar-sm  me-3 "
															/>
														</div>
														<div className="d-flex flex-column justify-content-center">
															<h6 className="text-sm font-weight-normal mb-1">
																{" "}
																<span className="font-weight-bold">
																	New message
																</span>
																from Laur{" "}
															</h6>
															<p className="text-xs text-secondary mb-0">
																{" "}
																<i className="fa fa-clock me-1"></i> 13 minutes
																ago{" "}
															</p>
														</div>
													</div>
												</a>
											</li>
											<li className="mb-2">
												<a className="dropdown-item border-radius-md">
													<div className="d-flex py-1">
														<div className="my-auto">
															<img
																src="../assets/img/small-logos/logo-spotify.svg"
																className="avatar avatar-sm bg-gradient-dark  me-3 "
															/>
														</div>
														<div className="d-flex flex-column justify-content-center">
															<h6 className="text-sm font-weight-normal mb-1">
																{" "}
																<span className="font-weight-bold">
																	New album
																</span>
																by Travis Scott{" "}
															</h6>
															<p className="text-xs text-secondary mb-0">
																{" "}
																<i className="fa fa-clock me-1"></i> 1 day{" "}
															</p>
														</div>
													</div>
												</a>
											</li>
										</ul>
									</li>
								</ul>
							</div>
						</div>
					</nav>

					<div className="container-fluid py-4 px-0">
						<div className="row dashCard53">
							<div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
								<div className="card  ">
									<div className="card-header p-3 pt-2">
										<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
											<i className=" material-icons  mdi mdi-account-multiple"></i>
										</div>
										<div className="text-end pt-1">
											<p className="text-sm mb-0 text-capitalize">Vender</p>
											<h4 className="mb-0">53k</h4>
										</div>
									</div>
									<hr className="dark horizontal my-0" />
									<div className="card-footer p-3">
										<p className="mb-0">
											<span className="text-success text-sm font-weight-bolder">
												+55%{" "}
											</span>
											than lask week
										</p>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
								<div className="card">
									<div className="card-header p-3 pt-2">
										<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
											{/* <i className=" material-icons  mdi mdi-account-multiple"></i> */}
											<i className=" material-icons mdi mdi-purse"></i>
										</div>
										<div className="text-end pt-1">
											<p className="text-sm mb-0 text-capitalize">
												Purchase Order
											</p>
											<h4 className="mb-0">2,300</h4>
										</div>
									</div>
									<hr className="dark horizontal my-0" />
									<div className="card-footer p-3">
										<p className="mb-0">
											<span className="text-success text-sm font-weight-bolder">
												+3%{" "}
											</span>
											than lask month
										</p>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
								<div className="card">
									<div className="card-header p-3 pt-2">
										<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
											<i className=" material-icons  mdi mdi-account-multiple"></i>
										</div>
										<div className="text-end pt-1">
											<p className="text-sm mb-0 text-capitalize">
												{" "}
												Receiving{" "}
											</p>
											<h4 className="mb-0">3,462</h4>
										</div>
									</div>
									<hr className="dark horizontal my-0" />
									<div className="card-footer p-3">
										<p className="mb-0">
											<span className="text-success text-sm font-weight-bolder">
												-2%
											</span>{" "}
											than yesterday
										</p>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6">
								<div className="card">
									<div className="card-header p-3 pt-2">
										<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
											<i className=" material-icons  mdi mdi-account-multiple"></i>
										</div>
										<div className="text-end pt-1">
											<p className="text-sm mb-0 text-capitalize">Sorting</p>
											<h4 className="mb-0">103,430</h4>
										</div>
									</div>
									<hr className="dark horizontal my-0" />
									<div className="card-footer p-3">
										<p className="mb-0">
											<span className="text-success text-sm font-weight-bolder">
												+5%{" "}
											</span>
											than yesterday
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="statics_section">
							<div className="statics_title mb-4">
								<h6 className="font-weight-bolder mb-0">Statics</h6>
							</div>
							<div className="row dashCard53">
								<div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
									<div className="card">
										<div className="card-header p-3 pt-2">
											<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
												<i className=" material-icons  mdi mdi-account-multiple"></i>
											</div>
											<div className="text-end pt-1">
												<p className="text-sm mb-0 text-capitalize">ASL</p>
												<h4 className="mb-0">53k</h4>
											</div>
										</div>
										<hr className="dark horizontal my-0" />
										<div className="card-footer p-3">
											<p className="mb-0">
												<span className="text-success text-sm font-weight-bolder">
													+55%{" "}
												</span>
												than lask week
											</p>
										</div>
									</div>
								</div>
								<div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
									<div className="card">
										<div className="card-header p-3 pt-2">
											<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
												<i className=" material-icons  mdi mdi-account-multiple"></i>
											</div>
											<div className="text-end pt-1">
												<p className="text-sm mb-0 text-capitalize">
													Inventory
												</p>
												<h4 className="mb-0">2,300</h4>
											</div>
										</div>
										<hr className="dark horizontal my-0" />
										<div className="card-footer p-3">
											<p className="mb-0">
												<span className="text-success text-sm font-weight-bolder">
													+3%{" "}
												</span>
												than lask month
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row mt-4 ">
							<div className="col-lg-7 col-md-7 mt-4 mb-4">
								<div className="card z-index-2 ">
									<div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
										<div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
											<div className="chart">
												<canvas
													id="chart-bars"
													className="chart-canvas"
													height="170"
												></canvas>
											</div>
										</div>
									</div>
									<div className="card-body">
										<h6 className="mb-0" style={{ fontWeight: "600" }}>
											Monthly updated
										</h6>
										<p className="text-sm ">Lorem Ipsom Dolor campaign</p>
										<hr className="dark horizontal" />
										<div className="d-flex ">
											<i className="material-icons text-sm my-auto me-1">
												schedule
											</i>
											<p className="mb-0 text-sm"> campaign sent 2 days ago </p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-5 col-md-5 mt-4 mb-4">
								<div className="card z-index-2  ">
									<div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
										<div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
											<div className="chart">
												<canvas
													id="chart-line"
													className="chart-canvas"
													height="170"
												></canvas>
											</div>
										</div>
									</div>
									<div className="card-body">
										<h6 className="mb-0 " style={{ fontWeight: "600" }}>
											{" "}
											Daily updated{" "}
										</h6>
										<p className="text-sm ">
											{" "}
											(<span className="font-weight-bolder">+15%</span>) Lorem
											Ipsom Dolor campaign{" "}
										</p>
										<hr className="dark horizontal" />
										<div className="d-flex ">
											<i className="material-icons text-sm my-auto me-1">
												schedule
											</i>
											<p className="mb-0 text-sm"> updated 4 min ago </p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row mb-4">
							<div className="col-lg-8 col-md-6 mb-md-0 mb-4">
								<div className="card">
									<div className="card-header pb-0">
										<div className="row">
											<div className="col-lg-6 col-7">
												<h6>Job Request in Queue</h6>
												<p className="text-sm mb-0 iconColorDash">
													<i className="mdi mdi-check" aria-hidden="true"></i>
													<span className="font-weight-bold ms-1">30 done</span>{" "}
													this month
												</p>
											</div>
											<div className="col-lg-6 col-5 my-auto text-end">
												<div className="dropdown float-lg-end pe-4">
													<a
														className="cursor-pointer"
														id="dropdownTable"
														data-bs-toggle="dropdown"
														aria-expanded="false"
													>
														<i className="fa fa-ellipsis-v text-secondary"></i>
													</a>
													<ul
														className="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5"
														aria-labelledby="dropdownTable"
													>
														<li>
															<a className="dropdown-item border-radius-md">
																Action
															</a>
														</li>
														<li>
															<a className="dropdown-item border-radius-md">
																Another action
															</a>
														</li>
														<li>
															<a className="dropdown-item border-radius-md">
																Something else here
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
									<div className="card-body px-0 pb-2">
										<div className="table-responsive">
											<table className="table align-items-center mb-0">
												<thead>
													<tr>
														<th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
															Name{" "}
														</th>
														<th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
															Partner
														</th>
														<th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
															Total Users
														</th>
														<th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
															Completion
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="xd"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Ryan Tompson"
																>
																	<img src={pic} alt="team1" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																14,000{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			60%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-info w-60"
																		role="progressbar"
																		aria-valuenow="60"
																		aria-valuemin="0"
																		aria-valuemax="100"
																	></div>
																</div>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="atlassian"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Romina Hadid"
																>
																	<img src={pic} alt="team5" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																3,000{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			10%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-info w-10"
																		role="progressbar"
																		aria-valuenow="10"
																		aria-valuemin="0"
																		aria-valuemax="100"
																	></div>
																</div>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="team7"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Romina Hadid"
																>
																	<img src={pic} alt="team8" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																Not set{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			100%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-success w-100"
																		role="progressbar"
																		aria-valuenow="100"
																		aria-valuemin="0"
																		aria-valuemax="100"
																	></div>
																</div>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="spotify"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Ryan Tompson"
																>
																	<img src={pic} alt="user1" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																20,500{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			100%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-success w-100"
																		role="progressbar"
																		aria-valuenow="100"
																		aria-valuemin="0"
																		aria-valuemax="100"
																	></div>
																</div>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="jira"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Ryan Tompson"
																>
																	<img src={pic} alt="user5" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																500{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			25%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-info w-25"
																		role="progressbar"
																		aria-valuenow="25"
																		aria-valuemin="0"
																		aria-valuemax="25"
																	></div>
																</div>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex px-2 py-1">
																<div>
																	<img
																		src={pic}
																		className="avatar avatar-sm me-3"
																		alt="invision"
																	/>
																</div>
																<div className="d-flex flex-column justify-content-center">
																	<h6 className="mb-0 text-sm">
																		Lorem Ipsom Dolor campaign
																	</h6>
																</div>
															</div>
														</td>
														<td>
															<div className="avatar-group mt-2">
																<a
																	className="avatar avatar-xs rounded-circle"
																	data-bs-toggle="tooltip"
																	data-bs-placement="bottom"
																	title="Ryan Tompson"
																>
																	<img src={pic} alt="user6" />
																</a>
															</div>
														</td>
														<td className="align-middle text-center text-sm">
															<span className="text-xs font-weight-bold">
																{" "}
																2,000{" "}
															</span>
														</td>
														<td className="align-middle">
															<div className="progress-wrapper w-75 mx-auto">
																<div className="progress-info">
																	<div className="progress-percentage">
																		<span className="text-xs font-weight-bold">
																			40%
																		</span>
																	</div>
																</div>
																<div className="progress">
																	<div
																		className="progress-bar bg-gradient-info w-40"
																		role="progressbar"
																		aria-valuenow="40"
																		aria-valuemin="0"
																		aria-valuemax="40"
																	></div>
																</div>
															</div>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6">
								<div className="card h-100">
									<div className="card-header pb-0">
										<h6>Orders overview</h6>
										<p className="text-sm">
											<i
												className="fa fa-arrow-up text-success"
												aria-hidden="true"
											></i>
											<span className="font-weight-bold">24%</span> this month
										</p>
									</div>
									<div className="card-body p-3">
										<div className="timeline timeline-one-side">
											<div className="timeline-block mb-3">
												<span className="timeline-step">
													<i className="mdi mdi-bell"></i>
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														22 DEC 7:20 PM
													</p>
												</div>
											</div>
											<div className="timeline-block mb-3">
												<span className="timeline-step">
													<CodeIcon />
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														21 DEC 11 PM
													</p>
												</div>
											</div>
											<div className="timeline-block mb-3">
												<span className="timeline-step">
													<ShoppingCartIcon />
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														21 DEC 9:34 PM
													</p>
												</div>
											</div>
											<div className="timeline-block mb-3">
												<span className="timeline-step">
													<CreditCardIcon />
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														20 DEC 2:20 AM
													</p>
												</div>
											</div>
											<div className="timeline-block mb-3">
												<span className="timeline-step">
													<VpnKeyIcon />
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														18 DEC 4:54 AM
													</p>
												</div>
											</div>
											<div className="timeline-block">
												<span className="timeline-step">
													<LibraryAddCheckIcon />
												</span>
												<div className="timeline-content">
													<h6 className="text-dark text-sm font-weight-bold mb-0">
														Lorem Ipsum is simply dummy.
													</h6>
													<p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
														17 DEC
													</p>
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
		</div>
	)
}

export default DashboardNew
