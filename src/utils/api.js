const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper function to get cookie value
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
      ...options,
    };

    // Add auth token from localStorage or cookie
    const token = localStorage.getItem('auth_token') || this.getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyOTP(email, otp, registrationData) {
    console.log('API verifyOTP called with:', { email, otp: String(otp), registrationData });
    
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp: String(otp), registrationData }),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email, otp, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  async getUserProfile() {
    return this.request('/auth/me'); // Changed from '/auth/profile' to '/auth/me'
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Resume endpoints
  async saveResumeToCloud(resumeData, template, resumeName, pdfBlob) {
    const formData = new FormData();
    formData.append('resumePdf', pdfBlob, `${resumeName}.pdf`);
    formData.append('resumeData', JSON.stringify(resumeData));
    formData.append('template', template);
    formData.append('resumeName', resumeName);

    return this.request('/resumes/save', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async getUserResumes() {
    return this.request('/resumes/list');
  }

  async downloadResume(resumeId) {
    const response = await fetch(`${this.baseURL}/resumes/download/${resumeId}`, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || this.getCookie('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to download resume');
    }
    
    return response.blob();
  }

  async deleteResume(resumeId) {
    return this.request(`/resumes/delete/${resumeId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();