import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CompanyProfile } from "../../company";
import { getCompanyProfile } from "../../api";
import Header from "../../Components/Header/Header";
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard";
import Tile from "../../Components/Tile/Tile";
import TenKFinder from "../../Components/TenKFinder/TenKFinder";
import ReadMore from "../../Components/ReadMore/ReadMore";
import { Box, Divider } from "@mui/material";
import ConnectionStatusFeedBack from "../../Components/ConnectionStatusFeedBack/ConnectionStatusFeedBack";
import { BarLoader } from "react-spinners";

const CompanyPage = () => {
  const { ticker } = useParams();
  const [company, setCompany] = useState<CompanyProfile>();

  useEffect(() => {
    const getProfileInit = async () => {
      const result = await getCompanyProfile(ticker!);
      setCompany(result[0]);
      console.log(result[0]);
    };
    getProfileInit();
  }, [ticker]);

  // Function to format DCF value
  const formatDecimal = (num: number) => {
    return num.toFixed(2);
  };

  return (
    <>
      <div className="max-w-[30rem] mx-auto">
        <ConnectionStatusFeedBack />
      </div>

      {company ? (
        <div className="w-full ">
          <CompanyDashboard ticker={ticker!}>
            {/* Tiles */}
            <Box className="w-full flex flex-wrap mx-4 flex-grow justify-center">
              <Tile title="Company Name" subTitle={company.companyName} />
              <Tile
                title="Price"
                subTitle={`$${formatDecimal(company.price)}`}
              />
              <Tile title="DCF" subTitle={`$${formatDecimal(company.dcf)}`} />
              <Tile title="Sector" subTitle={company.sector} />
            </Box>
            {/* TenKFinder */}
            <TenKFinder ticker={company.symbol} />
            <div className="bg-white dark:bg-gray-800 shadow rounded-t text-medium text-gray-900 dark:text-gray-100 p-6 mt-4 mx-4">
              <h3 className="text-xl font-semibold ">Company Description</h3>
              <ReadMore text={company.description} maxCharacters={300} />
            </div>
            <div className="w-full px-4 ">
              <Divider className="border-gray-300 dark:border-gray-700  bg-white dark:bg-gray-800 " />
              <Header />
            </div>
          </CompanyDashboard>
        </div>
      ) : (
        <BarLoader />
      )}
    </>
  );
};

export default CompanyPage;
