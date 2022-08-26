import { Device } from "../schemas/device.schema";
import { Gateway } from "../schemas/gateway.schema";

export class ExistElementDto{
    message:string;
    element:Gateway|Device
}