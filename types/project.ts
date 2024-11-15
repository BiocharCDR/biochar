// types/project.ts

export const CERTIFICATION_TYPES = [
  "Green Mark 2021 - New Non Residential Building",
  "Green Mark 2021 - Existing Non Residential Building",
  "Green Mark 2021 - New Residential Building",
  "Green Mark 2021 - Existing Residential Building",
  "Green Mark 2021: In Operation",
  "Green Mark Healthier Workplace",
  "Green Mark Data Center 2024",
  "Green Mark Data Center 2024: In Operation",
  "LEED O+M Existing Buildings v4",
  "LEED O+M Interiors v4",
  "LEED BD+C v4",
  "LEED ID+C v4",
  "LEED O+M Existing Buildings v4.1",
  "LEED O+M Interiors v4.1",
  "LEED BD+C v4.1",
  "LEED ID+C v4.1",
  "LEED Residential",
] as const;

export type CertificationType = (typeof CERTIFICATION_TYPES)[number];
export type Currency = "SGD" | "MYR" | "IDR" | "USD";
export type FloorAreaUnit = "sqm" | "sqft";

export interface CertificationConfig {
  buildingTypes: string[];
  targetLevels: string[];
}

export interface ProjectFormData {
  projectName: string;
  client: string;
  certification: CertificationType;
  buildingType: string;
  floorArea: number;
  floorAreaUnit: FloorAreaUnit;
  targetLevel: string;
  contractValue: number;
  currency: Currency;
  documents?: FileList;
}

export const CERTIFICATION_DATA: Record<
  CertificationType,
  CertificationConfig
> = {
  "Green Mark 2021 - New Non Residential Building": {
    buildingTypes: [
      "Office Buildings",
      "Retail Mall",
      "Hotel",
      "MOE Primary and Secondary Schools",
      "MOE Junior Colleges",
      "Private Schools and Colleges",
      "Institute of Higher Learning",
      "Hospitals",
      "Polyclinics",
      "Nursing and Youth Homes",
      "Industrial – High Technology",
      "Light Industrial",
      "Warehouses, Workshops/Logistics/Other Industrial buildings",
      "Community Buildings",
      "Civic Buildings",
      "Cultural Institutions",
      "Sports and Recreation Centres",
      "Religious / Places of Worship",
      "Worker's Dormitories",
      "Other Non-Residential Building Types",
    ],
    targetLevels: [
      "Gold Plus",
      "Platinum",
      "Gold Plus SLE",
      "Platinum SLE",
      "SLE",
    ],
  },
  "Green Mark 2021 - Existing Non Residential Building": {
    buildingTypes: [
      "Office Buildings",
      "Retail Mall",
      "Hotel",
      "MOE Primary and Secondary Schools",
      "MOE Junior Colleges",
      "Private Schools and Colleges",
      "Institute of Higher Learning",
      "Hospitals",
      "Polyclinics",
      "Nursing and Youth Homes",
      "Industrial – High Technology",
      "Light Industrial",
      "Warehouses, Workshops/Logistics/Other Industrial buildings",
      "Community Buildings",
      "Civic Buildings",
      "Cultural Institutions",
      "Sports and Recreation Centres",
      "Religious / Places of Worship",
      "Worker's Dormitories",
      "Other Non-Residential Building Types",
    ],
    targetLevels: [
      "Gold Plus",
      "Platinum",
      "Gold Plus SLE",
      "Platinum SLE",
      "SLE",
    ],
  },
  "Green Mark 2021 - New Residential Building": {
    buildingTypes: ["NA"],
    targetLevels: [
      "Gold Plus",
      "Platinum",
      "Gold Plus SLE",
      "Platinum SLE",
      "SLE",
    ],
  },
  "Green Mark 2021 - Existing Residential Building": {
    buildingTypes: ["NA"],
    targetLevels: [
      "Gold Plus",
      "Platinum",
      "Gold Plus SLE",
      "Platinum SLE",
      "SLE",
    ],
  },
  "Green Mark 2021: In Operation": {
    buildingTypes: [
      "Office Buildings",
      "Retail Mall",
      "Hotel",
      "MOE Primary and Secondary Schools",
      "MOE Junior Colleges",
      "Private Schools and Colleges",
      "Institute of Higher Learning",
      "Hospitals",
      "Polyclinics",
      "Nursing and Youth Homes",
      "Industrial – High Technology",
      "Light Industrial",
      "Warehouses, Workshops/Logistics/Other Industrial buildings",
      "Community Buildings",
      "Civic Buildings",
      "Cultural Institutions",
      "Sports and Recreation Centres",
      "Religious / Places of Worship",
      "Worker's Dormitories",
      "Other Non-Residential Building Types",
    ],
    targetLevels: [
      "Gold Plus",
      "Platinum",
      "Gold Plus SLE",
      "Platinum SLE",
      "SLE",
    ],
  },
  "Green Mark Healthier Workplace": {
    buildingTypes: ["NA"],
    targetLevels: ["Certified", "Gold", "Gold Plus", "Platinum"],
  },
  "Green Mark Data Center 2024": {
    buildingTypes: ["NA"],
    targetLevels: ["Gold Plus", "Platinum", "Gold Plus SLE", "Platinum SLE"],
  },
  "Green Mark Data Center 2024: In Operation": {
    buildingTypes: ["NA"],
    targetLevels: ["Gold Plus", "Platinum", "Gold Plus SLE", "Platinum SLE"],
  },
  "LEED O+M Existing Buildings v4": {
    buildingTypes: [
      "Office",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED O+M Interiors v4": {
    buildingTypes: [
      "Office",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED BD+C v4": {
    buildingTypes: [
      "New Construction",
      "Core and Shell",
      "Schools",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED ID+C v4": {
    buildingTypes: [
      "New Construction",
      "Core and Shell",
      "Schools",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED O+M Existing Buildings v4.1": {
    buildingTypes: [
      "Office",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED O+M Interiors v4.1": {
    buildingTypes: [
      "Office",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED BD+C v4.1": {
    buildingTypes: [
      "New Construction",
      "Core and Shell",
      "Schools",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED ID+C v4.1": {
    buildingTypes: [
      "New Construction",
      "Core and Shell",
      "Schools",
      "Retail",
      "Data Centers",
      "Warehouse and Distribution Center",
      "Hospitality",
      "Healthcare",
    ],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
  "LEED Residential": {
    buildingTypes: ["Single Family", "Multi Family"],
    targetLevels: ["Certified", "Silver", "Gold", "Platinum"],
  },
} as const;

export function getBuildingTypes(certification: CertificationType): string[] {
  return [...(CERTIFICATION_DATA[certification]?.buildingTypes ?? [])];
}

export function getTargetLevels(certification: CertificationType): string[] {
  return [...(CERTIFICATION_DATA[certification]?.targetLevels ?? [])];
}

export function isBuildingTypeAvailable(
  certification: CertificationType,
  buildingType: string
): boolean {
  return (
    CERTIFICATION_DATA[certification]?.buildingTypes.includes(buildingType) ??
    false
  );
}

export function isTargetLevelAvailable(
  certification: CertificationType,
  targetLevel: string
): boolean {
  return (
    CERTIFICATION_DATA[certification]?.targetLevels.includes(targetLevel) ??
    false
  );
}

// Project Status Types
export const PROJECT_STATUSES = [
  "Active",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// Project Database Schema Type
export interface Project extends ProjectFormData {
  id: string;
  status: ProjectStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  consultantId: string;
  clientId: string;
  documentUrls: string[];
}

// Certification specific target level type
export type CertificationTargetLevel<T extends CertificationType> =
  (typeof CERTIFICATION_DATA)[T]["targetLevels"][number];

// Type guard for certification type
export function isCertificationType(value: string): value is CertificationType {
  return CERTIFICATION_TYPES.includes(value as CertificationType);
}

// Validation helper
export function validateProjectForm(data: Partial<ProjectFormData>): string[] {
  const errors: string[] = [];

  if (!data.certification) {
    errors.push("Certification is required");
  } else if (isCertificationType(data.certification)) {
    if (
      data.buildingType &&
      !isBuildingTypeAvailable(data.certification, data.buildingType)
    ) {
      errors.push("Invalid building type for selected certification");
    }
    if (
      data.targetLevel &&
      !isTargetLevelAvailable(data.certification, data.targetLevel)
    ) {
      errors.push("Invalid target level for selected certification");
    }
  }

  return errors;
}
