import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberConvertService {

  constructor() { }

    getSeconds(t: number, e: number, n: number) {
        return 60 * (60 * t + e) + n
    }
    getRoundedHours(t: number) {
        return Math.floor(t / 3600)
    }
    getRoundedMinutes(t:any) {
        return Math.floor((t - 3600 * this.getRoundedHours(t)) / 60)
    }
    getRoundedSeconds(t:any) {
        const e = t - 60 * (60 * this.getRoundedHours(t) + this.getRoundedMinutes(t));
        return Math.round(e)
    }
    clamp(t: number, e: number, n: number) {
        return Math.max(e, Math.min(t, n))
    }
   }
