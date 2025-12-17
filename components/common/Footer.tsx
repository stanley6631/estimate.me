import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-y p-5 text-center">
      <p className="text-sm">© {new Date().getFullYear()} estimate.me</p>
    </footer>
  );
};

export default React.memo(Footer);
