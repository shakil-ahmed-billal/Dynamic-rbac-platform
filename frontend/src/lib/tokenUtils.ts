import { jwtUtils } from "./jwtUtils";

export const isTokenExpiringSoon = async (token: string | undefined): Promise<boolean> => {
  if (!token) return true;
  
  const decoded = jwtUtils.decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = decoded.exp - currentTime;

  // If less than 5 minutes remaining
  return timeUntilExpiry < 300;
};
