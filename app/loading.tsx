import "@/styles/loader.css";
const loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-[90vh]">
      <div className="loader absolute top-[50%]"></div>
    </div>
  );
};

export default loading;
