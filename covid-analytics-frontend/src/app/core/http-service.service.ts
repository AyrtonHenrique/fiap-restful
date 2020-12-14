import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Generics } from './generics';
import { PoNotificationService } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';

const urlCovidBackend = environment.production ? 'https://teste-covid-web-api.herokuapp.com/covid-web-api/covid' : '/covidWeb'
//const urlCovidBackend = 'https://teste-covid-web-api.herokuapp.com/covid-web-api/covid'// : '/cov'

@Injectable({
	providedIn: 'root'
})
export class HttpServiceService {
	auth: string = "";
	constructor(private http: HttpClient, private poNotification: PoNotificationService) { }

	private setQueryParamsPaises(periodo: string, paises: string): { httpParams: HttpParams, quantidadeDias: number, httpHeader: HttpHeaders  }{
		let params = new HttpParams();
		let header = new HttpHeaders();
		let arrPeriodo = Generics.calcPeriodo(periodo);
		params = params.append("paises", paises)
		params = params.append("periodoDe", arrPeriodo.dataInicial.toISOString().substring(0,10))
		params = params.append("periodoAte", arrPeriodo.dataFinal.toISOString().substring(0,10))

		if (this.auth != ""){
			header = header.append("Authorization", "Bearer " + this.auth)
		}

		return { httpParams: params, quantidadeDias: arrPeriodo.quant, httpHeader: header }
	}

	getPaises(periodo: string, paises: Array<string> ){
		let arrParams = this.setQueryParamsPaises(periodo, paises.join(',') )
		return { observer: this.http.get(urlCovidBackend + '/pais', { params: arrParams.httpParams, headers: arrParams.httpHeader }), quantDias: arrParams.quantidadeDias }
	}

	private setQueryParamsEstados(periodo: string, estados: string): { httpParams: HttpParams, quantidadeDias: number, httpHeader: HttpHeaders }{
		let params= new HttpParams();
		let header = new HttpHeaders();
		let arrPeriodo = Generics.calcPeriodo(periodo);
		params = params.append("estados", estados)
		params = params.append("periodoDe", arrPeriodo.dataInicial.toISOString().substring(0,10))
		params = params.append("periodoAte", arrPeriodo.dataFinal.toISOString().substring(0,10))
		
		if (this.auth != ""){
			header = header.append("Authorization", "Bearer " + this.auth)
		}

		return { httpParams: params, quantidadeDias: arrPeriodo.quant, httpHeader: header }
	}

	getEstados(periodo: string, estados: Array<string> ){
		let arrParams = this.setQueryParamsEstados(periodo, estados.join(',') )
		return { observer: this.http.get(urlCovidBackend + '/estado', { params: arrParams.httpParams, headers: arrParams.httpHeader }), quantDias: arrParams.quantidadeDias }
	}

	validAuth(){
		let lReturn = true
		if (this.auth == undefined || this.auth == ""){
			lReturn = false;
			this.poNotification.error("Favor informar o Token")
		}
		return lReturn
	}

	errorHttp(httpResponse: HttpErrorResponse){
		if (httpResponse.status == 403){
			this.poNotification.error("O Token informado é invalido!")
		} else {
			this.poNotification.error(httpResponse.message);
		}
	}
}
