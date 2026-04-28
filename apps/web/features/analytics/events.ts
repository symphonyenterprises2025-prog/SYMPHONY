export const ANALYTICS_EVENTS = {
  // Product events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
  
  // Cart events
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_FAILED: 'checkout_failed',
  
  // Order events
  ORDER_PLACED: 'order_placed',
  ORDER_CANCELLED: 'order_cancelled',
  
  // Search events
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  
  // User events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  
  // Content events
  BLOG_POST_VIEWED: 'blog_post_viewed',
  PAGE_VIEWED: 'page_viewed',
} as const
