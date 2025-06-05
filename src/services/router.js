import { Router } from '@vaadin/router';

/**
 * Router configuration and setup
 */
class RouterService {
  constructor() {
    this.router = null;
    this.outlet = null;
  }

  /**
   * Initialize the router with routes
   * @param {HTMLElement} outlet - Router outlet element
   */
  init(outlet) {
    this.outlet = outlet;
    this.router = new Router(outlet);

    console.log('Setting up router routes...');

    // Define routes
    this.router.setRoutes([
      {
        path: '/',
        redirect: '/employees'
      },
      {
        path: '/employees',
        component: 'employee-list'
      },
      {
        path: '/employees/add',
        component: 'employee-form'
      },
      {
        path: '/employees/edit/:id',
        component: 'employee-form'
      },
      {
        path: '(.*)',
        redirect: '/employees'
      }
    ]);

    console.log('Router routes set up successfully');

    // Ensure we navigate to the current path or default
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);

    if (currentPath === '/' || currentPath === '') {
      this.navigate('/employees');
    }
  }

  /**
   * Navigate to a specific route
   * @param {string} path - Path to navigate to
   */
  navigate(path) {
    console.log('Navigating to:', path);
    if (this.router) {
      Router.go(path);
    } else {
      console.error('Router not initialized when trying to navigate to:', path);
    }
  }

  /**
   * Get current location
   * @returns {Object} Current location info
   */
  getCurrentLocation() {
    return this.router?.location || {};
  }

  /**
   * Go back in history
   */
  goBack() {
    window.history.back();
  }
}

// Create singleton instance
export const routerService = new RouterService();
