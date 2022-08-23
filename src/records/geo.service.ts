import { Injectable } from '@nestjs/common';
import axios from 'axios';

const REVERSE_GEOCODING_URL =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';

@Injectable()
export class GeoService {
  async addressByCoords(lat: number, lon: number) {
    const {
      data: { suggestions },
    } = await axios.post(REVERSE_GEOCODING_URL, {
      lat,
      lon,
      count: 1,
    });
    if (suggestions.length === 0) return null;
    const result = suggestions[0];
    const region = { value: result.region, type: result.region_type_full };
    const city = {
      value: result.city || result.settlement,
      type: result.city_type_full || result.settlement_type_full,
    };
    const displayName = result.value;
    return { displayName, region, city };
  }
}
