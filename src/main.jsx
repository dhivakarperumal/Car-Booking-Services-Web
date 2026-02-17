import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import { AuthProvider } from "./PrivateRouter/AuthContext.jsx";
import PrivateRoute from "./PrivateRouter/PrivateRouter.jsx";
import { Toaster } from "react-hot-toast";
import Home from "./Components/Home.jsx";
import BookAService from "./Components/BookAService.jsx";
import AboutPage from "./Components/AboutPage.jsx";
import VideoGallery from "./Components/VideoGallery.jsx";
import Contact from "./Components/Contact.jsx";
import ServiceDetails from "./Components/ServiceDetails.jsx";
import NotFound from "./Components/NotFound.jsx";
import Pricing from "./Components/Pricing.jsx";
import Product from "./Components/Product.jsx";


// Auth
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";


// // Admin
import AdminPanel from "./Admin/AdminPanel.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
// import Patients from "./Admin/Bookingservice/Patients.js";
// import PatientsDetails from "./Admin/Bookingservice/PatiientsDetails.jsx";

import Appointments from "./Admin/ServicesProvider/Services.jsx";

import Billings  from "./Admin/Billing/Billins.jsx";
import Inventory from "./Admin/Inventory/Inventory.jsx";

import Reports from "./Admin/Reports/Reports.jsx";
import Settings from "./Admin/Settingss/Settings.jsx"
import BookingService from "./Admin/Bookingservice/BookingService.jsx";

import AddAppointment from "./Admin/ServicesProvider/AddServices.jsx";


import AddBilling from "./Admin/Billing/AddBilling.jsx";
import AddInventoryItem from "./Admin/Inventory/AddInventoryItem.jsx";

import ProfileSettings from "./Admin/Settingss/ProfileSettings.jsx";
// import BillingSettings from "./Admin/Settingss/BillingSettings.jsx";
import UserManagement  from "./Admin/Settingss/UserManagement.jsx";

import Staffs from "./Admin/Employees/Staffs.jsx";
import AddEditStaff from "./Admin/Employees/AddStaff.jsx";
import ViewStaff from "./Admin/Employees/ViewStaff.jsx";
import Users from "./Admin/Users/Users.jsx";

import OverallAttendance from "./Admin/Attendance/OverallAttendance.jsx";
import ReviewsSettings from "./Admin/Settingss/Review.jsx"
import CarServices from "./Admin/CarServices/CarServices.jsx";
import AddServices from "./Admin/CarServices/AddCarServices.jsx";
import Servicestype from "./Admin/ServicesProvider/Services.jsx";
import AddServicesType from "./Admin/ServicesProvider/AddServices.jsx";
import ViewService from "./Admin/ServicesProvider/ViewCarservices.jsx";
import AddServiceParts from "./Admin/ServicesProvider/Addpairparts.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "gallery", element: <VideoGallery /> },
      { path: "about", element: <AboutPage /> },
      { path: "pricing", element: <Pricing /> },
      { path: "product", element: <Product /> },
      { path: "service/:id", element: <ServiceDetails /> },
      // { path: "services", element: <ServicePage /> },
      // { path: "doctors", element: <DoctorPage /> },
      // { path: "contact", element: <ContactPage /> },
      { path: "bookaservice", element: <BookAService /> },
      { path: "contact", element: <Contact /> },
     
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

     
    ],
  },

  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <AdminPanel />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "services", element: <Servicestype /> },
      { path: "services/:id", element: <ViewService/> },
      { path: "addservicestype", element: <AddServicesType /> },
      { path: "addserviceparts", element: <AddServiceParts /> },
      { path: "bookings", element: <BookingService /> },
      // { path: "addpatients/:id", element: <AddPatient /> },
      // { path: "patients/:id", element: <PatientsDetails /> },
      // { path: "doctorslots", element: <DoctorSlots /> },

     
      // { path: "appointments", element: <Appointments /> },
      // { path: "addappointments", element: <AddAppointment/> },
      // { path: "addappointments/:id", element: <AddAppointment /> },

      { path: "carservies", element: <CarServices /> },
      { path: "addcarservies", element: <AddServices /> },
      { path: "addcarservies/:id", element: <AddServices /> },
      


      // { path: "treatments", element: <Treatments /> },
      // { path: "addtreatments", element: <AddTreatment /> },
      // { path: "addtreatments/:id", element: <AddTreatment /> },
      // { path: "viewtreatment/:id", element: <ViewTreatment /> },

      { path: "billing", element: <Billings /> },
      { path: "addbillings", element: <AddBilling /> },
      { path: "addbillings/:id", element: <AddBilling /> },

      { path: "inventory", element: <Inventory /> },
      { path: "additemsinventory", element: <AddInventoryItem /> },
      { path: "additemsinventory/:id", element: <AddInventoryItem /> },

      // { path: "equipment", element: <Equipment /> },
      // { path: "addequipment", element: <AddEditEquipment /> },
      // { path: "addequipment/:id", element: <AddEditEquipment /> },
      // { path: "viewequipment/:id", element: <ViewEquipment /> },


      { path: "reports", element: <Reports /> },

      { path: "customers", element: <Users /> },
      // { path: "addupdateuser", element: <AddEditUser /> },
      // { path: "addupdateuser/:id", element: <AddEditUser /> },
// 
      { path: "settings", element: <Settings /> },
      { path: "settings/profile", element: <ProfileSettings /> },
      // { path: "settings/billing", element: <BillingSettings /> },
      { path: "settings/usermanagement", element: <UserManagement /> },
      { path: "settings/reviews", element: <ReviewsSettings /> },
      { path: "employees", element: <Staffs /> },
      { path: "addstaff", element: <AddEditStaff /> },
      { path: "addstaff/:id", element: <AddEditStaff /> },
      { path: "viewstaff/:id", element: <ViewStaff /> },
      { path: "overall-attendance", element: <OverallAttendance /> },
    ],
  },
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
       {/* 🔔 GLOBAL TOASTER */}
      <Toaster
        position="top-left"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#0B3C8A",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#7CB9FF",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

