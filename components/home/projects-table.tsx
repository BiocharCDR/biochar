"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types";
import MoneyIcon from "../icons/MoneyIcon";
import VerifiedIcon from "../icons/VerifiedIcon";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="px-2">
        <Table>
          <TableHeader className=" ">
            <TableRow className="dark:border-zinc-50/10">
              <TableHead className="h-12">Project List</TableHead>
              <TableHead className="h-12">Consultant</TableHead>
              <TableHead className="h-12">Client</TableHead>
              <TableHead className="h-12 hidden md:table-cell">
                Contract Value
              </TableHead>
              <TableHead className="h-12 hidden md:table-cell">
                Certification Target
              </TableHead>
              <TableHead className="h-12 hidden md:table-cell">
                Project Stage
              </TableHead>
              <TableHead className="h-12">% Documentation Done</TableHead>
              <TableHead className="h-12 hidden md:table-cell">
                Red Flag
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
                className={`h-16 hover:bg-muted/50 ${
                  index === projects.length - 1 ? "" : "border-none"
                }`}
              >
                <TableCell className="py-4 font-medium">
                  {project.name}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={project.consultant.avatar} />
                      <AvatarFallback className="dark:bg-secondary-foreground/80 dark:text-secondary">
                        {project.consultant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-medium">
                      {project.consultant.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={project.client.avatar} />
                      <AvatarFallback className="dark:bg-secondary-foreground/80 dark:text-secondary">
                        {project.client.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-medium">
                      {project.client.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell font-medium ">
                  <div className=" flex gap-2">
                    <MoneyIcon />
                    {project.contractValue}
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell">
                  <div className=" flex gap-2">
                    <VerifiedIcon />
                    {project.certificationTarget}
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell">
                  <Badge variant="default" className="font-semibold">
                    Stage {project.stage}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="w-10 text-sm font-medium">
                      {project.progress}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell">
                  <Badge
                    variant={
                      project.flag === "Red Flag" ? "destructive" : "ghost"
                    }
                    className="font-medium"
                  >
                    {project.flag}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
