import React from "react";
import PortfolioManagement from "../../assets/StocksHome/PortfolioManagement.png";
import FinancialReports from "../../assets/StocksHome/FinancialReports.png";
import CommentingSystem from "../../assets/StocksHome/CommentingSystem.png";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Comprehensive Portfolio Management",
      description:
        "Save stocks to your portfolio from all stock exchanges and export your portfolio to CSV for further analysis.",
      image: PortfolioManagement,
    },
    {
      title: "Detailed Financial Reports",
      description:
        "Access key metrics and financial statements such as Income Statements, Balance Sheets, and Cash Flow Statements.",
      image: FinancialReports,
    },
    {
      title: "Interactive Commenting System",
      description:
        "Share your opinions about stocks with the community. (In-progress: Editing and deleting comments coming soon.)",
      image: CommentingSystem,
    },
  ];

  return (
    <section className="text-gray-600 body-font !z-10 shadow-xl dark:shadow-gray-700 bg-[#f8f4e1] dark:bg-gray-900 !bg-opacity-80 rounded-lg">
      <div className="container px-5 py-24 mx-auto">
        <h2
          id="Features"
          className="text-3xl font-semibold title-font mb-12 text-gray-900 dark:text-white text-center"
        >
          Platform Features
        </h2>
        <div className="flex flex-col -m-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-4 md:flex md:items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="md:w-1/2">
                <img
                  className="w-full h-full object-contain object-center shadow-lg rounded-xl"
                  src={feature.image}
                  alt={feature.title}
                />
              </div>
              <div className="md:w-1/2 md:p-8">
                <h3 className="title-font text-2xl font-medium text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="leading-relaxed mb-3 text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
