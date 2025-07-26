import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Briefcase, User, LogOut, Home, FileText, Plus } from "lucide-react";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
  };

  const isRecruiter = user?.publicMetadata?.role === "recruiter";
  const isCandidate = user?.publicMetadata?.role === "candidate";

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">NextGen</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/jobs"
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
            </Link>

            {isSignedIn ? (
              <>
                {isCandidate && (
                  <Link
                    to="/my-applications"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/my-applications"
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Applications</span>
                  </Link>
                )}

                {isRecruiter && (
                  <>
                    <Link
                      to="/recruiter"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === "/recruiter"
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/recruiter/post-job"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === "/recruiter/post-job"
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Post Job</span>
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm text-gray-300">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
