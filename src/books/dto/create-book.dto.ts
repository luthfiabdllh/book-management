import { IsNotEmpty, IsString, IsInt, Min, IsISBN, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsString({ message: 'Judul harus berupa string' })
  @IsNotEmpty({ message: 'Judul tidak boleh kosong' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'Penulis harus berupa string' })
  @IsNotEmpty({ message: 'Penulis tidak boleh kosong' })
  author: string;

  @ApiProperty()
  @IsISBN(13, { message: 'ISBN tidak valid' })
  isbn: string;

  @ApiProperty()
  @IsInt({ message: 'Tahun terbit harus berupa angka bulat' })
  @Max(new Date().getFullYear(), { message: `Tahun terbit tidak boleh lebih dari ${new Date().getFullYear()}` })
  published_year: number;

  @ApiProperty({ default: 0 })
  @IsInt({ message: 'Stok harus berupa angka bulat' })
  @Min(0, { message: 'Stok tidak boleh kurang dari 0' })
  stock: number;
}
