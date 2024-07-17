const data = [
  {
    id: "admin",
    icon: "iconsminds-administrator",
    label: "Admin",
    to: "",
    subs: [
      {
        icon: "iconsminds-dashboard",
        label: "DashBoard",
        to: "/app/admin/dashboard",
      },
      {
        icon: "iconsminds-male-2",
        label: "Companies",
        to: "/app/admin/company/",
      },

      {
        icon: "iconsminds-male-2",
        label: "Users",
        to: "/app/admin/users",
      },
      {
        icon: "iconsminds-data-center",
        label: "Appliances",
        to: "/app/admin/appliances",
      },
      {
        icon: "iconsminds-billing",
        label: "Billing",
        to: "/app/admin/billing",
      },
    ],
  },

  {
    id: "ss",
    icon: "iconsminds-dashboard",
    label: "Dashboards",
    to: "/app/smartsight/Dashboard",
    subs: [
      {
        icon: "iconsminds-dashboard",
        label: "Building",
        to: "/app/smartsight/Dashboard",
      },
    ],
  },

  {
    id: "People",
    icon: "iconsminds-conference",
    label: "People",
    to: "",
    subs: [
      {
        icon: "iconsminds-dashboard",
        label: "DashBoard",
        to: "/app/people/dashboard",
      },
      {
        icon: "simple-icon-plus",
        label: "People Count",
        to: "/app/people/peoplecounts",
      },
      {
        icon: "iconsminds-mens",
        label: "People Occupancy",
        to: "/app/people/occupancy",
      },
      {
        icon: "iconsminds-business-man-woman",
        label: "Age/Gender/Emotion",
        to: "/app/people/agegenemo",
      },
    ],
  },

  {
    id: "Automotive",
    icon: "iconsminds-car",
    label: "Vehicles",
    to: "",
    subs: [
      {
        icon: "iconsminds-dashboard",
        label: "DashBoard",
        to: "/app/vehicle/dashboard",
      },
      {
        icon: "simple-icon-event",
        label: "Number Plate",
        to: "/app/admin/users",
      },
      {
        icon: "iconsminds-car",
        label: "Parking",
        to: "/app/admin/appliances",
      },
    ],
  },

  {
    id: "ss",
    icon: "iconsminds-dashboard",
    label: "Dashboards",
    to: "/app/smartsight/Dashboard",
    subs: [
      {
        icon: "iconsminds-dashboard",
        label: "Event",
        to: "/app/smartsight/Dashboard",
      },
      {
        icon: "iconsminds-mens",
        label: "Age Gender",
        to: "/app/smartsight/agegender",
      },
      {
        icon: "iconsminds-mens",
        label: "Building Occupancy",
        to: "/app/smartsight/buildingoccupancy",
      },
    ],
  },

  {
    id: "secondmenu",
    icon: "iconsminds-monitor-analytics",
    label: "Analytics",
    to: "/app/second-menu",
    subs: [
      {
        icon: "iconsminds-statistic",
        label: "Retail",
        to: "/app/analysis/retaildaily",
      },
    ],
  },

  {
    id: "facerecog",
    icon: "iconsminds-user",
    label: "Face Recognition",
    to: "",
    subs: [
      {
        icon: "simple-icon-user-following",
        label: "Daily Summary",
        to: "/app/employee/summary",
      },
      {
        icon: "iconsminds-big-data",
        label: "Logs",
        to: "/app/employee/log",
      },
      {
        icon: "iconsminds-profile",
        label: "Employees",
        to: "/app/employee",
      },
    ],
  },

  {
    id: "docs",
    icon: "iconsminds-pie-chart-3",
    label: "Reports",
    to: "",
    subs: [
      {
        icon: "iconsminds-mens",
        label: "People Count",
        to: "/app/analysis/retail",
      },
      {
        icon: "iconsminds-mens",
        label: "People Occupancy",
        to: "/app/analysis/retail",
      },
      {
        icon: "iconsminds-car",
        label: "ANPR",
        to: "/app/analysis/retail",
      },
      {
        icon: "iconsminds-danger",
        label: "Alerts",
        to: "/app/analysis/retail",
      },
    ],
  },
  {
    id: "blankpage",
    icon: "iconsminds-security-settings",
    label: "Settings",
    to: "/app/blank-page",
    subs: [
      {
        icon: "iconsminds-building",
        label: "Facility",
        to: "/app/facility",
      },
      {
        icon: "iconsminds-server-2",
        label: "Appliance",
        to: "/app/appliance",
      },
      {
        icon: "iconsminds-security-camera",
        label: "Camera",
        to: "/app/camera",
      },
    ],
  },

  {
    id: "compliance",
    icon: "iconsminds-check",
    label: "Compliance",
    to: "",
    subs: [
      {
        icon: "iconsminds-hotel",
        label: "Facility Tracker",
        to: "/app/compliance/tracker",
      },
      {
        icon: "iconsminds-pie-chart-3",
        label: "Daily Summary",
        to: "/app/compliance/log",
      },
      {
        icon: "iconsminds-line-chart-1",
        label: "Trends",
        to: "/app/compliance/trends",
      },
      {
        icon: "iconsminds-danger",
        label: "Alerts",
        to: "/app/compliance/alerts",
      },
    ],
  },
];
export default data;
