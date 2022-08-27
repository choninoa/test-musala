import { IsEnum, IsInt, IsIP, IsMongoId, IsNotEmpty } from "class-validator";
import { DeviceStatusEnum } from "../schemas/device.schema";

export class CreateDeviceDto{
    @IsInt()
    uid: number;

    @IsNotEmpty()
    vendor: string;

    @IsEnum(DeviceStatusEnum)
    status:DeviceStatusEnum;

    @IsMongoId()
    gatewayId: string;

}