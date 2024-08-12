import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/white-logo.png";
import Button from "../Button";
import ChooseLang from "./ChooseLang";
import NavLinks from "./Navlinks.jsx";
import ProfileMenu from "./ProfileMenu";
import moment from "moment";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { API_BASE_URL } from "../../Url/Url.js";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState("");

  const toggleDropdown = () => {
    axios
      .post(`${API_BASE_URL}/updateNotificationSeen`, {
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        allNotification();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
    setIsActive(!isActive);
  };
  const allNotification = () => {
    axios
      .post(`${API_BASE_URL}/getUserNotification`, {
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        setCount(response.data.unseenCount);
        const formattedData = response.data.data.map((notification) => {
          const formattedMessage = notification.messages.replace(
            /\n\t\t\t\t/g,
            "\n"
          );
          notification.message = formattedMessage.replace(/\n/g, "<br>");
          return notification;
        });
        setData(formattedData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  console.log(count);
  useEffect(() => {
    allNotification();
  }, []);
  return (
    <nav
      className="bg-cyan-950 sticky top-0 w-full navGap"
      style={{ backgroundColor: "#203764", zIndex: "999" }}
    >
      <div className="flex items-center font-medium justify-between">
        <div className="z-50 flex justify-between navLogo w-full md:w-auto">
          <NavLink to="/dashboard" className="flex">
            <img src={Logo} alt="logo" className="md:cursor-pointer h-9" />
            <span className="text-white ml-2  justify-between items-center flex terplogo">
              Terp
            </span>
          </NavLink>
          <button
            type="button"
            className="text-3xl md:hidden ml-auto flex items-center"
            onClick={() => setOpen(!open)}
          >
            <ion-icon name={`${open ? "close" : "menu"}`} />
          </button>
        </div>
        <ul className="md:flex text-white hidden capatalize items-center font-light font-[Poppins] inventoryNav ">
          <NavLinks />
          <div className="positionNav">
            <div className={`dropdown ${isActive ? "active" : ""}`}>
              <button
                className="navNotification navMenuInvt"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={toggleDropdown}
              >
                <NotificationsIcon /> {count ? <span>{count}</span> : ""}
              </button>
              <ul className={`dropdown-menu ${isActive ? "show" : ""}`}>
                <li>
                  <a className="dropdown-item">
                    <h3>Notification</h3>
                    <div className="noti">
                      {data && data.length > 0 ? (
                        <>
                          {data.map((item) => (
                            <div key={item.id}>
                              <h5>{item.title}</h5>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: `${item.message
                                    } <span style="float: right;"><small>  ${moment(
                                      item.created_at
                                    ).fromNow()}</small></span>`,
                                }}
                              />
                            </div>
                          ))}
                          <div className="notifcationButton">
                            <button>View All</button>
                          </div>
                        </>
                      ) : (
                        <h5>No notifications</h5>
                      )}
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            {/* <div class="dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Dropdown button
							</button>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="#">Action</a></li>
								<li><a class="dropdown-item" href="#">Another action</a></li>
								<li><a class="dropdown-item" href="#">Something else here</a></li>
							</ul>
						</div> */}
          </div>
        </ul>

        <div className="md:block hidden navImg">
          <ProfileMenu />
          <span style={{ paddingLeft: "20px" }}>
            <ChooseLang />
          </span>
        </div>

        <ul
          className={`md:hidden fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4 duration-500 text-white ${open ? "left-0" : "left-[-100%]"
            }`}
          style={{ backgroundColor: "rgb(8 47 73)" }}
        >
          <NavLinks setOpen={setOpen} />
          <div className="py-5">
            <Button />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
