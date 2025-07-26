import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, Users, TrendingUp, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
const Home = () => {
  const { isSignedIn, user } = useUser();
  const isRecruiter = user?.publicMetadata?.role === "recruiter";

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Job with{" "}
              <span className="text-blue-500">NextGen</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect talented candidates with amazing opportunities. Whether
              you're looking for your next career move or searching for the
              perfect hire, JobHire makes it simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isSignedIn ? (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/jobs"
                    className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  {isRecruiter ? (
                    <>
                      <Link
                        to="/recruiter"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      <Link
                        to="/recruiter/post-job"
                        className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                      >
                        Post a Job
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                      >
                        Find Jobs
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      <Link
                        to="/my-applications"
                        className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                      >
                        My Applications
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose NextGen?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We make job searching and hiring simple, efficient, and effective
              for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Quality Jobs
              </h3>
              <p className="text-gray-300">
                Access thousands of verified job opportunities from top
                companies across various industries and experience levels.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Top Talent
              </h3>
              <p className="text-gray-300">
                Connect with skilled professionals and talented candidates ready
                to make an impact at your organization.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Easy Process
              </h3>
              <p className="text-gray-300">
                Streamlined application process with real-time updates and
                direct communication between candidates and recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect match
            through JobHire.
          </p>

          {!isSignedIn && (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
