import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Agenda } from 'agenda';
import { Model } from 'mongoose';
// import { Maintenance } from 'src/models';
// import { MaintenanceService } from 'src/modules/maintenance/maintenance.service';

@Injectable()
export class AgendaService implements OnModuleInit {
  public agenda: Agenda;

  constructor(
    private readonly configService: ConfigService,
    // @Inject(forwardRef(() => MaintenanceService))
    // private readonly maintenanceService: MaintenanceService,

    // @InjectModel(Maintenance.name) private MaintenanceModel: Model<Maintenance>,
  ) { }

  async onModuleInit() {
    this.agenda = new Agenda({
      db: {
        address: `${this.configService.get('DATABASE_URL')}${this.configService.get('DATABASE_NAME')}`,
      },
    });

    // Agenda for the recurring maintenance
    this.agenda.define('repeat-maintenance', async (job) => {

      const { maintenanceId } = job.attrs.data;
      // const existing = await this.MaintenanceModel.findOne({
      //   _id: maintenanceId,
      // });

      // if (!existing) {
      //   console.log(`Maintenance ${maintenanceId} not found, skipping job.`);
      //   return;
      // }

      // if (!existing.isRecurring) {
      //   console.log(
      //     `Maintenance ${maintenanceId} is no longer recurring, skipping.`,
      //   );
      //   return;
      // }

      // await this.maintenanceService.replicateMaintenance(maintenanceId);
    });

    await this.agenda.start();
  }
}
