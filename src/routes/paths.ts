export const appPaths = {
  home: "/home",
  login: "/",
  productDetailsRoute: "/products/:id",
  productDetails: (productId: number) => `/products/${productId}`,
};
