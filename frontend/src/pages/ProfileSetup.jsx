import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { User, Building } from "lucide-react";

const ProfileSetup = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    if (user?.publicMetadata?.role) {
      navigate(
        user.publicMetadata.role === "recruiter"
          ? "/recruiter"
          : "/my-applications"
      );
    }
  }, [isSignedIn, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!role || (role === "recruiter" && !company)) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      await user.update({
        publicMetadata: {
          role,
          company: role === "recruiter" ? company : undefined,
        },
      });

      navigate(role === "recruiter" ? "/recruiter" : "/my-applications");
    } catch (err) {
      console.error("Error completing profile:", err);
      setError("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-400">
            Tell us about yourself to get a personalized experience
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                I am a:
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={role === "candidate"}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      role === "candidate"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-500"
                    }`}
                  >
                    {role === "candidate" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white font-medium">Job Seeker</div>
                    <div className="text-gray-400 text-sm">
                      Looking for job opportunities
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === "recruiter"}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      role === "recruiter"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-500"
                    }`}
                  >
                    {role === "recruiter" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <Building className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white font-medium">Recruiter</div>
                    <div className="text-gray-400 text-sm">
                      Hiring talented candidates
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {role === "recruiter" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter your company name"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!role || (role === "recruiter" && !company) || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
