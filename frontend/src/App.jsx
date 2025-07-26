import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";

import MyApplications from "./pages/MyApplications";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";
import ViewApplications from "./pages/ViewApplications";

const App = () => {
  const { user, isSignedIn } = useUser();

  const userData = {
    role: user?.publicMetadata?.role || "",
    name: user?.fullName || "",
  };

  const isProfileComplete = userData.role && userData.name;

  const getDashboardRedirect = () => {
    if (!isProfileComplete) return "/profile-setup";
    return userData.role === "recruiter" ? "/recruiter" : "/my-applications";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          <Route
            path="/dashboard"
            element={
              isSignedIn ? (
                <Navigate to={getDashboardRedirect()} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute
                roleRequired="candidate"
                checkProfile={true}
                userData={userData}
              >
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute
                roleRequired="recruiter"
                checkProfile={true}
                userData={userData}
              >
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute
                roleRequired="recruiter"
                checkProfile={true}
                userData={userData}
              >
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/edit-job/:id"
            element={
              <ProtectedRoute
                roleRequired="recruiter"
                checkProfile={true}
                userData={userData}
              >
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applications/:jobId"
            element={
              <ProtectedRoute
                roleRequired="recruiter"
                checkProfile={true}
                userData={userData}
              >
                <ViewApplications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
