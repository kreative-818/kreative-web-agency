
"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { 
  Users, Phone, Mail, Calendar, DollarSign, 
  TrendingUp, Clock, ArrowRight, Star, Target,
  CheckCircle2, AlertCircle, MessageSquare
} from "lucide-react"

type PipelineStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"

type Lead = {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  stage: PipelineStage
  score: number
  value?: number
  source: string
  createdAt: string
  lastContact?: string
  notes?: string
}

const stageConfig = {
  new: { 
    title: "New Leads", 
    color: "bg-blue-500", 
    textColor: "text-blue-400",
    bgColor: "bg-blue-950/50 dark:bg-blue-950/30 border-blue-500/20",
    icon: Users 
  },
  contacted: { 
    title: "Contacted", 
    color: "bg-purple-500", 
    textColor: "text-purple-400",
    bgColor: "bg-purple-950/50 dark:bg-purple-950/30 border-purple-500/20",
    icon: Phone 
  },
  qualified: { 
    title: "Qualified", 
    color: "bg-orange-500", 
    textColor: "text-orange-400",
    bgColor: "bg-orange-950/50 dark:bg-orange-950/30 border-orange-500/20",
    icon: Target 
  },
  proposal: { 
    title: "Proposal Sent", 
    color: "bg-indigo-500", 
    textColor: "text-indigo-400",
    bgColor: "bg-indigo-950/50 dark:bg-indigo-950/30 border-indigo-500/20",
    icon: Mail 
  },
  won: { 
    title: "Won", 
    color: "bg-green-500", 
    textColor: "text-green-400",
    bgColor: "bg-green-950/50 dark:bg-green-950/30 border-green-500/20",
    icon: CheckCircle2 
  },
  lost: { 
    title: "Lost", 
    color: "bg-gray-500", 
    textColor: "text-gray-400",
    bgColor: "bg-gray-950/50 dark:bg-gray-950/30 border-gray-500/20",
    icon: AlertCircle 
  }
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStage = async (leadId: number, newStage: PipelineStage) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      })

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, stage: newStage } : lead
        ))
        toast.success(`Lead moved to ${stageConfig[newStage].title}`)
      }
    } catch (error) {
      toast.error('Failed to update lead')
    }
  }

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (stage: PipelineStage) => {
    if (draggedLead && draggedLead.stage !== stage) {
      updateLeadStage(draggedLead.id, stage)
    }
    setDraggedLead(null)
  }

  const getLeadsByStage = (stage: PipelineStage) => {
    return leads.filter(lead => lead.stage === stage)
  }

  const calculateStageValue = (stage: PipelineStage) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + (lead.value || 0), 0)
  }

  const totalPipelineValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)

  const conversionRate = leads.length > 0 
    ? ((getLeadsByStage('won').length / leads.length) * 100).toFixed(1)
    : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Sales Pipeline</h1>
          <p className="text-gray-600">
            Visual customer journey with drag-and-drop stage management
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                Active in pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalPipelineValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total potential revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Leads to customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getLeadsByStage('won').length}</div>
              <p className="text-xs text-muted-foreground">
                ${calculateStageValue('won').toLocaleString()} closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.keys(stageConfig) as PipelineStage[]).map(stage => {
            const config = stageConfig[stage]
            const stageLeads = getLeadsByStage(stage)
            const stageValue = calculateStageValue(stage)
            const Icon = config.icon

            return (
              <div
                key={stage}
                className="space-y-3"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage)}
              >
                {/* Stage Header */}
                <Card className={`${config.bgColor} border-2`}>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-8 h-8 rounded ${config.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{config.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {stageLeads.length} leads
                        </CardDescription>
                      </div>
                    </div>
                    {stageValue > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        ${stageValue.toLocaleString()}
                      </Badge>
                    )}
                  </CardHeader>
                </Card>

                {/* Lead Cards */}
                <div className="space-y-2 min-h-[400px]">
                  {stageLeads.map(lead => (
                    <Card
                      key={lead.id}
                      className="cursor-move hover:shadow-lg transition-all"
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-semibold truncate">
                              {lead.name}
                            </CardTitle>
                            {lead.company && (
                              <CardDescription className="text-xs truncate">
                                {lead.company}
                              </CardDescription>
                            )}
                          </div>
                          {lead.score > 70 && (
                            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>

                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                          
                          {lead.value && (
                            <Badge variant="outline" className="text-xs">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {lead.value.toLocaleString()}
                            </Badge>
                          )}

                          <div className="flex items-center justify-between text-xs pt-2 border-t">
                            <span className="text-gray-500">
                              Score: {lead.score}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {lead.source}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-2"
                          onClick={() => window.location.href = `/admin/leads`}
                        >
                          View Details
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              How to Use This Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Drag & Drop:</strong> Click and drag lead cards between stages to update their status</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Auto-Updates:</strong> Leads automatically appear here when they submit forms, call, or text</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Real-Time:</strong> Pipeline refreshes every 30 seconds to show latest data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">High-Value Leads:</strong> Look for ⭐ stars on cards - these are priority leads with scores over 70</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
