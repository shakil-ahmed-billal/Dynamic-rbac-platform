"use client";

import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Globe,
  LifeBuoy,
  FileText,
  CreditCard,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { RBACGuard } from "@/components/auth/RBACGuard";

const CustomerPortalPage = () => {
  const { user } = useAuth();

  const services = [
    {
      title: "Knowledge Base",
      description: "Find answers and learn how to use the platform.",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Support Tickets",
      description: "Get help from our technical assistance team.",
      icon: LifeBuoy,
      color: "purple",
    },
    {
      title: "Billing & Plans",
      description: "Manage your subscription and view invoices.",
      icon: CreditCard,
      color: "green",
    },
    {
      title: "Account Security",
      description: "Update your login credentials and MFA settings.",
      icon: ShieldCheck,
      color: "orange",
    },
  ];

  return (
    <RBACGuard requiredModule="portal" requiredAction="READ">
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-brand-primary/10 to-transparent p-10 rounded-[32px] border border-brand-primary/10 relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl font-bold font-onest text-[#1F232A]">
                Hello, {user?.name || "Customer"}!
              </h1>
              <p className="text-[#666C79] font-inter mt-2 max-w-lg">
                Welcome to your client portal. Here you can manage your services, view reports, and get support whenever you need it.
              </p>
              <Button className="mt-8 bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 px-6 group">
                View My Projects <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
           <Globe className="absolute -right-20 -bottom-20 h-80 w-80 text-brand-primary/5 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <Card key={i} className="rounded-[24px] border-gray-100 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110",
                  service.color === "blue" ? "bg-blue-50 text-blue-600" :
                  service.color === "purple" ? "bg-purple-50 text-purple-600" :
                  service.color === "green" ? "bg-green-50 text-green-600" :
                  "bg-orange-50 text-orange-600"
                )}>
                  <service.icon size={24} />
                </div>
                <CardTitle className="font-onest text-lg">{service.title}</CardTitle>
                <CardDescription className="font-inter text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0px_8px_24px_rgba(149,157,165,0.05)]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-onest text-[#1F232A]">Active Services</h3>
              <Button variant="link" className="text-brand-primary">See All</Button>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                       <Settings className="text-brand-primary" size={24} />
                    </div>
                    <div>
                       <p className="font-semibold text-[#1F232A]">Premium RBAC Suite</p>
                       <p className="text-xs text-[#9BA0AB]">Subscription active until Dec 2026</p>
                    </div>
                 </div>
                 <Badge variant="outline" className="bg-green-50 text-green-600 border-none px-4 py-1.5 rounded-lg font-medium">
                    Healthy
                 </Badge>
              </div>
           </div>
        </div>
      </div>
    </RBACGuard>
  );
};

export default CustomerPortalPage;

