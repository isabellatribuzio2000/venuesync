"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  email: string
  user_type: string
  first_name: string
  last_name: string
  company?: string
  created_at: string
}

interface AdminUserManagementProps {
  users?: User[] // Made optional to fix TypeScript error
}

export function AdminUserManagement({ users: initialUsers = [] }: AdminUserManagementProps) {
  // Mock data as fallback when no users are provided
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'sarah.johnson@example.com',
      user_type: 'artist',
      first_name: 'Sarah',
      last_name: 'Johnson',
      company: 'Independent Artist',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      email: 'mike.chen@bluenote.com',
      user_type: 'venue_manager',
      first_name: 'Mike',
      last_name: 'Chen',
      company: 'Blue Note Jazz Club',
      created_at: '2024-02-20T14:15:00Z'
    },
    {
      id: '3',
      email: 'emma.wilson@example.com',
      user_type: 'artist',
      first_name: 'Emma',
      last_name: 'Wilson',
      company: 'The Wilson Band',
      created_at: '2024-03-10T09:45:00Z'
    },
    {
      id: '4',
      email: 'admin@venuesync.live',
      user_type: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      company: 'VenueSync',
      created_at: '2024-01-01T00:00:00Z'
    }
  ]

  // Use provided users or fall back to mock data
  const [users, setUsers] = useState<User[]>(initialUsers.length > 0 ? initialUsers : mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterType === "all" || user.user_type === filterType

    return matchesSearch && matchesFilter
  })

  const updateUserRole = async (userId: string, newRole: string) => {
    setIsLoading(true)
    try {
      if (!supabase) {
        setIsLoading(false)
        return
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({
          user_type: newRole,
          updated_at: new Date(),
        })
        .eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, user_type: newRole } : user)))
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    setIsLoading(true)
    try {
      if (!supabase) {
        setIsLoading(false)
        return
      }
      
      // Note: This requires admin privileges on Supabase
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      setUsers(users.filter((user) => user.id !== userId))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUserTypeBadge = (userType: string) => {
    const variants: { [key: string]: { variant: any; label: string } } = {
      artist: { variant: "secondary", label: "Artist" },
      venue_manager: { variant: "default", label: "Venue Manager" },
      admin: { variant: "destructive", label: "Admin" },
    }

    const config = variants[userType] || { variant: "outline", label: userType }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="artist">Artists</SelectItem>
              <SelectItem value="venue_manager">Venue Managers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
                <TableCell>{user.company || "-"}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <Select
                  value={selectedUser.user_type}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, user_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="venue_manager">Venue Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedUser && updateUserRole(selectedUser.id, selectedUser.user_type)}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUser && deleteUser(selectedUser.id)}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
