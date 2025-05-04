import React from "react";
import {
  FaMapMarkedAlt,
  FaUsers,
  FaBell,
  FaHandsHelping,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Localized Disaster Relief Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting communities with critical resources during times of
            crisis through real-time technology and human compassion.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-semibold text-[#37B6FF] mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            When disasters strike, every second counts. We bridge the gap
            between victims and life-saving resources through:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#37B6FF]">
              <h3 className="text-xl font-medium mb-3">
                Real-Time Coordination
              </h3>
              <p>
                Dynamic mapping of shelters, supply distribution points, and
                emergency services updated minute-by-minute.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#37B6FF]">
              <h3 className="text-xl font-medium mb-3">Community Power</h3>
              <p>
                Empowering both victims and volunteers to report needs and offer
                help through a unified platform.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            How We Help
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <FaMapMarkedAlt className="text-4xl mb-4 text-[#37B6FF]" />
                ),
                title: "Live Crisis Map",
                desc: "Visualize shelters, hazards, and resources in affected areas",
              },
              {
                icon: <FaUsers className="text-4xl mb-4 text-[#37B6FF]" />,
                title: "Crowdsourced Reports",
                desc: "Verified user-submitted updates on local conditions",
              },
              {
                icon: (
                  <FaHandsHelping className="text-4xl mb-4 text-[#37B6FF]" />
                ),
                title: "Volunteer Network",
                desc: "Match skilled helpers with those who need immediate assistance",
              },
              {
                icon: <FaBell className="text-4xl mb-4 text-[#37B6FF]" />,
                title: "SMS Alerts",
                desc: "Critical notifications without internet dependency",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-[#37B6FF] to-[#2a8acc] rounded-xl text-white p-8 lg:p-12">
          <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Founded in 2023 after witnessing the communication breakdowns
                during the California wildfires, our team of emergency
                responders, software engineers, and community organizers came
                together to build a better solution.
              </p>
              <p className="text-lg">
                Today, we partner with{" "}
                <strong>FEMA-certified organizations</strong> and{" "}
                <strong>local first responders</strong> to ensure our platform
                meets the highest standards of reliability when lives are on the
                line.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-lg border border-white border-opacity-30">
              <h3 className="text-xl font-medium mb-3">By The Numbers</h3>
              <ul className="space-y-2">
                <li>
                  ✓ <strong>42,000+</strong> lives assisted
                </li>
                <li>
                  ✓ <strong>1,200+</strong> trained volunteers
                </li>
                <li>
                  ✓ <strong>78% faster</strong> resource deployment
                </li>
                <li>
                  ✓ <strong>24/7</strong> crisis monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
