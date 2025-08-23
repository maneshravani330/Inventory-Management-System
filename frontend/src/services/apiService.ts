// React API Service
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  productId?: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  supplierId?: number;
  imageUrl?: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Transaction {
  id: number;
  totalProducts: number;
  totalPrice: number;
  transactionType: 'PURCHASE' | 'SALE' | 'RETURN';
  status: string;
  description: string;
  createdAt: string;
  // Legacy fields for backward compatibility
  productId?: number;
  quantity?: number;
  transactionDate?: string;
  product?: Product;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

class ApiService {
  private api: AxiosInstance;
  private secretKey = 'inventorySecretKey';

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5050/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private handleBackendResponse(response: AxiosResponse<any>): ApiResponse {
    console.log('Raw backend response:', response.data); // Debug log
    
    // Handle Spring Boot response format: {status: 200, message: "...", token: "...", role: "...", timestamp: "..."}
    if (response.data && typeof response.data === 'object') {
      if (response.data.status !== undefined) {
        // Spring Boot format - for login, the token and role are at root level
        let data;
        if (response.data.token) {
          data = {
            token: response.data.token,
            user: {
              role: response.data.role,
              email: response.data.email || '',
              name: response.data.name || '',
              id: response.data.id || 0
            }
          };
        } else {
          // Extract the actual data property (products, product, categories, suppliers, transactions, etc.)
          data = response.data.products || response.data.product || response.data.categories || 
                 response.data.suppliers || response.data.transactions || response.data.data || response.data;
        }
        
        console.log('Extracted data:', data); // Debug log
        
        return {
          success: response.data.status >= 200 && response.data.status < 300,
          message: response.data.message || 'Success',
          data: data,
          statusCode: response.data.status,
        };
      }
    }
    
    // Fallback to HTTP status
    console.log('Using fallback response handling'); // Debug log
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText || 'Success',
      data: response.data,
      statusCode: response.status,
    };
  }

  // ============ AUTHENTICATION ============
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      const result = this.handleBackendResponse(response);
      
      console.log('Login response:', result); // Debug log
      
      if (result.success && result.data?.token) {
        this.setToken(result.data.token);
        console.log('Token stored successfully'); // Debug log
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const result = this.handleBackendResponse(error.response);
        console.log('Login error response:', result); // Debug log
        return result;
      }
      
      return {
        success: false,
        message: 'Network error. Please try again.',
        data: null,
        statusCode: 500,
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/auth/register', userData);
    return this.handleBackendResponse(response);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<any> = await this.api.get('/users/current');
    return this.handleBackendResponse(response);
  }

  async updateUser(userId: number, userData: { name?: string; email?: string; password?: string; phoneNumber?: string }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.put(`/users/update/${userId}`, userData);
    return this.handleBackendResponse(response);
  }

  // ============ TOKEN MANAGEMENT ============
  setToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    localStorage.setItem('authToken', encryptedToken);
  }

  getToken(): string | null {
    const encryptedToken = localStorage.getItem('authToken');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  setUserRole(role: string): void {
    const encryptedRole = CryptoJS.AES.encrypt(role, this.secretKey).toString();
    localStorage.setItem('userRole', encryptedRole);
  }

  getRole(): string | null {
    const encryptedRole = localStorage.getItem('userRole');
    if (encryptedRole) {
      const bytes = CryptoJS.AES.decrypt(encryptedRole, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.getRole();
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  // ============ PRODUCTS API ============
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    const response: AxiosResponse<any> = await this.api.get('/products/all');
    return this.handleBackendResponse(response);
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<any> = await this.api.get(`/products/${id}`);
    return this.handleBackendResponse(response);
  }

  async createProduct(productData: FormData): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/products/add', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return this.handleBackendResponse(response);
  }

  async updateProduct(productData: FormData): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.put('/products/update', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return this.handleBackendResponse(response);
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.delete(`/products/delete/${id}`);
    return this.handleBackendResponse(response);
  }

  // ============ CATEGORIES API ============
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    const response: AxiosResponse<any> = await this.api.get('/categories/all');
    return this.handleBackendResponse(response);
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<any> = await this.api.get(`/categories/${id}`);
    return this.handleBackendResponse(response);
  }

  async createCategory(categoryData: { name: string; description?: string }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/categories/add', categoryData);
    return this.handleBackendResponse(response);
  }

  async updateCategory(id: number, categoryData: { name: string; description?: string }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.put(`/categories/update/${id}`, categoryData);
    return this.handleBackendResponse(response);
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.delete(`/categories/delete/${id}`);
    return this.handleBackendResponse(response);
  }

  // ============ SUPPLIERS API ============
  async getAllSuppliers(): Promise<ApiResponse<Supplier[]>> {
    const response: AxiosResponse<any> = await this.api.get('/suppliers/all');
    return this.handleBackendResponse(response);
  }

  async getSupplierById(id: number): Promise<ApiResponse<Supplier>> {
    const response: AxiosResponse<any> = await this.api.get(`/suppliers/${id}`);
    return this.handleBackendResponse(response);
  }

  async createSupplier(supplierData: { name: string; email: string; phone: string; address: string }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/suppliers/add', supplierData);
    return this.handleBackendResponse(response);
  }

  async updateSupplier(id: number, supplierData: { name: string; email: string; phone: string; address: string }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.put(`/suppliers/update/${id}`, supplierData);
    return this.handleBackendResponse(response);
  }

  async deleteSupplier(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.delete(`/suppliers/delete/${id}`);
    return this.handleBackendResponse(response);
  }

  // ============ TRANSACTIONS API ============
  async getAllTransactions(page: number = 0, size: number = 1000, searchText?: string): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (searchText) {
      params.append('searchText', searchText);
    }
    const response: AxiosResponse<any> = await this.api.get(`/transactions/all?${params.toString()}`);
    return this.handleBackendResponse(response);
  }

  async getTransactionsByMonthYear(month: number, year: number): Promise<ApiResponse<Transaction[]>> {
    const response: AxiosResponse<any> = await this.api.get(`/transactions/by-month-year?month=${month}&year=${year}`);
    return this.handleBackendResponse(response);
  }

  async getTransactionById(id: number): Promise<ApiResponse<Transaction>> {
    const response: AxiosResponse<any> = await this.api.get(`/transactions/${id}`);
    return this.handleBackendResponse(response);
  }

  async createPurchaseTransaction(transactionData: {
    productId: number;
    quantity: number;
    supplierId?: number;
    description?: string;
  }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/transactions/purchase', transactionData);
    return this.handleBackendResponse(response);
  }

  async createSaleTransaction(transactionData: {
    productId: number;
    quantity: number;
    description?: string;
  }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/transactions/sell', transactionData);
    return this.handleBackendResponse(response);
  }

  async createReturnTransaction(transactionData: {
    productId: number;
    quantity: number;
    supplierId?: number;
    description?: string;
  }): Promise<ApiResponse> {
    const response: AxiosResponse<any> = await this.api.post('/transactions/return', transactionData);
    return this.handleBackendResponse(response);
  }
}

const apiService = new ApiService();
export default apiService;