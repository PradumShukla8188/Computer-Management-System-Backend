import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {

    /**
     * @description generate random string
     * @param length 
     * @returns { string }
     */
    randomString(length: number, isOTP: boolean = false): string {
        let result = '';
        const characters = isOTP ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            counter += 1;
        }
        return result;
    }

    /**
     * @description replace variables from template
     * @param template 
     * @param variables 
     * @returns { string }
     */
    replaceVariablesInTemplate(template: string, variables: { [key: string]: string }): string {
        try {
            for (const key in variables) {
                template = template.replace(new RegExp(key, 'g'), variables[key])
            }
            return template;
        } catch (error) {
            return '';
        }
    }
}