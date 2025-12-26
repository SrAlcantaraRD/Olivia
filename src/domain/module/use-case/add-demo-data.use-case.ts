import { subDays } from 'date-fns';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TRecordFieldCreate } from '@/domain/module/entity/record-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type {
  TRequestAddDemoData,
  TResponseAddDemoData,
} from '@/domain/module/use-case-schema/add-demo-data.use-case-schema';

export class AddDemoDataUseCase extends BaseUseCase<
  TRequestAddDemoData,
  TResponseAddDemoData
> {
  private readonly DAYS_TO_CREATE = 400;

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
      details: undefined,
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

    const now = new Date();

    // Create records for the last 365 days, 5-9 records per day
    for (let dayOffset = 0; dayOffset < this.DAYS_TO_CREATE; dayOffset++) {
      const recordDate = subDays(now, dayOffset);

      const numRecords = Math.floor(Math.random() * 5) + 5; // 5 to 9
      for (let i = 0; i < numRecords; i++) {
        const synchronized = false;

        // Generate random hour and minute for the day
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        // Use iteration index 'i' as seconds to ensure uniqueness within the same minute
        const recordDateWithTime = new Date(recordDate);
        recordDateWithTime.setHours(hour, minute, i % 60, 0);

        // Create the record without nested fields, then create fields separately so they are associated with the created record id
        const recordCreate: TRecordCreate = {
          moduleID: module.id,
          carerID,
          synchronized,
          recordFieldList: [], // create fields afterwards using batchUpsert
          createdAt: recordDateWithTime,
        };

        const createdRecord =
          await this.adapters.recordAdapter.upsert(recordCreate);

        const fieldData = fields.map((field) => ({
          recordID: createdRecord.id,
          fieldID: field.id,
          value: this.generateDemoValue(field),
        })) satisfies TRecordFieldCreate[];

        await this.adapters.recordFieldAdapter.batchUpsert(
          createdRecord.id,
          fieldData,
          recordDate
        );
      }
    }
  }

  private generateDemoValue(field: TModuleField): string {
    if (field.type === 'TEXT') {
      return `Demo text for ${field.code}`;
    } else if (field.type === 'SELECT') {
      // ex: ["none", "mild", "pain"]
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
