/**
 * Settings Page
 * Users configure their backend connection here
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, TestTube } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [backendUrl, setBackendUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = async () => {
    const user = await getUser();
    if (!user) {
      router.push('/login');
    }
  };

  const loadSettings = () => {
    if (typeof window !== 'undefined') {
      setBackendUrl(localStorage.getItem('backendUrl') || '');
      setApiKey(localStorage.getItem('apiKey') || '');
    }
  };

  const handleSave = () => {
    localStorage.setItem('backendUrl', backendUrl);
    localStorage.setItem('apiKey', apiKey);
    alert('Settings saved successfully!');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${backendUrl}/`, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          success: true,
          message: 'Connection successful!',
          data: data,
        });
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error.message}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/chat')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Backend Settings</CardTitle>
            <CardDescription>
              Configure your AI backend connection. You need to set up your FastAPI
              backend server and provide the connection details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="backendUrl">Backend URL</Label>
              <Input
                id="backendUrl"
                type="url"
                placeholder="http://localhost:8000"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
              />
              <p className="text-sm text-slate-500">
                The URL where your FastAPI backend is running (e.g., http://localhost:8000
                for local development)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="your-secret-api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-slate-500">
                The API key from your backend .env file (X-API-Key header)
              </p>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <p className="font-medium">{testResult.message}</p>
                {testResult.data && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleTest} disabled={testing || !backendUrl || !apiKey}>
                <TestTube className="mr-2 h-4 w-4" />
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!backendUrl || !apiKey}
                variant="default"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>
              <h4 className="font-medium text-slate-800 mb-1">
                1. Start your FastAPI backend
              </h4>
              <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                python main.py
              </code>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">
                2. Get your backend URL
              </h4>
              <p>
                For local development, this is typically{' '}
                <code className="bg-slate-100 px-2 py-1 rounded">
                  http://localhost:8000
                </code>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">
                3. Get your API Key
              </h4>
              <p>
                Find the <code className="bg-slate-100 px-2 py-1 rounded">API_KEY</code>{' '}
                value in your backend's <code className="bg-slate-100 px-2 py-1 rounded">.env</code> file
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">
                4. Test & Save
              </h4>
              <p>
                Use the "Test Connection" button to verify everything works, then save your settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}