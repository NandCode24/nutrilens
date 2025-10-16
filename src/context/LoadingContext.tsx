"use client";
import { createContext, useContext, useState } from "react";
import GlobalLoader from "@/components/GlobalLoader";

type LoadingContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <GlobalLoader visible={visible} />
    </LoadingContext.Provider>
  );
};
