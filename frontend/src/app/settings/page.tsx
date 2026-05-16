'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Globe, Shield, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReports: false,
    darkMode: false,
    twoFactor: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
        <p className="text-sm text-gray-500">Configure your application preferences and global settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-600" /> Notifications
            </CardTitle>
            <CardDescription>Control how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-gray-500">Receive real-time alerts on your mobile or desktop.</p>
              </div>
              <Switch checked={settings.notifications} onCheckedChange={(val) => setSettings({...settings, notifications: val})} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Email Reports</Label>
                <p className="text-xs text-gray-500">Get a summary of your fleet's financial performance every Monday.</p>
              </div>
              <Switch checked={settings.emailReports} onCheckedChange={(val) => setSettings({...settings, emailReports: val})} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> General Preferences
            </CardTitle>
            <CardDescription>Localization and appearance settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-xs text-gray-500">Switch between light and dark themes.</p>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={(val) => setSettings({...settings, darkMode: val})} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Currency</Label>
                <p className="text-xs text-gray-500">Base currency for all financial calculations.</p>
              </div>
              <span className="text-sm font-bold text-gray-900">USD ($)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" /> Security & Privacy
            </CardTitle>
            <CardDescription>Manage your account security and data privacy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
              </div>
              <Switch checked={settings.twoFactor} onCheckedChange={(val) => setSettings({...settings, twoFactor: val})} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
