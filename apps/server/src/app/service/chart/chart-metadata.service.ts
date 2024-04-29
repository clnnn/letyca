import { ChartMetadata } from '@letyca/contracts';

export abstract class ChartMetadataService {
  abstract generate(userRequest: string): Promise<ChartMetadata>;
}
