import Bluebird = require('bluebird')
import {Stats} from 'fs'


export module fs {
    export function statSync(path: string | Buffer): Stats;
    export function readdirSync(path: string | Buffer): string[];
    export function readFileAsync(path: string, encoding?: string): Bluebird<any>
    export function readdirAsync(path: string): Bluebird<any>
    export function writeFileAsync(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }): Bluebird<any>
}