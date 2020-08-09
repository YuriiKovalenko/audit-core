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
    ws.mergeCells('A1:D1');
    ws.mergeCells('E1:H1');
    ws.getCell('A1').value =
      'Облік продукції. Черкаський консервний завод. Цех №1.';
    ws.getCell('E1').value = `Період ${dateToLocaleString(
      startDate,
    )} - ${dateToLocaleString(endDate)}`;
    ws.addRow(
      ['Датчики', 8, 9, 15, 17, 16, 10, 5, 7, 6, 10, 11, 12, 13, 14],
      'i',
    );
    const header = ws.addRow(
      [
        'Час',
        'Деполітайзер',
        'Ручна подача',
        'Закатка 1',
        'Закатка 2',
        'Закатка 3',
        'Закатка 4',
        'Інспектовано 1',
        'Інспектовано 2',
        'Інспектовано 3',
        'Інспектовано 4',
        'Готово 1',
        'Готово 2',
        'Готово 3',
        'Готово 4',
      ],
      'i',
    );
    header.height = 45;
    statistics.forEach(stat => {
      const { data } = stat;
      ws.addRow(
        [
          dateToLocaleString(stat.createdAt),
          data[3],
          data[4],
          data[10],
          data[12],
          data[11],
          data[5],
          data[0],
          data[2],
          data[1],
          data[5],
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