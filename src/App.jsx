import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Providers from "./providers/index.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import OwnerRoute from "./routes/OwnerRoute.jsx";
import ManagerRoute from "./routes/ManagerRoute.jsx";
import Root from "./Root.jsx";
import SignIn from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddRoom from "./pages/room/AddRoom.jsx";
import EditRoom from "./pages/room/EditRoom.jsx";
import ManageRoom from "./pages/room/ManageRoom.jsx";
import ManageSingleRoom from "./pages/room/ManageSingleRoom.jsx";
import CheckIn from "./pages/room/CheckIn.jsx";
import AddFood from "./pages/restaurant/AddFood.jsx";
import EditFood from "./pages/restaurant/EditFood.jsx";
import AddOrder from "./pages/restaurant/AddOrder.jsx";
import FoodInventory from "./pages/restaurant/FoodInventory.jsx";
import AddInventory from "./pages/Inventory/AddInventory.jsx";
import EditInventory from "./pages/Inventory/EditInventory.jsx";
import ManageInventory from "./pages/Inventory/ManageInventory.jsx";
import AddEmployee from "./pages/employee/AddEmployee.jsx";
import EditEmployee from "./pages/employee/EditEmployee.jsx";
import ManageEmployee from "./pages/employee/ManageEmployee.jsx";
import MonitorFinance from "./pages/MonitorFinance/MonitorFinance.jsx";
import SalesProfitReport from "./pages/report/SalesProfitReport.jsx";
import ManageBooking from "./pages/room/ManageBooking.jsx";
import ManagerEdit from "./components/ManagerEdit/ManagerEdit.jsx";
import HotelEdit from "./components/HotelEdit/HotelEdit.jsx";
import CheckOut from "./pages/room/CheckOut/CheckOut.jsx";
import UserDashBoard from "./components/UserDashBoard/UserDashBoard.jsx";
import BookingView from "./pages/room/BookingView.jsx";
import CheckPDF from "./pages/CheckPDF.jsx";
import AddManager from "./pages/OwnerManagerManagement/AddManager.jsx";
import ManagerList from "./pages/OwnerManagerManagement/ManagerList.jsx";
import AddHotel from "./pages/Ownerhotel/AddHotel.jsx";
import HotelLists from "./pages/Ownerhotel/HotelLists.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import RenewList from "./pages/Admin/RenewList.jsx";
import RenewView from "./pages/Admin/RenewView.jsx";
import AdminOwnerList from "./pages/Admin/AdminOwnerList.jsx";
import AdminOwnerView from "./components/Admin/AdminOwnerView.jsx";
import DashboardRoot from "./pages/DashboardRoot.jsx";
import Profile from "./pages/profile/index.jsx";
import EditProfile from "./pages/profile/EditProfile.jsx";
import AdminNewLicense from "./pages/Admin/AdminNewLicense.jsx";
import SuspendAndLockList from "./pages/Admin/SuspendAndLockList.jsx";
import EditRenew from "./pages/Admin/EditRenew.jsx";
import ManagerListView from "./pages/OwnerManagerManagement/ManagerListView.jsx";
import AddSubAdmin from "./pages/Admin/AddSubAdmin.jsx";
import SubAdminList from "./pages/Admin/SubAdminList.jsx";
import SubAdminListView from "./pages/Admin/SubAdminListView.jsx";
import SubAdminProfile from "./pages/Admin/SubAdminProfile.jsx";
import SubAdminChangePass from "./pages/Admin/SubAdminChangePass.jsx";
import ReportView from "./pages/report/ReportView.jsx";
import Report from "./pages/Admin/Report.jsx";
import Error from "./Error.jsx";
import OwnerProfile from "./pages/Admin/OwnerProfile.jsx";
import SuspendList from "./pages/Admin/SuspendList.jsx";
import ExpiredList from "./pages/Admin/ExpiredList.jsx";
import AddBar from "./pages/bar/AddBar.jsx";
import BarItemList from "./pages/bar/BarItemList.jsx";
import BarItemView from "./pages/bar/BarItemView.jsx";
import EditBar from "./pages/bar/EditBar.jsx";
import HotelListView from "./pages/Ownerhotel/HotelListView.jsx";
import AddSwimmingPool from "./pages/LifeStyle/AddSwimmingPool.jsx";
import SwimmingPoolList from "./pages/LifeStyle/SwimmingPoolList.jsx";
import SwimmingPoolLIstView from "./pages/LifeStyle/SwimmingPoolLIstView.jsx";
import OrderBar from "./pages/bar/OrderBar.jsx";
import SwimmingBooking from "./pages/LifeStyle/SwimmingBooking.jsx";
import EditSwimming from "./components/LifeStyle/EditSwimming.jsx";
import GymBooking from "./pages/Gym/GymBooking.jsx";
import AddGym from "./pages/Gym/AddGym.jsx";
import GymList from "./pages/Gym/GymList.jsx";
import LicenseHistory from "./pages/owner/LicenseHistory.jsx";
import EditProfileAdmin from "./pages/profile/EditProfileAdmin.jsx";
import OrderBarItem from "./pages/bar/OrderBarItem.jsx";
import PoolReservation from "./pages/LifeStyle/PoolReservation.jsx";
import OrderList from "./pages/restaurant/OrderList.jsx";
import ReportManager from "./pages/report/ReportManager.jsx";
import OrderListBar from "./pages/bar/OrderListBar.jsx";
import CheckInDyn from "./pages/room/CheckInDyn.jsx";
import EmployeeView from "./pages/employee/EmployeeView.jsx";
import CurOrderList from "./pages/restaurant/CurOrderList.jsx";
import AddTable from "./pages/restaurant/AddTable.jsx";
import FoodCheckout from "./pages/restaurant/FoodCheckout.jsx";
import ChangeManagerPassword from "./components/HotelEdit/ChangeManagerPassword.jsx";
import AddExpence from "./pages/Inventory/AddExpense.jsx";
import AddExpense from "./pages/Inventory/AddExpense.jsx";
import ShowAllExpense from "./components/inventory/ShowAllExpense.jsx";
import ShowAllExpenseView from "./components/inventory/ShowAllExpenseView.jsx";
import ShowAllSell from "./pages/restaurant/ShowAllSell.jsx";
import ShowALlSellView from "./pages/restaurant/ShowALlSellView.jsx";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard.jsx";
import AddHotelExpense from "./pages/Inventory/AddHotelExpense.jsx";
import HotelExpenses from "./pages/Inventory/HotelExpenses.jsx";
import HotelExpenseDetails from "./pages/Inventory/HotelExpenseDetails.jsx";
import HotelDashboard from "./pages/Inventory/HotelDashboard.jsx";
import RestaurantSales from "./pages/OwnerExpenses/RestaurantSales.jsx";
import RestaurantExpense from "./pages/OwnerExpenses/RestaurantExpense.jsx";
import HotelExpense from "./pages/OwnerExpenses/HotelExpense.jsx";
import HotelSales from "./pages/OwnerExpenses/HotelSales.jsx";
import RestaurantsAnalytics from "./pages/OwnerExpenses/RestaurantsAnalytics.jsx";
import HotelAnalytics from "./pages/OwnerExpenses/HotelAnalytics.jsx";
import RestaurantExpensesView from "./pages/OwnerExpenses/RestaurantExpensesView.jsx";
import RestaurantSalesView from "./pages/OwnerExpenses/RestaurantSalesView.jsx";
import HotelExpensesView from "./pages/OwnerExpenses/HotelExpensesView.jsx";
import HotelSalesView from "./pages/OwnerExpenses/HotelSalesView.jsx";
import ManageCheckin from "./pages/room/ManageCheckin.jsx";
import CheckinPersonInfo from "./pages/room/CheckinPersonInfo.jsx";
import EditSalesHotel from "./components/OwnerExpenses/EditSalesHotel.jsx";
import TodaysCheckinList from "./pages/room/TodaysCheckinList.jsx";
import TodayBookings from "./pages/room/TodaysBookings.jsx";
import TodayCheckout from "./pages/room/TodayCheckout.jsx";
import TodayCancelBookings from "./pages/room/TodayCancelBookings.jsx";
import DailyCheckin from "./pages/room/DailyCheckin.jsx";
import PaymentSources from "./pages/PaymentSources/PaymentSources.jsx";
import OwnerPaymentSourcesLayout from "./pages/PaymentSources/OwnerPaymentSourcesLayout.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <SignIn />,
        },
        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              element: <DashboardRoot />,
            },
            {
              path: "check-pdf",
              element: <CheckPDF />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "profile/edit",
              element: <EditProfile />,
            },
            {
              path: "profile/admin/edit",
              element: <EditProfileAdmin />,
            },

            // Manager Sidebar
            {
              path: "add-room",
              element: (
                <ManagerRoute>
                  <AddRoom />
                </ManagerRoute>
              ),
            },
            {
              path: "edit-room/:id",
              element: (
                <ManagerRoute>
                  <EditRoom />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-room",
              element: (
                <ManagerRoute>
                  <ManageRoom />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-room/:id",
              element: (
                <ManagerRoute>
                  <ManageSingleRoom />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-booking",
              element: (
                <ManagerRoute>
                  <ManageBooking />
                </ManagerRoute>
              ),
            },
            {
              path: "today-bookings",
              element: (
                <ManagerRoute>
                  <TodayBookings />
                </ManagerRoute>
              ),
            },
            {
              path: "today-cancel-bookings",
              element: (
                <ManagerRoute>
                  <TodayCancelBookings />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-checkin",
              element: (
                <ManagerRoute>
                  <ManageCheckin />
                </ManagerRoute>
              ),
            },
            {
              path: "daily-checkin",
              element: (
                <ManagerRoute>
                  <DailyCheckin />
                </ManagerRoute>
              ),
            },
            {
              path: "todays-checkin-list",
              element: (
                <ManagerRoute>
                  <TodaysCheckinList />
                </ManagerRoute>
              ),
            },
            {
              path: "today-checkouts",
              element: (
                <ManagerRoute>
                  <TodayCheckout />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-booking/:id",
              element: (
                <ManagerRoute>
                  <BookingView />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-checkin/:id",
              element: (
                <ManagerRoute>
                  <CheckinPersonInfo />
                </ManagerRoute>
              ),
            },
            {
              path: "checkin",
              element: (
                <ManagerRoute>
                  <CheckIn />
                </ManagerRoute>
              ),
            },
            {
              path: "checkin/:id",
              element: (
                <ManagerRoute>
                  <CheckInDyn />
                </ManagerRoute>
              ),
            },
            {
              path: "checkout",
              element: (
                <ManagerRoute>
                  <CheckOut />
                </ManagerRoute>
              ),
            },
            {
              path: "restaurant-dashboard",
              element: (
                <ManagerRoute>
                  <RestaurantDashboard />
                </ManagerRoute>
              ),
            },
            {
              path: "add-food",
              element: (
                <ManagerRoute>
                  <AddFood />
                </ManagerRoute>
              ),
            },
            {
              path: "add-table",
              element: (
                <ManagerRoute>
                  <AddTable />
                </ManagerRoute>
              ),
            },
            {
              path: "edit-food/:id",
              element: (
                <ManagerRoute>
                  <EditFood />
                </ManagerRoute>
              ),
            },
            {
              path: "add-order",
              element: (
                <ManagerRoute>
                  <AddOrder />
                </ManagerRoute>
              ),
            },
            {
              path: "order-list",
              element: (
                <ManagerRoute>
                  <OrderList />
                </ManagerRoute>
              ),
            },
            {
              path: "current-order-list",
              element: (
                <ManagerRoute>
                  <CurOrderList />
                </ManagerRoute>
              ),
            },
            {
              path: "single-checkout/:id",
              element: (
                <ManagerRoute>
                  <FoodCheckout />
                </ManagerRoute>
              ),
            },
            {
              path: "orderDetails/:id",
              element: (
                <ManagerRoute>
                  <FoodCheckout />
                </ManagerRoute>
              ),
            },
            {
              path: "show-all-sell",
              element: (
                <ManagerRoute>
                  <ShowAllSell />
                </ManagerRoute>
              ),
            },
            {
              path: "show-all-sell-details",
              element: (
                <ManagerRoute>
                  <ShowALlSellView />
                </ManagerRoute>
              ),
            },
            {
              path: "food-inventory",
              element: (
                <ManagerRoute>
                  <FoodInventory />
                </ManagerRoute>
              ),
            },
            {
              path: "add-inventory",
              element: (
                <ManagerRoute>
                  <AddInventory />
                </ManagerRoute>
              ),
            },
            {
              path: "all-inventory",
              element: (
                <ManagerRoute>
                  <ManageInventory />
                </ManagerRoute>
              ),
            },
            {
              path: "add-expense",
              element: (
                <ManagerRoute>
                  <AddExpense />
                </ManagerRoute>
              ),
            },
            {
              path: "all-hotel-expenses",
              element: (
                <ManagerRoute>
                  <HotelExpenses />
                </ManagerRoute>
              ),
            },
            {
              path: "hotel-expense/:id",
              element: (
                <ManagerRoute>
                  <HotelExpenseDetails />
                </ManagerRoute>
              ),
            },
            {
              path: "add-hotel-expense",
              element: (
                <ManagerRoute>
                  <AddHotelExpense />
                </ManagerRoute>
              ),
            },
            {
              path: "edit-inventory/:id",
              element: (
                <ManagerRoute>
                  <EditInventory />
                </ManagerRoute>
              ),
            },
            {
              path: "show-all-expense",
              element: (
                <ManagerRoute>
                  <ShowAllExpense />
                </ManagerRoute>
              ),
            },
            {
              path: "show-all-expense/:id",
              element: (
                <ManagerRoute>
                  <ShowAllExpenseView />
                </ManagerRoute>
              ),
            },
            {
              path: "all-hotel-expense/:id",
              element: (
                <ManagerRoute>
                  <ShowAllExpenseView />
                </ManagerRoute>
              ),
            },
            {
              path: "hotel-dashboard",
              element: (
                <ManagerRoute>
                  <RestaurantDashboard />
                </ManagerRoute>
              ),
            },
            {
              path: "add-employee",
              element: (
                <ManagerRoute>
                  <AddEmployee />
                </ManagerRoute>
              ),
            },
            {
              path: "edit-employee/:id",
              element: (
                <ManagerRoute>
                  <EditEmployee />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-employee",
              element: (
                <ManagerRoute>
                  <ManageEmployee />
                </ManagerRoute>
              ),
            },
            {
              path: "manage-employee/:id",
              element: (
                <ManagerRoute>
                  <EmployeeView />
                </ManagerRoute>
              ),
            },
            {
              path: "report",
              element: (
                <ManagerRoute>
                  <ReportManager />
                </ManagerRoute>
              ),
            },
            {
              path: "report/view",
              element: (
                <ManagerRoute>
                  <ReportView />
                </ManagerRoute>
              ),
            },
            {
              path: "add-order",
              element: (
                <ManagerRoute>
                  <AddOrder />
                </ManagerRoute>
              ),
            },

            {
              path: "add-swimming-pool",
              element: (
                <ManagerRoute>
                  <AddSwimmingPool />
                </ManagerRoute>
              ),
            },
            {
              path: "swimming-booking",
              element: (
                <ManagerRoute>
                  <SwimmingBooking />
                </ManagerRoute>
              ),
            },
            {
              path: "swimming-edit/:id",
              element: (
                <ManagerRoute>
                  <EditSwimming />
                </ManagerRoute>
              ),
            },
            {
              path: "swimming-pool-list",
              element: (
                <ManagerRoute>
                  <SwimmingPoolList />
                </ManagerRoute>
              ),
            },
            {
              path: "swimming-pool-list/:id",
              element: (
                <ManagerRoute>
                  <SwimmingPoolLIstView />
                </ManagerRoute>
              ),
            },
            {
              path: "pool-reservation",
              element: (
                <ManagerRoute>
                  <PoolReservation />
                </ManagerRoute>
              ),
            },
            {
              path: "add-gym",
              element: (
                <ManagerRoute>
                  <AddGym />
                </ManagerRoute>
              ),
            },
            {
              path: "gym-booking",
              element: (
                <ManagerRoute>
                  <GymBooking />
                </ManagerRoute>
              ),
            },
            {
              path: "gym-list",
              element: (
                <ManagerRoute>
                  <GymList />
                </ManagerRoute>
              ),
            },
            {
              path: "payment-sources",
              element: (
                <ManagerRoute>
                  <PaymentSources />
                </ManagerRoute>
              ),
            },
            // Owner Hotel  Sidebar

            {
              path: "owner-todays-checkin-list",
              element: (
                <OwnerRoute>
                  <TodaysCheckinList />
                </OwnerRoute>
              ),
            },
            {
              path: "owner-todays-checkout-list",
              element: (
                <OwnerRoute>
                  <TodayCheckout />
                </OwnerRoute>
              ),
            },
            {
              path: "owner-today-bookings-list",
              element: (
                <OwnerRoute>
                  <TodayBookings />
                </OwnerRoute>
              ),
            },
            {
              path: "owner-today-bookings-cancel",
              element: (
                <OwnerRoute>
                  <TodayCancelBookings />
                </OwnerRoute>
              ),
            },
            {
              path: "add-hotel",
              element: (
                <OwnerRoute>
                  <AddHotel />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-list",
              element: (
                <OwnerRoute>
                  <HotelLists />
                </OwnerRoute>
              ),
            },
            {
              path: "hotelList-view/:id",
              element: (
                <OwnerRoute>
                  <HotelListView />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-edit/:id",
              element: (
                <OwnerRoute>
                  <HotelEdit />
                </OwnerRoute>
              ),
            },
            // expenses Hotel

            {
              path: "restaurant-expenses",
              element: (
                <OwnerRoute>
                  <RestaurantExpense />
                </OwnerRoute>
              ),
            },
            {
              path: "restaurant-expenses/:id",
              element: (
                <OwnerRoute>
                  <ShowAllExpenseView />
                  {/* <RestaurantExpensesView /> */}
                </OwnerRoute>
              ),
            },
            {
              path: "restaurant-sales",
              element: (
                <OwnerRoute>
                  <RestaurantSales />
                  {/* <ShowAllSell /> */}
                </OwnerRoute>
              ),
            },
            {
              path: "restaurant-sales-details",
              element: (
                <OwnerRoute>
                  <ShowALlSellView />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-expenses",
              element: (
                <OwnerRoute>
                  <HotelExpense />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-expenses/:id",
              element: (
                <OwnerRoute>
                  <ShowAllExpenseView />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-sales",
              element: (
                <OwnerRoute>
                  <HotelSales />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-sales-details",
              element: (
                <OwnerRoute>
                  <HotelSalesView />
                </OwnerRoute>
              ),
            },
            {
              path: "sales-hotel-view/:id",
              element: (
                <OwnerRoute>
                  <EditSalesHotel />
                </OwnerRoute>
              ),
            },
            {
              path: "restaurants-analytics",
              element: (
                <OwnerRoute>
                  <RestaurantsAnalytics />
                </OwnerRoute>
              ),
            },
            {
              path: "hotel-analytics",
              element: (
                <OwnerRoute>
                  <RestaurantsAnalytics />
                </OwnerRoute>
              ),
            },
            {
              path: "change-hotel-password/:id",
              element: (
                <OwnerRoute>
                  <ChangeManagerPassword />
                </OwnerRoute>
              ),
            },
            {
              path: "add-manager",
              element: (
                <OwnerRoute>
                  <AddManager />
                </OwnerRoute>
              ),
            },
            {
              path: "manager-list",
              element: (
                <OwnerRoute>
                  <ManagerList />
                </OwnerRoute>
              ),
            },
            {
              path: "managerList-view/:id",
              element: (
                <OwnerRoute>
                  <ManagerListView />
                </OwnerRoute>
              ),
            },
            {
              path: "manager-edit/:id",
              element: (
                <OwnerRoute>
                  <ManagerEdit />
                </OwnerRoute>
              ),
            },
            {
              path: "license-history",
              element: (
                <OwnerRoute>
                  <LicenseHistory />
                </OwnerRoute>
              ),
            },
            {
              path: "finance",
              element: (
                <OwnerRoute>
                  <MonitorFinance />
                </OwnerRoute>
              ),
            },
            {
              path: "owner/payment-sources",
              element: (
                <OwnerRoute>
                  <OwnerPaymentSourcesLayout />
                </OwnerRoute>
              ),
            },

            // Admin sidebar
            {
              path: "new-license",
              element: (
                <AdminRoute>
                  <AdminNewLicense />
                </AdminRoute>
              ),
            },
            {
              path: "suspend-list",
              element: (
                <AdminRoute>
                  <SuspendList />
                </AdminRoute>
              ),
            },
            {
              path: "expired-list",
              element: (
                <AdminRoute>
                  <ExpiredList />
                </AdminRoute>
              ),
            },

            {
              path: "renew-view/:id",
              element: (
                <AdminRoute>
                  <RenewView />
                </AdminRoute>
              ),
            },
            {
              path: "edit-renew/:id",
              element: (
                <AdminRoute>
                  <EditRenew />
                </AdminRoute>
              ),
            },
            {
              path: "adminowner-list",
              element: (
                <AdminRoute>
                  <AdminOwnerList />
                </AdminRoute>
              ),
            },
            {
              path: "adminowner-view/:id",
              element: (
                <AdminRoute>
                  <AdminOwnerView />
                </AdminRoute>
              ),
            },
            {
              path: "owner-profile/:id/edit",
              element: (
                <AdminRoute>
                  <OwnerProfile />
                </AdminRoute>
              ),
            },
            {
              path: "suspend-lock-management/:id",
              element: (
                <AdminRoute>
                  <EditRenew />
                </AdminRoute>
              ),
            },
            {
              path: "suspend-lock-list",
              element: (
                <AdminRoute>
                  <SuspendAndLockList />
                </AdminRoute>
              ),
            },
            {
              path: "add-sub-admin",
              element: (
                <AdminRoute>
                  <AddSubAdmin />
                </AdminRoute>
              ),
            },
            {
              path: "sub-admin-list",
              element: (
                <AdminRoute>
                  <SubAdminList />
                </AdminRoute>
              ),
            },
            {
              path: "sub-admin-list-view/:id",
              element: (
                <AdminRoute>
                  <SubAdminListView />
                </AdminRoute>
              ),
            },
            {
              path: "sub-admin-profile/:id/edit",
              element: (
                <AdminRoute>
                  <SubAdminProfile />
                </AdminRoute>
              ),
            },
            {
              path: "admin-report",
              element: (
                <AdminRoute>
                  <Report />
                </AdminRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;
