import { IsInt, IsOptional } from "class-validator";

export class IntervalDto {
    @IsInt()    
    skip: number;

    @IsOptional()
    @IsInt()   
    limit?: number;
  }
  