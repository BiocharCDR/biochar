/*eslint-disable*/

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";

interface RecentActivitiesProps {
  activities: Array<{
    id: string;
    activity_type: string;
    description: string;
    created_at: string;
    metadata?: any;
  }>;
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent activities
            </p>
          ) : (
            activities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="relative flex h-2 w-2 mt-2">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
