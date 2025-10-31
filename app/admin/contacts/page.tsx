
'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Users,
  UserCheck,
  UserPlus,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

type Contact = {
  id: string
  firstName: string
  email: string
  source: string
  status: string
  notes: string | null
  createdAt: string
  conversations: Array<{
    id: string
    createdAt: string
    status: string
  }>
}

type Stats = {
  total: number
  new: number
  contacted: number
  qualified: number
  converted: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts')
      const data = await response.json()
      setContacts(data.contacts || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      toast.success('Contact status updated')
      fetchContacts()
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'contacted': return 'bg-purple-500'
      case 'qualified': return 'bg-green-500'
      case 'converted': return 'bg-yellow-500'
      case 'lost': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Chatbot Contacts</h1>
          <p className="text-gray-400">All leads captured through the chatbot</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <div className="text-2xl font-bold text-white">{stats.total}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-500" />
                <div className="text-2xl font-bold text-purple-500">{stats.contacted}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Qualified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-bold text-green-500">{stats.qualified}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Converted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-500">{stats.converted}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <Card className="bg-gray-900 border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Conversations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{contact.firstName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-400">{contact.conversations.length}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {contact.status === 'new' && (
                            <Button
                              size="sm"
                              onClick={() => updateContactStatus(contact.id, 'contacted')}
                              className="text-xs bg-purple-600 hover:bg-purple-700"
                            >
                              Mark Contacted
                            </Button>
                          )}
                          {contact.status === 'contacted' && (
                            <Button
                              size="sm"
                              onClick={() => updateContactStatus(contact.id, 'qualified')}
                              className="text-xs bg-green-600 hover:bg-green-700"
                            >
                              Qualify
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
