"use client";
// app/(main)/profile/components/notification-settings.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export function NotificationSettings({ notifications, user }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how you want to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="email-notifications"
              className="flex flex-col space-y-1"
            >
              <span>Email Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive notifications via email
              </span>
            </Label>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="production-updates"
              className="flex flex-col space-y-1"
            >
              <span>Production Updates</span>
              <span className="text-sm text-muted-foreground">
                Get notified about biochar production updates
              </span>
            </Label>
            <Switch id="production-updates" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="system-notifications"
              className="flex flex-col space-y-1"
            >
              <span>System Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive system alerts and updates
              </span>
            </Label>
            <Switch id="system-notifications" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Your latest notifications and updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications?.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell className="capitalize">
                    {notification.type}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {notification.read ? (
                      <span className="text-muted-foreground">Read</span>
                    ) : (
                      <span className="text-blue-500">Unread</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
