import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const ContactUs = () => {
  const handleClick = () => {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Safe Signal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reach out for emergency support, partnerships, or technical
            assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-[#37B6FF] mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6">
              {/* Emergency Contact */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <h3 className="font-bold text-red-700 mb-2">
                  For Immediate Disaster Assistance:
                </h3>
                <div className="flex items-start">
                  <FaPhoneAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-medium">
                      1-800-REL-HUB (735-482)
                    </p>
                    <p className="text-sm text-gray-600">
                      24/7 emergency response line
                    </p>
                  </div>
                </div>
              </div>

              {/* Regular Contacts */}
              {[
                {
                  icon: (
                    <FaEnvelope className="text-2xl text-[#37B6FF] mt-1 mr-4 flex-shrink-0" />
                  ),
                  title: "General Inquiries",
                  content: "support@disasterhub.org",
                  subtitle: "Typically responds within 2 hours during crises",
                },
                {
                  icon: (
                    <FaPhoneAlt className="text-2xl text-[#37B6FF] mt-1 mr-4 flex-shrink-0" />
                  ),
                  title: "Non-Emergency Phone",
                  content: "(XXX) 555-0199",
                  subtitle: "Mon-Fri, 8AM-6PM PST",
                },
                {
                  icon: (
                    <FaMapMarkerAlt className="text-2xl text-[#37B6FF] mt-1 mr-4 flex-shrink-0" />
                  ),
                  title: "Operations Center",
                  content: "255 Disaster Response Way, San Francisco, CA 94107",
                  subtitle: "By appointment only",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start border-b border-gray-100 pb-6"
                >
                  {item.icon}
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-800">{item.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-[#37B6FF] mb-8">
              Send a Message
            </h2>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37B6FF] focus:border-[#37B6FF]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37B6FF] focus:border-[#37B6FF]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37B6FF] focus:border-[#37B6FF]"
                >
                  <option value="">Select a topic</option>
                  <option value="emergency">Emergency Assistance</option>
                  <option value="volunteer">Volunteer Inquiry</option>
                  <option value="partnership">Organization Partnership</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37B6FF] focus:border-[#37B6FF]"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button
                onClick={handleClick}
                className="w-full bg-[#37B6FF] hover:bg-[#2a8acc] text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-16 text-center">
          <h3 className="text-gray-500 mb-6">
            Trusted by emergency response organizations worldwide
          </h3>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {[
              "FEMA",
              "Red Cross",
              "UN OCHA",
              "DirectRelief",
              "AllHandsHearts",
            ].map((org) => (
              <div
                key={org}
                className="bg-white py-3 px-6 rounded-full shadow-sm"
              >
                {org}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
