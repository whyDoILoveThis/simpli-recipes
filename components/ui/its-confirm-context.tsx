// ConfirmContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "./button";

interface ConfirmContextType {
  customConfirm: (message: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [resolveCallback, setResolveCallback] =
    useState<(value: boolean) => void>();

  const customConfirm = (msg: string) => {
    setMessage(msg);
    return new Promise<boolean>((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = (result: boolean) => {
    if (resolveCallback) {
      resolveCallback(result);
      setMessage(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ customConfirm }}>
      {children}
      {message && (
        <div className="zz-top fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white bg-opacity-20 p-6 rounded-md shadow-md">
            <p className="text-lg text-slate-300 mb-4">{message}</p>
            <div className="flex justify-end gap-4">
              <Button onClick={() => handleConfirm(false)}>NO!</Button>
              <Button
                variant={"destructive"}
                onClick={() => handleConfirm(true)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
