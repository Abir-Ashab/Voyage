type Activity = {
  day: number;
  title: string;
  description: string;
  place: string;
  proTip: string;
};

type Itinerary = {
  place: string;
  dayNo: number;
  imageDBName: string;
  description: string;
};

export type TripDetail = {
  userId: string;
  requirementsId: string;
  checkedItineraries: Itinerary[];
  suggestedActivities: Activity[];
  details: string;
};
