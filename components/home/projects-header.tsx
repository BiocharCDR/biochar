"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ListFilter, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { CreateProjectDialog } from "./create-project-dialog";

interface ProjectHeaderProps {
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  onCreateProject?: () => void;
}

export function ProjectHeader({
  onSearch,
  onFilter,
  onCreateProject,
}: ProjectHeaderProps) {
  return (
    <div className=" flex justify-between">
      <div className="flex justify-between  pb-4 flex-col">
        <h1 className="text-xl font-semibold">Project Management</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of your projects and client here.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              // onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <ListFilter />
              Filters
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Stage</SelectItem>
              <SelectItem value="dark">Client</SelectItem>
              <SelectItem value="system">Flag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateProjectDialog />
      </div>
    </div>
  );
}
