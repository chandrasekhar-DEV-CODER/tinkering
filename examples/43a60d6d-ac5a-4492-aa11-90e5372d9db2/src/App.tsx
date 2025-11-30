import React, { useState } from 'react';
import { Search, Globe, Calendar, User, Mail, Clock, AlertCircle, Terminal } from 'lucide-react';

interface WhoisData {
  domain: string;
  registrar?: string;
  createdDate?: string;
  expiryDate?: string;
  registrant?: string;
  email?: string;
}

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const apiKey = import.meta.env.VITE_WHOIS_API_KEY;
  if (!apiKey) {
    throw new Error('API密钥未配置');
  }

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
      headers: {
        'apikey': apiKey,
        'Accept': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function retryFetch(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url, { 
        timeout: 8000,
        mode: 'cors'
      });
      
      if (response.ok) return response;
      
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || '未知错误';
      } catch {
        errorMessage = await response.text() || `HTTP错误 ${response.status}`;
      }
      
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API密钥未配置')) {
          throw error;
        }
        if (i === retries - 1) {
          throw error;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('多次重试后请求仍然失败');
}

function App() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    setError('');
    setWhoisData(null);
    
    try {
      if (!import.meta.env.VITE_WHOIS_API_KEY) {
        throw new Error('请先在.env文件中配置VITE_WHOIS_API_KEY');
      }

      const apiUrl = `https://api.apilayer.com/whois/query?domain=${encodeURIComponent(domain)}`;
      const response = await retryFetch(apiUrl);
      const result = await response.json();

      if (!result || result.error) {
        throw new Error(result?.error || '无法获取域名信息');
      }

      const formatDate = (dateStr: string) => {
        if (!dateStr) return '未知';
        try {
          return new Date(dateStr).toLocaleDateString('zh-CN');
        } catch {
          return dateStr;
        }
      };

      // APILayer WHOIS API 返回的数据结构处理
      const registrarInfo = result.result?.registrar_name || result.result?.registrar || '未知';
      const createdDate = result.result?.created_date || result.result?.creation_date || '未知';
      const expiryDate = result.result?.expiry_date || result.result?.registry_expiry_date || '未知';
      const registrantInfo = result.result?.registrant_organization || result.result?.registrant || '未知';
      const emailInfo = result.result?.admin_email || result.result?.registrant_email || '未知';

      setWhoisData({
        domain: domain,
        registrar: registrarInfo,
        createdDate: formatDate(createdDate),
        expiryDate: formatDate(expiryDate),
        registrant: registrantInfo,
        email: emailInfo
      });
    } catch (err) {
      let errorMessage = '获取WHOIS数据失败，请重试';
      
      if (err instanceof Error) {
        if (!navigator.onLine) {
          errorMessage = '网络连接失败，请检查网络设置';
        } else if (err.message.includes('API密钥')) {
          errorMessage = err.message;
        } else if (err.message.includes('404')) {
          errorMessage = '找不到该域名的注册信息';
        } else if (err.message.includes('429')) {
          errorMessage = '请求过于频繁，请稍后再试';
        } else if (err.message.includes('500')) {
          errorMessage = '服务器错误，请稍后再试';
        } else if (err.message.includes('timeout') || err.message.includes('abort')) {
          errorMessage = '请求超时，请重试';
        } else {
          errorMessage = `查询失败: ${err.message}`;
        }
        
        console.error('WHOIS查询错误:', {
          message: err.message,
          domain: domain,
          timestamp: new Date().toISOString(),
          type: err.name || 'UnknownError'
        });
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValidDomain = (domain: string) => {
    const pattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return pattern.test(domain);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center mb-4">
            <Terminal className="w-16 h-16 text-green-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 animate-text">
            域名扫描系统
          </h1>
          <p className="text-cyan-400 font-mono">// 域名情报分析系统 v1.0</p>
        </div>

        <div className="bg-gray-900 rounded-lg border border-green-400/30 shadow-[0_0_15px_rgba(74,222,128,0.1)] backdrop-blur-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value.toLowerCase())}
                  placeholder="输入目标域名..."
                  className="w-full px-4 py-3 rounded-lg bg-black border border-green-400/50 text-green-400 placeholder-green-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 pl-10 font-mono"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-green-400" />
              </div>
              {domain && !isValidDomain(domain) && (
                <p className="text-red-400 text-sm mt-1">请输入有效的域名格式 (例如: example.com)</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !domain || !isValidDomain(domain)}
              className="px-6 py-3 bg-green-400/10 text-green-400 border border-green-400/50 rounded-lg hover:bg-green-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed font-mono transition-all duration-200 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              {loading ? '>> 扫描中...' : '>> 开始扫描'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 font-mono">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-400">[错误] {error}</p>
            </div>
          </div>
        )}

        {whoisData && (
          <div className="bg-gray-900 rounded-lg border border-green-400/30 shadow-[0_0_15px_rgba(74,222,128,0.1)] backdrop-blur-sm p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 font-mono text-cyan-400">// 目标信息</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <Globe className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">域名</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.domain}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <User className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">注册商</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.registrar}</p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <Calendar className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">创建日期</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.createdDate}</p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <Clock className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">到期日期</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.expiryDate}</p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <User className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">注册人</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.registrant}</p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-green-400/5 transition-colors">
                <Mail className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-mono">邮箱</p>
                  <p className="font-medium text-green-400 font-mono">{whoisData.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;