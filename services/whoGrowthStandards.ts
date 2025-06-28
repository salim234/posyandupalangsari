import { WhoGrowthStandard } from '../types';

// WHO Weight-for-age Percentiles for Boys (0-24 months)
export const WHO_WEIGHT_FOR_AGE_BOYS: WhoGrowthStandard[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
  { month: 2, p3: 4.4, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
  { month: 3, p3: 5.1, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
  { month: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.7 },
  { month: 5, p3: 6.1, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { month: 12, p3: 7.8, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
  { month: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.5 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.0, p85: 13.3, p97: 14.8 },
];

// WHO Weight-for-age Percentiles for Girls (0-24 months)
export const WHO_WEIGHT_FOR_AGE_GIRLS: WhoGrowthStandard[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
  { month: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
  { month: 3, p3: 4.5, p15: 5.0, p50: 5.8, p85: 6.6, p97: 7.5 },
  { month: 4, p3: 4.9, p15: 5.5, p50: 6.4, p85: 7.3, p97: 8.2 },
  { month: 5, p3: 5.3, p15: 6.0, p50: 6.9, p85: 7.8, p97: 8.8 },
  { month: 6, p3: 5.7, p15: 6.4, p50: 7.3, p85: 8.2, p97: 9.2 },
  { month: 12, p3: 7.0, p15: 7.8, p50: 8.9, p85: 10.1, p97: 11.5 },
  { month: 18, p3: 8.1, p15: 9.1, p50: 10.2, p85: 11.6, p97: 13.2 },
  { month: 24, p3: 9.0, p15: 10.0, p50: 11.2, p85: 12.9, p97: 14.4 },
];
