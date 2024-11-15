import { Suspense } from "react";

// import { getProjects } from "@/lib/projects"; // You'll need to create this

import { ProjectHeader } from "@/components/home/projects-header";
import { ProjectsTable } from "@/components/home/projects-table";
import { ProjectTableSkeleton } from "@/components/home/projects-table-skeleton";
import { Project } from "@/types";

const projects: Project[] = [
  {
    id: "1",
    name: "Project Name",
    consultant: {
      name: "Johnson",
      avatar: "/avatars/johnson.png",
    },
    client: {
      name: "Monica",
      avatar: "/avatars/monica.png",
    },
    contractValue: "$500K",
    certificationTarget: "Certificate name",
    stage: 2,
    progress: 35,
    flag: "No Flag",
  },
  {
    id: "2",
    name: "Project Name",
    consultant: {
      name: "David",
      avatar: "/avatars/david.png",
    },
    client: {
      name: "Jonathan",
      avatar: "/avatars/jonathan.png",
    },
    contractValue: "$500K",
    certificationTarget: "Certificate name",
    stage: 2,
    progress: 80,
    flag: "No Flag",
  },
  {
    id: "3",
    name: "Project Name",
    consultant: {
      name: "Samantha",
      avatar: "/avatars/samantha.png",
    },
    client: {
      name: "Williamson",
      avatar: "/avatars/williamson.png",
    },
    contractValue: "$500K",
    certificationTarget: "Certificate name",
    stage: 2,
    progress: 10,
    flag: "No Flag",
  },
];
export default async function HomePage() {
  // Fetch projects from your database
  // const projects = await getProjects();

  return (
    <div className="space-y-4 p-4">
      <ProjectHeader
      // onSearch={(value) => {
      //   // Handle search - this will need to be moved to a client component
      //   // or handled through server actions
      // }}
      // onFilter={() => {
      //   // Handle filter
      // }}
      // onCreateProject={() => {
      //   // Handle create project
      // }}
      />

      <Suspense fallback={<ProjectTableSkeleton />}>
        <ProjectsTable projects={projects} />
      </Suspense>
    </div>
  );
}
