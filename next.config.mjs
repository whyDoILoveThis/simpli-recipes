/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["firebasestorage.googleapis.com", 'img.clerk.com'], // Add the Clerk image domain here
    },
  };
  
  export default nextConfig;
  