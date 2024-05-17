import axios, { AxiosInstance} from 'axios';
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from '@nestjs/common';

// Es el wrapper para desacoplar axios
@Injectable()
export class AxiosAdapter implements HttpAdapter {
    
    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try{
            const {data} = await this.axios.get<T>(url);
            return data;
        }catch(e){
            throw new Error('This is an error - check logs')
        }
    }
    
}