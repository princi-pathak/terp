import { CgMoreO } from "react-icons/cg";
import { GiBoxUnpacking } from "react-icons/gi";
import { MdGroupAdd, MdInventory2 } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";

export const links = [
  {
    name: "Expenses",
    icon: <GiBoxUnpacking />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Topwear",
        sublink: [
          // { name: "Packing", link: "/packingNew" },
          // { name: "HPL", link: "/hplNew" },
          { name: "Purchase Order", link: "/purchase_orders" },
          { name: "Vendor", link: "/vendor" },
          { name: "Update Price", link: "/update_price" },
        ],
      },
    ],
  },

  {
    name: "Operations",
    icon: <GiBoxUnpacking />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Topwear",
        sublink: [
          { name: "Dashboard", link: "/dashboardOperation" },
          { name: "Receiving", link: "/receiving" },
          { name: "Sorting", link: "/sorting" },
          { name: "EAN Packing", link: "/eanPacking" },
          { name: "Adjust EAN", link: "/adjustEan" },
          { name: "Order Packing", link: "/orderPackaging" },
        ],
      },
    ],
  },

  {
    name: "Revenue",
    icon: <MdInventory2 />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Topwear",
        sublink: [
          { name: "Quotation", link: "/quotation" },
          { name: "Orders", link: "/orders" },
          // { name: "Operation", link: "/operations" },
          { name: "Invoice", link: "/invoice" },
          { name: "Claim", link: "/claim" },
        ],
      },
      // {
      //     Head: "Topwear",
      //     sublink: [
      //       { name: "Invoice", link: "/invoice" },
      //       { name: "Claim", link:"/claim"}
      //     ],
      //   },
    ],
  },

  {
    name: "Client Management",
    icon: <MdGroupAdd />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Topwear",
        sublink: [
          { name: "Clients", link: "/clientNew" },
          { name: "Consignee", link: "/shipToNew" },
        ],
      },
    ],
  },

  // {
  //   name: "Statistics",
  //   icon: <FcStatistics/>,
  //   submenu: false,
  //   sublinks: [
  //     {
  //     //   Head: "Topwear",
  //       sublink: [
  //         { name: "Quotation", link: "/quotation" },
  //         { name: "Orders", link: "/orders" },
  //         { name: "Operation", link: "/operations" },
  //       ],
  //     },
  //     {
  //       //   Head: "Topwear",
  //         sublink: [
  //           { name: "Invoice", link: "/invoice" },
  //           { name: "Claim", link:"/claim"}
  //         ],
  //       },
  //   ]
  //   },

  //   {
  //     name: "Accounting",
  //     icon: <MdInventory2/>,
  //     submenu: false,
  //     sublinks: [
  //       {
  //       //   Head: "Topwear",
  //         sublink: [
  //           { name: "Quotation", link: "/quotation" },
  //           { name: "Orders", link: "/orders" },
  //           { name: "Operation", link: "/operations" },
  //         ],
  //       },
  //       {
  //         //   Head: "Topwear",
  //           sublink: [
  //             { name: "Invoice", link: "/invoice" },
  //             { name: "Claim", link:"/claim"}
  //           ],
  //         },
  //     ]
  //     },

  {
    name: "Statistics",
    icon: <CgMoreO />,
    submenu: true,
    sublinks: [
      // {
      // //   Head: "Topwear",
      //   sublink: [
      //     { name: "Inventory", link: "/inventory" },
      //     { name: "Purchase Order", link: "/purchase_orders" },
      //     { name: "Receiving", link: "/receiving" },
      //   ],
      // },
      // {
      //   //   Head: "Topwear",
      //     sublink: [
      //       { name: "Sorting", link: "/sorting" },
      //       { name: "Asl", link: "/Asl" },

      //     ],
      //   },

      {
        //   Head: "Topwear",
        sublink: [{ name: "HPL", link: "/sorting" }],
      },
    ],
  },

  {
    name: "Inventory",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Setup",

        sublink: [
          { name: "Available EAN", link: "/eanAvailable" },
          { name: "Available Produce", link: "/inventoryProduce" },
          { name: "Available Boxes", link: "/inventoryBoxes" },
          { name: "Available Packaging", link: "/inventoryPackaging" },
        ],
      },
    ],
  },

  {
    name: "Acconting",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Setup",
        sublink: [
          { name: "Accounting", link: "/accounting" },
          { name: "Currency Exchange Update", link: "/currencyex" },
        ],
      },
    ],
  },

  {
    name: "Setup",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        //   Head: "Setup",
        sublink: [
          { name: "Produce", link: "/produceNew" },
          // { name: "Unit Count", link: "/unitCount" },
          { name: "Boxes", link: "/boxes" },
          { name: "Packaging", link: "/packagingNew" },
          { name: "EAN", link: "/eanNew" },
          { name: "Extra", link: "/extra" },
          { name: "Liner Management", link: "/airlineNew" },
          // { name:"Currency Management", link:"/currencyNew"},
          // { name:"Pallets", link:"/pallet"},
          { name: "Location", link: "/location" },
          { name: "Bank", link: "/bankNew" },
          { name: "Wages", link: "/hourly" },
          { name: "ITF", link: "/itfNew" },
          { name: "Port Management", link: "/airportNew" },
          { name: "Clearance Management", link: "/clearanceNew" },
          { name: "Transport Management", link: "/transportNew" },
          { name: "Freight Management", link: "/freightNew" },
          { name: "Users", link: "/user" },
          { name: "Journey", link: "/journey" },
          { name: "Notification", link: "/notification" },
          { name: "Other items", link: "/expenseItem" },
        ],
      },
      // {
      //   //   Head: "Setup",
      //     sublink: [
      //       { name: "ITF", link: "/itfNew"},
      //       { name:"Port Management", link:"/airportNew"},
      //       { name:"Clearance Management", link:"/clearanceNew"},
      //       { name:"Transport Management", link:"/transportNew"},
      //       { name:"Freight Management",  link:"/freightNew"},

      //     ],
      //   },

      // {
      //   sublink:[
      //     { name:"Liner Management", link:"/airlineNew"},
      //     // { name:"Currency Management", link:"/currencyNew"},
      //     // { name:"Pallets", link:"/pallet"},
      //     { name: "Location", link:"/location"},
      //     { name: "Bank", link: "/bankNew"},
      //     { name:"Wages", link:"/hourly"},

      //   ]
      // }
    ],
  },
];
