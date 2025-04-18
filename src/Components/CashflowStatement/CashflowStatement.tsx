import { useEffect, useState } from "react";
import { CompanyCashFlow } from "../../company";
import { useOutletContext } from "react-router-dom";
import { getCashflowStatement } from "../../api";
import Table from "../Table/Table";
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormating";
import { ConfigItem, RenderData } from "../RatioList/RatioList";
import { BarLoader } from "react-spinners";

const configs: ConfigItem[] = [
  {
    label: "Date",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return company.date;
    },
  },
  {
    label: "Operating Cashflow",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(company.operatingCashFlow);
    },
  },
  {
    label: "Investing Cashflow",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(
        company.netCashUsedForInvestingActivites
      );
    },
  },
  {
    label: "Financing Cashflow",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(
        company.netCashUsedProvidedByFinancingActivities
      );
    },
  },
  {
    label: "Cash At End of Period",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(company.cashAtEndOfPeriod);
    },
  },
  {
    label: "CapEX",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(company.capitalExpenditure);
    },
  },
  {
    label: "Issuance Of Stock",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(company.commonStockIssued);
    },
  },
  {
    label: "Free Cash Flow",
    render: (data: RenderData) => {
      const company = data as CompanyCashFlow;
      return formatLargeMonetaryNumber(company.freeCashFlow);
    },
  },
];

const CashflowStatement = () => {
  const ticker = useOutletContext<string>();
  const [cashflowData, setCashflowData] = useState<CompanyCashFlow[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ticker) {
      console.warn("Ticker is undefined. Skipping fetch.");
      setLoading(false);
      return;
    }

    const fetchCashflowData = async () => {
      try {
        const result = await getCashflowStatement(ticker!);
        setCashflowData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching cashflow statement:", err);
        setError("Failed to load cashflow statement data.");
        setCashflowData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCashflowData();
  }, [ticker]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <BarLoader />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : cashflowData && cashflowData.length > 0 ? (
        <div className="space-y-6">
          <Table config={configs} data={cashflowData} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-300">
            No cashflow data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default CashflowStatement;
