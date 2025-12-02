// import { HttpService } from "@nestjs/axios";
// import { Injectable } from "@nestjs/common";
// // import { AxiosResponse } from "axios";
// import type { AxiosResponse } from "axios";
// import { Observable } from "rxjs";

// @Injectable()
// export class AxiosService {

//     constructor(private readonly httpService: HttpService) { }

//     /**
//      * @description Get Request
//      * @param url 
//      * @param headers 
//      * @returns Observable
//      */
//     get(url: string, headers: any): Observable<AxiosResponse<any>> {
//         return this.httpService.get(url, { headers: headers });
//     }

//     /**
//      * @description Post Request
//      * @param url 
//      * @param data 
//      * @param headers 
//      * @returns Observable
//      */
//     post(url: string, data: any, headers: any): Observable<AxiosResponse<any>> {
//         if (headers) {
//             return this.httpService.post(url, data, { headers: headers });
//         }
//         return this.httpService.post(url, data);

//     }
// }
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AxiosService {

    constructor(private readonly httpService: HttpService) { }

    get(url: string, headers: any): Observable<any> {
        return this.httpService.get(url, { headers });
    }

    post(url: string, data: any, headers: any): Observable<any> {
        return this.httpService.post(url, data, { headers });
    }
}
