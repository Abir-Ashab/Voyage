export type Location = {
  cityName: string;
  latitude: number;
  longitude: number;
};

export type Requirement = {
  userId: string;
  boardingPoint: Location;
  destination: Location;
  company: string;
  ageConcern: string[];
  sinceWhen: Date;
  tillWhen: Date;
  budgetType: string;
  preferredActivities: string[];
};

