import { Injectable } from '@nestjs/common';
import { stream } from 'exceljs';
import { RawStatistics } from './raw-statistics';
import { PassThrough } from 'stream';
import { dateToLocaleString } from '../utils';

@Injectable()
export class SheetService {
  public async createTable(
    statistics: Partial<RawStatistics>[],
    startDate: Date,
    endDate: Date,
  ) {
    const output = new PassThrough();
    const wb = new stream.xlsx.WorkbookWriter({ stream: output });
    const ws = wb.addWorksheet('Облік продукції', {
      properties: { defaultColWidth: 13 },
    });
    ws.getColumn('A').width = 18;
    ws.mergeCells('A1:Q1');
    ws.getCell(
      'A1',
    ).value = `Облік продукції. Черкаський консервний завод. Цех №1, Період ${dateToLocaleString(
      startDate,
    )} - ${dateToLocaleString(endDate)}`;

    const header = ws.addRow(
      [
        'Час',
        'Спочатку всього',
        'Деполітайзер',
        'Ручна подача',
        'Закатка всього',
        'Закатка 1 машина',
        'Закатка 2 машина',
        'Закатка 3 машина',
        'Закатка 4 машина',
        'Перевірено всього',
        'Готово всього',
        'Готово 1 вихід',
        'Готово 2 вихід',
        'Готово 3 вихід',
        'Готово 4 вихід',
      ],
      'i',
    );
    header.height = 45;
    statistics.forEach(stat => {
      const { data } = stat;
      ws.addRow(
        [
          dateToLocaleString(stat.createdAt),
          data[3] + data[4],
          data[3],
          data[4],
          data[5] + data[10] + data[11] + data[12],
          data[10],
          data[12],
          data[11],
          data[5],
          data[0] + data[1] + data[2] + data[5],
          data[6] + data[7] + data[8] + data[9],
          data[6],
          data[7],
          data[8],
          data[9],
        ],
        'n',
      );
    });
    ws.commit();
    await wb.commit();
    return output;
  }
}
