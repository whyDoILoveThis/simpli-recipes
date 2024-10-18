const RequestStatus = ({ status }: { status: string }) => {
  return (
    <p
      className={`text-center text-sm ${
        status === "pending"
          ? "border border-blue-500 bg-blue-700 bg-opacity-20 text-blue-300 rounded-full"
          : status === "accepted"
          ? "border border-green-500 bg-green-700 bg-opacity-20 text-green-300 rounded-full"
          : status === "rejected" &&
            "border border-red-500 bg-red-700 bg-opacity-20 text-red-300 rounded-full"
      }`}
    >
      {status}
    </p>
  );
};

export default RequestStatus;
