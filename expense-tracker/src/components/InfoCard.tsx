import React from "react";

type CardProps = {
  title: string;
  value: string;
  bgColor?: string;
  titleColor?: string;
  valueColor?: string;
};

const InfoCard: React.FC<CardProps> = ({
  title,
  value,
  bgColor = "bg-blue-400",
  titleColor = "text-gray-900",
  valueColor = "text-black",
}) => {
  return (
    <div
      className={`flex-1 card ${bgColor} shadow-xl rounded-lg p-4 m-2 text-center`}
    >
      <h4 className={`text-xl font-semibold ${titleColor}`}>{title}</h4>
      <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
};

export default InfoCard;
