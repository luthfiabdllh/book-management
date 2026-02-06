import { IsNotEmpty, IsString, IsInt, Min, IsISBN, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsISBN()
  isbn: string;

  @ApiProperty()
  @IsInt()
  @Max(new Date().getFullYear())
  published_year: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  stock: number;
}
