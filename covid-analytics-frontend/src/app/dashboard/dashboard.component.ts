import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import {
  ChartDataSets,
  ChartOptions,
  ChartTitleOptions,
  ChartType,
} from 'chart.js';
import { Generics } from '../core/generics';
import { HttpServiceService } from '../core/http-service.service';
import { PoSelectComponent, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterContentInit {

  //Loadings
  loadingGlobal: boolean = false;
  loadingCompareGlobal: boolean = false;
  loadingPais: boolean = false;
  loadingCompareState: boolean = false;
  loadingState: boolean = false;


  //DADOS DO GRÁFICO: Casos de Covid pelo Mundo ao Ano
  lsPeriodos = Generics.lsMesesConsulta;
  lsPaises;
  tokenAuth: string = ""; 
  paisSelecionado: string = '';
  /** Propriedade das linhas do Gráfico
   *  https://www.npmjs.com/package/ng2-charts
   */
  graphEvoLineProp: Array<any> = [
    {
      // Em Andamento - Azul Escuro #0d729c
      backgroundColor: 'rgba(13, 114, 156, 0)',
      borderColor: 'rgba(13, 114, 156, 1)',
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(13, 114, 156, 1)',
      pointHoverBackgroundColor: 'rgba(13, 114, 156, 1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // Casos Novos - Azul Claro #29b6c5
      backgroundColor: 'rgba(41, 182, 197, 0)',
      borderColor: 'rgba(41, 182, 197, 1)',
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(41, 182, 197, 1)',
      pointHoverBackgroundColor: 'rgba(41, 182, 197, 1)',
      pointHoverBorderColor: 'rgba(41, 182, 197 ,1)',
    },
    {
      // Casos Encerrados - Laranja #ea9b3e
      backgroundColor: 'rgba(234, 155, 62, 0)',
      borderColor: 'rgba(234, 155, 62, 1)',
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(234, 155, 62, 1)',
      pointHoverBackgroundColor: 'rgba(234, 155, 62, 1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];

  // Linha do Gráfico
  lsLinhasPaises: ChartDataSets[] = [];
  // Rodapé do Gráfico
  footerCasosCovidMundo: Array<any> = [];

  graphEvoShowLegend: boolean = true; // Demonstra se vai ter a legenda ou não
  graphEvoTipo: string = 'bar'; // Tipo do Gráfico
  graphEvoOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 7,
        borderWidth: 3,
        hitRadius: 5,
        hoverRadius: 10,
        hoverBorderWidth: 3,
      },
    },
    legend: { position: 'bottom' },
  };

  //DADOS DO GRÁFICO: Comparativo de Casos Covid pelo Mundo

  pieChartComparativeGlobalLabels = [];
  pieChartComparativeGlobalData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  pieChartComparativeGlobalType = 'pie';

  pieChartTitle: ChartTitleOptions = {
    display: false,
    text: 'Comparativo de Casos de Covid pelo Mundo',
    fontSize: 20,
    fullWidth: true,
  };

  pieChartComparativeGlobalOptions: ChartOptions = {
    title: this.pieChartTitle,
    responsive: true,
    aspectRatio: 400,
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 7,
        borderWidth: 3,
        hitRadius: 5,
        hoverRadius: 10,
        hoverBorderWidth: 3,
      },
    },
    legend: { position: 'bottom' },
  };

  //DADOS DO GRÁFICO: Comparativo de Casos Covid pelo Estado

  pieChartComparativeEstadualLabels = [];
  pieChartComparativeEstadualData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  pieChartComparativeEstadualType = 'pie';

  pieChartEstadualTitle: ChartTitleOptions = {
    display: false,
    text: 'Comparativo de Casos de Covid pelos Estados',
    fontSize: 20,
    fullWidth: true,
  };

  pieChartComparativeEstadualOptions: ChartOptions = {
    title: this.pieChartEstadualTitle,
    responsive: true,
    aspectRatio: 400,
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 7,
        borderWidth: 3,
        hitRadius: 5,
        hoverRadius: 10,
        hoverBorderWidth: 3,
      },
    },
    legend: { position: 'bottom' },
  };

  //DADOS DO GRÁFICO: Evolução de Casos Covid pelo País

  splineChartComparativeGlobalLabels = [];

  lsLinhasPais: ChartDataSets[] = [
    {
      data: [],
      label: '',
    },
  ];

  splineChartComparativeGlobalType = 'line';
  lsEstados: Array<PoSelectOption> = [];

  @ViewChild('selPeriodo', { static: true }) slPeriodo: PoSelectComponent;
  constructor(
    private http: HttpServiceService,
    private generics: Generics,
    private poNotification: PoNotificationService
  ) {}
  ngAfterContentInit(): void {}

  ngOnInit(): void {
    this.lsLinhasPaises = [
      { data: [], label: 'Selecione um periodo para gerar os graficos' },
    ];
    let arrCountries = Generics.lsCountries;

    this.lsPaises = this.generics.makeCountryCombo();
    this.lsEstados = this.generics.makeStatesCombo();
  }

  changePeriodo(periodoSelecionado: string) {
    if (!this.http.validAuth())
      return 

    const req = this.http.getPaises(periodoSelecionado, Generics.lsCountries);
    const reqEstado = this.http.getEstados(periodoSelecionado, Generics.lsStates)
    const arrPeriodo = periodoSelecionado.split('-');
    this.footerCasosCovidMundo = [];
    this.lsLinhasPaises = [];
    this.pieChartComparativeGlobalLabels = [];
    this.pieChartComparativeGlobalData = [];
    this.splineChartComparativeGlobalLabels = [];
    this.pieChartComparativeEstadualData = [];
    this.pieChartComparativeEstadualLabels = [];
    this.lineChartEstadoData = [];
    this.lsLinhasPais = [];

    this.loadingGlobal = true;
    this.loadingCompareGlobal = true;
    this.loadingCompareState = true;

    if (this.paisSelecionado != '') {
      this.changePais(this.paisSelecionado);
    }

    if (this.estadoSelecionado != ''){
      this.changeEstado(this.estadoSelecionado);
    }

    for (let index = 0; index < req.quantDias; index++) {
      let dia = '0' + (index + 1).toString();
      let diaMes =
        ('0' + dia).substring(('0' + dia).length - 2, ('0' + dia).length) +
        '/' +
        arrPeriodo[1];
      this.footerCasosCovidMundo.push(diaMes);
    }

    req.observer.subscribe((response: any) => {
      response.forEach((medicaoPais) => {
        let lsDados: Array<number> = [];
        let totalCasos: number = 0;

        medicaoPais.periodos.forEach((periodo) => {
          lsDados = [...lsDados, periodo.casos];
          totalCasos += periodo.casos;
        });

        this.pieChartComparativeGlobalLabels.push(medicaoPais.nome);
        this.pieChartComparativeGlobalData.push(totalCasos);

        let newLine: ChartDataSets = {
          label: medicaoPais.nome,
          data: lsDados,
        };

        this.lsLinhasPaises = [...this.lsLinhasPaises, newLine];
      });

      this.loadingGlobal = false;
      this.loadingCompareGlobal = false;
    },
    (error: any)=>{
      this.http.errorHttp(error)
      this.loadingGlobal = false;
      this.loadingCompareGlobal = false;
    });

    reqEstado.observer.subscribe((response: any)=>{
      console.log(response)
      response.forEach(estado => {
        let somaEstado: number = 0;
        estado.periodos.forEach(periodo => {
          somaEstado += periodo.casos
        });
        this.pieChartComparativeEstadualLabels.push(estado.nome.trim()
          .toLowerCase()
          .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
          .replace('-', ' '))
        this.pieChartComparativeEstadualData.push(somaEstado)
      });
      this.loadingCompareState = false;
    },
    (error: any)=>{
      this.http.errorHttp(error)
      this.loadingCompareState = false;
    })

    
  }

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Selecione o Pais e o Período' },
  ];
  lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          },
        },
      ],
    },
    legend: { position: 'bottom' },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
          },
        },
      ],
    },
  };
  lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
  lineChartPlugins = [];

  changePais(paisSelecionado: string) {
    if (!this.http.validAuth())
      return 

    if (this.slPeriodo.selectedValue == undefined) {
      this.poNotification.error(
        'Selecione o período para ver a evolução do COVID no país selecionado!'
      );
    }
    this.loadingPais = true;
    
    this.paisSelecionado = paisSelecionado;
    const req = this.http.getPaises(this.slPeriodo.selectedValue, [
      paisSelecionado,
    ]);
    req.observer.subscribe((response: any) => {
      this.lineChartData = [];
      response.forEach((medicaoPais) => {
        let lsDados: Array<number> = [];
        medicaoPais.periodos.forEach((periodo) => {
          lsDados = [...lsDados, periodo.casos];
        });

        this.lineChartData.push({ data: lsDados, label: medicaoPais.nome });
      });
      this.loadingPais = false;
    },
    (error: any)=>{
      this.http.errorHttp(error)
      this.loadingPais = false;
    });
  }

  estadoSelecionado: string = "";
  lineChartEstadoData: ChartDataSets[] = [
    { data: [], label: 'Selecione o Estado e o Período' },
  ];

  changeEstado(estadoSelecionado: string) {
    if (!this.http.validAuth())
      return 

    if (this.slPeriodo.selectedValue == undefined) {
      this.poNotification.error(
        'Selecione o período para ver a evolução do COVID no estado selecionado!'
      );
    }
    this.loadingState = true;
    this.estadoSelecionado = estadoSelecionado;

    const req = this.http.getEstados(this.slPeriodo.selectedValue, [
      estadoSelecionado,
    ]);

    req.observer.subscribe((response: any) => {
      this.lineChartEstadoData = [];
      response.forEach((medicaoEstado) => {
        let lsDados: Array<number> = [];
        medicaoEstado.periodos.forEach((periodo) => {
          lsDados = [...lsDados, periodo.casos];
        });

        this.lineChartEstadoData.push({
          data: lsDados,
          label: medicaoEstado.nome.trim()
          .toLowerCase()
          .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
          .replace('-', ' ')
        });
      });
      this.loadingState = false;
    },
    (error: any)=>{
      this.http.errorHttp(error)
      this.loadingState = false;
    });
  }

  changeToken(token: string){
    if (token != undefined){
      this.http.auth = token;
    } else {
      this.http.auth = "";
    }
  }
}
