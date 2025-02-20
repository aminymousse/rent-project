import React from "react";
const Card = ({ className, ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }) => {
  return <div className={`p-4 ${className}`} {...props} />;
};

const CardTitle = ({ className, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }) => {
  return <div className={`p-4 pt-0 ${className}`} {...props} />;
};

const CardFooter = ({ className, ...props }) => {
  return <div className={`p-4 border-t ${className}`} {...props} />;
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
