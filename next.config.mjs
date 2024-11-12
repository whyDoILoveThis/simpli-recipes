/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["firebasestorage.googleapis.com", 'img.clerk.com', "images.unsplash.com"], // Add the Clerk image domain here
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.html$/,
        use: 'raw-loader',
      });
      return config;
    },

    
  };

  

  
  
  export default nextConfig;
  