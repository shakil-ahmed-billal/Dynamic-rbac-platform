export const jwtUtils = {
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },
  verifyToken: (token: string) => {
    const decoded = jwtUtils.decodeToken(token);
    if (!decoded) return { success: false, data: null };
    
    const isExpired = decoded.exp * 1000 < Date.now();
    return { success: !isExpired, data: decoded };
  }
};
