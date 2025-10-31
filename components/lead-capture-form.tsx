
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, User, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LeadCaptureFormProps {
  onSubmit: (data: { firstName: string; email: string }) => void
  onClose: () => void
}

export function LeadCaptureForm({ onSubmit, onClose }: LeadCaptureFormProps) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { firstName?: string; email?: string } = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Submit lead data
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim()
        })
      })
      
      // Pass data to parent
      onSubmit({
        firstName: firstName.trim(),
        email: email.trim()
      })
    } catch (error) {
      console.error('Failed to submit lead:', error)
      setErrors({ email: 'Something went wrong. Please try again.' })
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Let's Get Started!</h2>
          <p className="text-slate-400 text-sm">
            We just need a couple of details to connect you with the right person
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className="text-slate-300 mb-2 block">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  if (errors.firstName) setErrors({ ...errors, firstName: undefined })
                }}
                placeholder="John"
                className={`pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-slate-300 mb-2 block">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                placeholder="john@example.com"
                className={`pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg"
          >
            {isSubmitting ? 'Starting...' : 'Start Chat'}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-slate-500 text-center">
            We respect your privacy. Your information is secure and will never be shared.
          </p>
        </form>
      </motion.div>
    </motion.div>
  )
}
