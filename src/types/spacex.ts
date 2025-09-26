// SpaceX API Types
export interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  date_local: string;
  date_unix: number;
  date_precision: string;
  success: boolean | null;
  upcoming: boolean;
  rocket: string;
  crew: string[];
  ships: string[];
  payloads: string[];
  capsules: string[];
  launchpad: string;
  auto_update: boolean;
  flight_number: number;
  details: string | null;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  net: boolean;
  window: number;
  tdb: boolean;
  fairings: {
    reused: boolean | null;
    recovery_attempt: boolean | null;
    recovered: boolean | null;
    ships: string[];
  } | null;
  cores: Array<{
    core: string | null;
    flight: number | null;
    gridfins: boolean | null;
    legs: boolean | null;
    reused: boolean | null;
    landing_attempt: boolean | null;
    landing_success: boolean | null;
    landing_type: string | null;
    landpad: string | null;
  }>;
  failures: Array<{
    time: number;
    altitude: number | null;
    reason: string;
  }>;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
}

export interface SpaceXRocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  wikipedia: string;
  description: string;
}