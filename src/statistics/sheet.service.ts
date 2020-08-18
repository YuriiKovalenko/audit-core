import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { utils, write } from 'xlsx';
import { RawStatistics } from './raw-statistics';
import { PassThrough } from 'stream';
import { dateToLocaleString } from '../utils';

@Injectable()
export class SheetService {
  public create(
    statistics: Partial<RawStatistics>[],
    startDate: Date,
    endDate: Date,
  ) {
    const wb = utils.book_new();
    const title = 'Облік продукції. Черкаський консервний завод. Цех №1.';
    const interval = `Період ${dateToLocaleString(
      startDate,
    )} - ${dateToLocaleString(endDate)}`;
    const ws = utils.aoa_to_sheet([
      [title,,,,interval],
      ['Датчики', 8, 9, 15, 17, 16, 10, 5, 7, 6, 10, 11, 12, 13, 14],
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
      ...statistics.map(({ data, createdAt }) => [
        dateToLocaleString(createdAt),
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
      ]),
    ]);
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
    ];
    ws['!cols'] = [{ width: 17 }, ...new Array(14).fill({ width: 12 })];
    ws['!rows'] = [,,{ hpt: 32, }]
    utils.book_append_sheet(wb, ws, 'Облік продукції');
    return write(wb, { bookType: 'xlsx', type: 'buffer' });
  }

  public async createTable(
    statistics: Partial<RawStatistics>[],
    startDate: Date,
    endDate: Date,
  ) {
    const output = new PassThrough();
    const wb = new Workbook();
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

    statistics.forEach(({ data, createdAt }) =>
      ws.addRow([
        dateToLocaleString(createdAt),
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
      ]),
    );
    console.log(process.cpuUsage());
    console.log(process.memoryUsage());
    await wb.xlsx.write(output);
    console.log(process.cpuUsage());
    console.log(process.memoryUsage());
    return output;
  }
}
