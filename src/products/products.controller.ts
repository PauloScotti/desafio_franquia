/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsMessagesHelper } from './helpers/messages.helper';
import { ProductsDto } from './dtos/products.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Roles(Role.Admin)
@Controller('adm/products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    @Get()
    async getProducts() {
        return this.productsService.getProducts();
    }

    @Post()
    async registerProducts(@Body() dto: ProductsDto) {
        if (await this.productsService.existsByName(dto.nome)) {
            throw new BadRequestException(ProductsMessagesHelper.PRODUCT_FOUND)
        }

        await this.productsService.createdProduct(dto);
    }

    @Put(":id")
    async updateProducts(@Param() params, @Body() dto: ProductsDto) {
        const { id } = params;

        if (await this.productsService.existsByName(dto.nome)) {
            throw new BadRequestException(ProductsMessagesHelper.PRODUCT_FOUND)
        }

        await this.productsService.updateProduct(id, dto);

    }

    @Delete(":id")
    async deleteProducts(@Param() params) {
        const { id } = params;
        await this.productsService.deleteProduct(id);
    }

}