import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async getCurrentUser(token) {
    this.setAuthToken(token);
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Dashboard methods
  async getDashboardStats(token) {
    this.setAuthToken(token);
    const response = await this.client.get('/analytics/dashboard');
    return response.data;
  }

  // Menu methods
  async getMenuItems(token, params = {}) {
    this.setAuthToken(token);
    const response = await this.client.get('/menu/items', { params });
    return response.data;
  }

  async getMenuCategories(token) {
    this.setAuthToken(token);
    const response = await this.client.get('/menu/categories');
    return response.data;
  }

  async createMenuItem(token, data) {
    this.setAuthToken(token);
    const response = await this.client.post('/menu/items', data);
    return response.data;
  }

  async updateMenuItem(token, id, data) {
    this.setAuthToken(token);
    const response = await this.client.put(`/menu/items/${id}`, data);
    return response.data;
  }

  async deleteMenuItem(token, id) {
    this.setAuthToken(token);
    const response = await this.client.delete(`/menu/items/${id}`);
    return response.data;
  }

  // Order methods
  async getOrders(token, params = {}) {
    this.setAuthToken(token);
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  async updateOrderStatus(token, orderId, status) {
    this.setAuthToken(token);
    const response = await this.client.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }

  // User methods
  async getUsers(token, params = {}) {
    this.setAuthToken(token);
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async updateUserRole(token, userId, role) {
    this.setAuthToken(token);
    const response = await this.client.put(`/users/${userId}/role`, { role });
    return response.data;
  }

  // Review methods
  async getReviews(token, params = {}) {
    this.setAuthToken(token);
    const response = await this.client.get('/reviews', { params });
    return response.data;
  }

  async moderateReview(token, reviewId, status) {
    this.setAuthToken(token);
    const response = await this.client.put(`/reviews/${reviewId}/moderate`, { status });
    return response.data;
  }

  // Analytics methods
  async getSalesTrends(token, period = '7d') {
    this.setAuthToken(token);
    const response = await this.client.get('/analytics/sales-trends', {
      params: { period }
    });
    return response.data;
  }

  async getPopularItems(token) {
    this.setAuthToken(token);
    const response = await this.client.get('/analytics/popular-items');
    return response.data;
  }
}

export default new ApiService();