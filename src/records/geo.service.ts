import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EnvironmentVariables } from 'src/env.validation';
import { Address, AddressWithDisplayName } from './schemas/record.schema';

const REVERSE_GEOCODING_URL =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';

@Injectable()
export class GeoService {
  axios: AxiosInstance;
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.axios = axios.create({
      headers: {
        Authorization: `Token ${this.configService.get('DADATA_API_KEY')}`,
      },
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
    if (suggestions.length === 0) return {};
    const result = suggestions[0];
    const region = result.data.region_with_type;
    const city = result.data.city_with_type || result.data.settlement_with_type;
    const street = result.data.street_with_type;
    const house =
      result.data.house_type && result.data.house
        ? result.data.house_type + ' ' + result.data.house
        : null;

    const address = { region, city, street, house };
    return { ...address, displayName: this.getDisplayName(address) };
  }

  getDisplayName(address: Address): string | null {
    return (
      [address.region, address.city, address.street, address.house]
        .filter((e) => e != null)
        .join(', ') || null
    );
  }

  getFullAddress(address: Address): AddressWithDisplayName {
    return { ...address, displayName: this.getDisplayName(address) };
  }

  /**
   * @returns distance in meters between 2 points
   */
  haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * 1000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  /**
   * @returns azimuth between 2 points
   */
  azimuth(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const r = Math.atan2(lng2 - lng1, lat2 - lat1) / 0.017453292519943295;
    return r >= 0 ? r : r + 360;
  }
  /**
   * @returns lowercase direction from first to second point
   */
  getDirection(azimuth: number): string {
    let i = Math.floor(azimuth / 45);
    if (azimuth % 45 >= 27.5) i += 1;
    return [
      'север',
      'северо-восток',
      'восток',
      'юго-восток',
      'юг',
      'юго-запад',
      'запад',
      'северо-запад',
    ][i % 8];
  }
}
