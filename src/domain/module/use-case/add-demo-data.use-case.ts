import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type {
  TRequestAddDemoData,
  TResponseAddDemoData,
} from '@/domain/module/use-case-schema/add-demo-data.use-case-schema';

export class AddDemoDataUseCase extends BaseUseCase<
  TRequestAddDemoData,
  TResponseAddDemoData
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      carerAdapter: ICarerPort;
      moduleAdapter: IModulePort;
      moduleFieldAdapter: IModuleFieldPort;
      recordAdapter: IRecordPort;
      recordFieldAdapter: IRecordFieldPort;
    }
  ) {
    super('add-demo-data', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestAddDemoData
  ): Promise<IBaseResponse<TResponseAddDemoData>> {
    // Get primary carer
    const carers = await this.adapters.carerAdapter.getAll();
    const primaryCarer = carers.find((c) => c.isPrimary) || carers[0];
    if (!primaryCarer) {
      return {
        success: false,
        message: 'error.no-carer-found',
      };
    }

    // Get active modules
    const modules = await this.adapters.moduleAdapter.getAll();
    const activeModules = modules.filter((m) => m.isActive);

    for (const module of activeModules) {
      await this.createDemoRecordsForModule(module, primaryCarer.id);
    }

    return {
      success: true,
      message: 'common.success',
      details: {},
    };
  }

  private async createDemoRecordsForModule(
    module: TModule,
    carerID: number
  ): Promise<void> {
    // Get fields for module
    const fields = await this.adapters.moduleFieldAdapter.getAllByModuleId(
      module.id
    );

    // Days in each month (for 2025, non-leap year)
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Create records for each month, each day, 5-9 records per day
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = daysInMonths[month - 1];
      for (let day = 1; day <= daysInMonth; day++) {
        const numRecords = Math.floor(Math.random() * 5) + 5; // 5 to 9
        for (let i = 0; i < numRecords; i++) {
          const recordData = `Demo record for ${module.name} - ${month}/${day} - ${i + 1}`;
          const synced = false;

          const fieldList = fields.map((field) => ({
            fieldID: field.id,
            value: this.generateDemoValue(field),
          }));

          // Generate random hour and minute for the day
          const hour = Math.floor(Math.random() * 24);
          const minute = Math.floor(Math.random() * 60);
          const createdAt = new Date(2025, month - 1, day, hour, minute);

          const recordCreate: TRecordCreate = {
            moduleID: module.id,
            carerID,
            data: recordData,
            synced,
            fieldList,
            createdAt,
          };

          await this.adapters.recordAdapter.create(recordCreate);
        }
      }
    }
  }

  private generateDemoValue(field: TModuleField): string {
    if (field.type === 'TEXT') {
      return `Demo text for ${field.title}`;
    } else if (field.type === 'SELECT') {
      // Parse the JSON values
      try {
        const values = JSON.parse(field.values) as string[];
        return values[Math.floor(Math.random() * values.length)];
      } catch {
        return 'Demo select value';
      }
    }
    return 'Demo value';
  }
}
