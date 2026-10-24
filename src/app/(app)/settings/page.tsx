"use client";

import { useState } from "react";
import { User, Bell, CreditCard, Key, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifyExtractionComplete, setNotifyExtractionComplete] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            Profile
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
          </div>
          <Button variant="outline" size="sm">Save Profile</Button>
        </div>

        {/* Subscription */}
        <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Subscription
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">Free Plan</span>
                <Badge variant="outline" className="text-[10px]">Current</Badge>
              </div>
              <p className="text-xs text-white/40">10 extractions/day · 5 platforms · Basic AI</p>
            </div>
            <Button variant="gradient" size="sm">Upgrade to Pro</Button>
          </div>
          <div className="text-xs text-white/30">
            Usage this month: <span className="text-white/60">47 extractions</span> · Billing resets on May 1st
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            Notifications
          </h3>
          <div className="space-y-4">
            {[
              { label: "Extraction complete", description: "Notify when your frames are ready", value: notifyExtractionComplete, set: setNotifyExtractionComplete },
              { label: "Weekly digest", description: "Summary of your extractions and top frames", value: notifyWeeklyDigest, set: setNotifyWeeklyDigest },
            ].map(({ label, description, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-white/40">{description}</p>
                </div>
                <Switch checked={value} onCheckedChange={set} />
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Key className="w-4 h-4 text-green-400" />
            API Keys
            <Badge variant="info" className="text-[10px] ml-1">Pro+</Badge>
          </h3>
          <p className="text-sm text-white/40 mb-4">
            Generate API keys to integrate FrameFlow into your own tools.
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Key className="w-3.5 h-3.5" />
            Generate API Key
          </Button>
        </div>

        {/* Security */}
        <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Security
          </h3>
          <Button variant="outline" size="sm" className="mb-3">Change Password</Button>
          <p className="text-xs text-white/30">Last signed in: Today at 9:14 AM · Kenya</p>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
          <h3 className="text-base font-semibold text-red-400 mb-3 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h3>
          <p className="text-sm text-white/40 mb-4">
            Deleting your account is permanent and will remove all your frames, brand kits, and extraction history.
          </p>
          <Button variant="destructive" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
