"use client";

import Link from "next/link";
import { Button, Flex } from "antd";
import { usePathname } from "next/navigation";
import React from "react";

const getCurrentYear = () => new Date().getFullYear();

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const statisticsHref = `/statistics/${getCurrentYear()}`;
  const transactionsHref = `/transactions/`;
  const isStatisticsPath = pathname === statisticsHref;
  const isTransactionsPath = pathname === "/transactions" || pathname === transactionsHref;

  return (
    <div className="pl-4 pr-4 pt-3 pb-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="text-3xl font-extrabold leading-none cursor-pointer">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-700">
          Finance Analyzer
        </span>
      </div>
      <Flex gap="small" wrap>
        <Link href={statisticsHref}>
          <Button size="middle" className="w-36 justify-center" disabled={isStatisticsPath}>
            Statistics
          </Button>
        </Link>
        <Link href={transactionsHref}>
          <Button size="middle" className="w-36 justify-center" disabled={isTransactionsPath}>
            Transactions
          </Button>
        </Link>
      </Flex>
    </div>
  );
};
