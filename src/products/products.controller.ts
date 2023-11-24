/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsMessagesHelper } from './helpers/messages.helper';
import { ProductsDto } from './dtos/products.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { UpdateProductsDto } from './dtos/update.dto';
import { UserService } from 'src/user/user.service';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';
import { StockService } from 'src/stock/stock.service';
import { StockMessagesHelper } from 'src/stock/helpers/messages.helper';
import { FranchiseService } from 'src/franchise/franchise.service';

@Roles(Role.Admin)
@Controller('adm/products')
export class ProductsController {
  constructor(
    private readonly userService: UserService,
    private readonly productsService: ProductsService,
    private readonly franchiseService: FranchiseService,
    private readonly stockService: StockService,
  ) {}

  async checkIfUserIsLogged(userId: any) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
    }

    return user;
  }

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get('byId/:id')
  async getProductById(@Param() params) {
    const { id } = params;
    return this.productsService.getProductById(id);
  }

  @Get('franchise')
  async getProductsInFranchise(@Request() req) {
    const { franchiseId } = req?.body;

    const allProductsInFranchise =
      this.stockService.getStockByFranchise(franchiseId);

    const stockWithProductsAndFranchiseData = await Promise.all(
      (
        await allProductsInFranchise
      ).map(async (stock) => {
        const product = await this.productsService.getProductById(
          stock.productId.toString(),
        );

        const franchise = await this.franchiseService.getFranchiseById(
          stock.franchiseId.toString(),
        );

        return {
          productId: stock.productId,
          productName: product.nome,
          franchiseId: stock.franchiseId,
          franchiseName: franchise.franchise,
          amountSold: stock.amountSold,
          saleDate: stock.saleDate,
          amountPurchase: stock.amountPurchase,
          purchaseDate: stock.purchaseDate,
          amount: stock.amount,
        };
      }),
    );

    return stockWithProductsAndFranchiseData;
  }

  @Post()
  async registerProducts(@Body() dto: ProductsDto) {
    if (await this.productsService.existsByName(dto.nome)) {
      throw new BadRequestException(ProductsMessagesHelper.PRODUCT_FOUND);
    }

    await this.productsService.createdProduct(dto);
  }

  @Put(':id')
  async updateProduct(@Param() params, @Body() dto: UpdateProductsDto) {
    const { id } = params;

    if (dto.nome) {
      if (await this.productsService.existsByName(dto.nome)) {
        throw new BadRequestException(ProductsMessagesHelper.PRODUCT_FOUND);
      }
    }

    await this.productsService.updateProduct(id, dto);
  }

  @Put(':id')
  async updateProductInFranchise(
    @Param() params,
    @Body() dto: UpdateProductsDto,
  ) {
    const { id } = params;

    await this.productsService.updateProductInFranchise(id, dto);
  }

  @Delete('')
  async deleteProducts(@Request() req) {
    const { productId, franchiseId } = req?.body;

    const franchiseInProduct = await this.stockService.getFranchiseInProduct(
      productId,
      franchiseId,
    );

    if (franchiseInProduct.length > 0) {
      throw new BadRequestException(StockMessagesHelper.PRODUCT_HAS_FRANCHISES);
    } else {
      await this.productsService.deleteProduct(productId);
    }
  }
}
