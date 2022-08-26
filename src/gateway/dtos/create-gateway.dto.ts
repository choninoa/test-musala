import { IsIP, IsNotEmpty } from "class-validator";
import { isIPv4 } from "net";

export class CreateGatewayDto{
    @IsNotEmpty()
    serialNumber:string;
    

    @IsNotEmpty()
    name: string;

    
    @IsIP('4',{message:()=>'ipv4 must be a valid ipV4 address!!'})
    ipv4: string;

}