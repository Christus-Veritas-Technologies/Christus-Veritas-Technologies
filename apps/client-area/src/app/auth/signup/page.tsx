"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phoneNumber: "",
    nationality: "",
    idType: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual sign up
    console.log("Sign up:", formData);
    setIsLoading(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const rightSlideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-premium-purple rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-foreground mb-2">Sign up</h1>
            <p className="text-muted-foreground mb-8">
              Enter your details below to create your account and get started.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="enter..."
                  className="h-12"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="h-12"
                  required
                />
              </motion.div>
            </div>

            {/* Row 2: Date of Birth & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="h-12"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="h-12"
                />
              </motion.div>
            </div>

            {/* Row 3: Nationality & ID Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) => handleSelectChange("nationality", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="ZW">Zimbabwe</SelectItem>
                    <SelectItem value="ZA">South Africa</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="idType">ID Type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => handleSelectChange("idType", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASSPORT">Passport</SelectItem>
                    <SelectItem value="NATIONAL_ID">National ID</SelectItem>
                    <SelectItem value="DRIVERS_LICENSE">Driver&apos;s License</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="enter..."
                  className="h-12"
                  required
                  minLength={8}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="enter..."
                  className="h-12"
                  required
                  minLength={8}
                />
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <Button variant="outline" size="lg" className="flex-1 h-12" asChild>
                <Link href="/auth/signin">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="flex-1 h-12 bg-green-500 hover:bg-green-600"
              >
                {isLoading ? "Creating..." : "Confirm"}
              </Button>
            </motion.div>
          </motion.form>

          {/* Login link */}
          <motion.p variants={itemVariants} className="mt-6 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-premium-purple hover:text-premium-purple-dark font-medium">
              Login
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right side - Image with Stats Card */}
      <motion.div
        variants={rightSlideVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-1 relative bg-linear-to-br from-royal-blue to-premium-purple"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Business team working"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Stats Card - Positioned at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="absolute bottom-8 left-8 right-8"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Join Our Growing Community</h3>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                      className="w-8 h-8 rounded-full bg-linear-to-br from-royal-blue to-premium-purple border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                    >
                      {["JD", "AK", "MR", "SP"][i - 1]}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-muted-foreground text-xs font-medium"
                  >
                    +99
                  </motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-premium-purple">500+</p>
                  <p className="text-muted-foreground text-sm">Customers</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="text-center border-x border-border"
                >
                  <p className="text-2xl font-bold text-royal-blue">10K+</p>
                  <p className="text-muted-foreground text-sm">Users</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-premium-purple">99.9%</p>
                  <p className="text-muted-foreground text-sm">Uptime</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
