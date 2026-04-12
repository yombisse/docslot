import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const COUNTRY_API = 'https://restcountries.com/v3.1/all?fields=name,idd';

export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(COUNTRY_API);

    const list = data.map(c => {
      const root = c.idd?.root || '';
      const suffix = c.idd?.suffixes?.[0] || '';
      return {
        label: `${c.name.common} (${root}${suffix})`,
        value: `${root}${suffix}`,
      };
    }).sort((a, b) => a.label.localeCompare(b.label));

    return { success: true, data: list };
  } catch (err) {
    return handleError(err, { service: 'countryService', method: 'fetchCountries', externalApi: COUNTRY_API });
  }
};

