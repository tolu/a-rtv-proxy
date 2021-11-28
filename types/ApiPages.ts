
export type PageList = PageMeta[];

interface PageMeta {
  id: string;
  name: string;
  slug: string;
  link: string;
}

export interface Page {
  id:             string;
  slug:           string;
  title:          string;
  lastUpdatedUTC: Date;
  swimlanes:      SwimlaneMeta[];
  inSubscription: boolean;
}

export interface SwimlaneMeta {
  id:             string;
  name:           string;
  type:           SwimlaneType;
  style:          string;
  link:           string;
  supportsPaging: boolean;
  lastUpdatedUTC: Date;
}

export type SwimlaneType = "Default" | "Menu" | "OnTvNow";
