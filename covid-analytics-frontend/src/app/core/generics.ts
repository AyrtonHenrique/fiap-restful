import { PoSelectOption } from '@po-ui/ng-components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Generics {
  static lsCountries: Array<string> = [
    'brazil',
    'india',
    'russia',
    'south-africa',
    'chile',
    'pakistan',
    'iran',
    'italy',
    'france',
    'spain',
    'new-zealand',
    'australia',
  ];
  static lsStates: Array<string> = [
    "MG",
    "RJ",
    "RS",
    "SC",
    "SP",   
  ];
  static lsMesesConsulta: Array<PoSelectOption> = [
    {
      label: 'Fevereiro/2020',
      value: '2020-02',
    },
    {
      label: 'Março/2020',
      value: '2020-03',
    },
    {
      label: 'Abril/2020',
      value: '2020-04',
    },
    {
      label: 'Maio/2020',
      value: '2020-05',
    },
    {
      label: 'Junho/2020',
      value: '2020-06',
    },
    {
      label: 'Julho/2020',
      value: '2020-07',
    },
    {
      label: 'Agosto/2020',
      value: '2020-08',
    },
    {
      label: 'Setembro/2020',
      value: '2020-09',
    },
    {
      label: 'Outubro/2020',
      value: '2020-10',
    },
    {
      label: 'Novembro/2020',
      value: '2020-11',
    },
    {
      label: 'Dezembro/2020',
      value: '2020-12',
    },
    {
      label: 'Janeiro/2021',
      value: '2021-01',
    },
  ];

  makeCountryCombo(): Array<PoSelectOption> {
    let lsCountryOptions: Array<PoSelectOption> = [];

    Generics.lsCountries.forEach((item) => {
      let value = item;
      let label = item
        .trim()
        .toLowerCase()
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
        .replace('-', ' ');
      lsCountryOptions.push({ value: value, label: label });
    });
    return lsCountryOptions;
  }

  makeStatesCombo(): Array<PoSelectOption> {
    let lsStateOptions: Array<PoSelectOption> = [];

    Generics.lsStates.forEach((item)=>{
      let value = item;
      let label = item;
      lsStateOptions.push( { value: value, label: label } )
    })

    return lsStateOptions
  }

  static calcPeriodo(
    periodoSelecionado: string
  ): { dataInicial: Date; dataFinal: Date; quant: number } {
    let arrData = periodoSelecionado.split('-');
    let dataInicial = new Date(
      parseInt(arrData[0]),
      parseInt(arrData[1]) - 1,
      1
    );
    let dataFinal = new Date(parseInt(arrData[0]), parseInt(arrData[1]), 0);
    let quantidadeDias = 0;

    quantidadeDias = dataFinal.getDate() - dataInicial.getDate() + 1;

    return {
      dataInicial: dataInicial,
      dataFinal: dataFinal,
      quant: quantidadeDias,
    };
  }

  static transformDateToStr(data: Date): string {
    return data.toISOString();
  }
}
