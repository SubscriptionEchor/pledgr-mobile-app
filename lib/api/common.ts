import { fetchAPI } from './client';

interface Country {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  emoji: string;
}

interface State {
  id: string;
  name: string;
  state_code: string;
  country_code: string;
}

interface LocationInfo {
  country: Country;
  state: State;
}

interface CountriesResponse {
  data: Country[];
  status: string;
  timestamp: string;
  path: string;
}

interface LocationInfoResponse {
  data: LocationInfo;
  status: string;
  timestamp: string;
  path: string;
}

export const commonAPI = {
  getCountries: () =>
    fetchAPI<CountriesResponse>('/platform/locations/countries', {
      method: 'GET',
      requiresAuth: true,
    }),

  getStates: (countryCode: string) =>
    fetchAPI<any>(`/platform/locations/states?countryCode=${countryCode}`, {
      method: 'GET',
      requiresAuth: true,
    }),

  getLocationInfo: (countryCode: string, stateCode: string) =>
    fetchAPI<LocationInfoResponse>(`/platform/locations/info?countryCode=${countryCode}&stateCode=${stateCode}`, {
      method: 'GET',
      requiresAuth: true,
    }),
};