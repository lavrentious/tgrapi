import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Address, AddressWithDisplayName } from './schemas/record.schema';

const REVERSE_GEOCODING_URL =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';

@Injectable()
export class GeoService {
  axios: AxiosInstance;
  constructor() {
    this.axios = axios.create({
      headers: { Authorization: `Token ${process.env.DADATA_API_KEY}` },
    });
  }

  async addressByCoords(
    lat: number,
    lon: number,
  ): Promise<AddressWithDisplayName> {
    const {
      data: { suggestions },
    } = await this.axios.post(REVERSE_GEOCODING_URL, {
      lat,
      lon,
      count: 1,
    });
    if (suggestions.length === 0) return null;
    const result = suggestions[0];
    const region = result.data.region_with_type;
    const city = result.data.city_with_type || result.data.settlement_with_type;
    const street = result.data.street_with_type;
    const house = result.data.house_type + ' ' + result.data.house;

    const address = { region, city, street, house };
    return { ...address, displayName: this.getDisplayName(address) };
  }

  getDisplayName(address: Address): string {
    return `${address.region}, ${address.city}, ${address.street}, ${address.house}`;
  }

  getFullAddress(address: Address): AddressWithDisplayName {
    return { ...address, displayName: this.getDisplayName(address) };
  }
}
