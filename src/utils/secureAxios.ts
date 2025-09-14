import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Maximum allowed content length (1MB by default)
const MAX_CONTENT_LENGTH = 1024 * 1024; // 1MB
const MAX_BODY_LENGTH = 1024 * 1024; // 1MB

/**
 * Validates data URI size before making the request
 * @param url The URL to validate
 * @param maxContentLength Maximum allowed content length
 */
function validateDataURI(url: string, maxContentLength: number = MAX_CONTENT_LENGTH): void {
  if (url.startsWith('data:')) {
    // Extract the data portion after 'data:'
    const dataStart = url.indexOf(',');
    if (dataStart === -1) {
      throw new Error('Invalid data URI format');
    }
    
    const header = url.substring(5, dataStart); // Skip 'data:' prefix
    const data = url.substring(dataStart + 1);
    
    // Check if it's base64 encoded
    const isBase64 = header.includes('base64');
    
    let estimatedSize: number;
    if (isBase64) {
      // Base64 encoding: 4 characters represent 3 bytes
      // Add padding estimation
      estimatedSize = Math.floor((data.length * 3) / 4);
    } else {
      // URL-encoded data - estimate decoded size
      estimatedSize = decodeURIComponent(data).length;
    }
    
    if (estimatedSize > maxContentLength) {
      throw new Error(`Data URI size (${estimatedSize} bytes) exceeds maximum allowed size (${maxContentLength} bytes)`);
    }
  }
}

/**
 * Secure axios instance with data URI size validation
 */
const secureAxios = axios.create({
  // Set reasonable defaults for content length limits
  maxContentLength: MAX_CONTENT_LENGTH,
  maxBodyLength: MAX_BODY_LENGTH,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to validate data URIs
secureAxios.interceptors.request.use(
  (config) => {
    if (config.url) {
      validateDataURI(config.url, config.maxContentLength || MAX_CONTENT_LENGTH);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Secure axios get method with data URI validation
 */
export const secureGet = async <T = unknown>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // Validate the URL before making the request
  validateDataURI(url, config?.maxContentLength || MAX_CONTENT_LENGTH);
  
  return secureAxios.get<T>(url, {
    maxContentLength: MAX_CONTENT_LENGTH,
    maxBodyLength: MAX_BODY_LENGTH,
    ...config,
  });
};

export { secureAxios, validateDataURI, MAX_CONTENT_LENGTH, MAX_BODY_LENGTH };
export default secureAxios;