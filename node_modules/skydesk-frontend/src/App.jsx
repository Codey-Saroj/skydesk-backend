import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FlightDetails from './pages/FlightDetails.jsx'
import SearchResults from './pages/SearchResults.jsx'
import Bookings from './pages/Bookings.jsx'
import SavedFlights from './pages/SavedFlights.jsx'
import Wishlist from './pages/Wishlist.jsx'
import TravelWallet from './pages/TravelWallet.jsx'
import Offers from './pages/Offers.jsx'
import Support from './pages/Support.jsx'
import ExpenseReport from './pages/ExpenseReport.jsx'
import AddExpense from './pages/AddExpense.jsx'
import TripReport from './pages/TripReport.jsx'
import ExpenseAnalytics from './pages/ExpenseAnalytics.jsx'
import Settings from './pages/Settings.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function Protected({ page }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{page}</DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to Sign In page */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Authentication Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Pages */}
         <Route path="/dashboard" element={<Protected page={<Dashboard />} />} />
        <Route path="/flights/:id" element={<Protected page={<FlightDetails />} />} />
        <Route path="/search-results" element={<Protected page={<SearchResults />} />} />
        <Route path="/expenses" element={<Protected page={<ExpenseReport />} />} />
        <Route path="/expenses/new" element={<Protected page={<AddExpense />} />} />
        <Route path="/my-trips" element={<Protected page={<TripReport />} />} />
        <Route path="/analytics" element={<Protected page={<ExpenseAnalytics />} />} />
        <Route path="/settings" element={<Protected page={<Settings />} />} />
        <Route path="/bookings" element={<Protected page={<Bookings />} />} />
        <Route path="/saved-flights" element={<Protected page={<SavedFlights />} />} />
        <Route path="/wishlist" element={<Protected page={<Wishlist />} />} />
        <Route path="/wallet" element={<Protected page={<TravelWallet />} />} />
        <Route path="/offers" element={<Protected page={<Offers />} />} />
        <Route path="/support" element={<Protected page={<Support />} />} />

        {/* Catch-all fallback redirect */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

