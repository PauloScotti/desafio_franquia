import {
  Controller,
  Body,
  Post,
  BadRequestException,
  Get,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { StockDto } from './dtos/stock.dto';
import { StockMessagesHelper } from './helpers/messages.helper';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { ProductsService } from 'src/products/products.service';
import { FranchiseService } from 'src/franchise/franchise.service';
import { UserService } from 'src/user/user.service';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';
import { UpdateStockDto } from './dtos/update.dto';

@Controller('stock')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly userService: UserService,
    private readonly productsService: ProductsService,
    private readonly franchiseService: FranchiseService,
  ) {}

  async checkIfUserIsLogged(userId: any) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
    }

    return user;
  }

  @Post()
  async registerProductInFranchise(@Body() dto: StockDto) {
    const { productId, franchiseId } = dto;

    if (await this.stockService.existsFranchise(productId, franchiseId)) {
      throw new BadRequestException(
        StockMessagesHelper.PRODUCT_FOUND_IN_FRANCHISE,
      );
    }

    await this.stockService.createProductInFranchise(dto);
  }

  @Roles(Role.Admin)
  @Get()
  async getAllStock() {
    const allSotck = this.stockService.getAllStock();

    const stockWithProductsAndFranchiseData = await Promise.all(
      (
        await allSotck
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

  @Get('bySaleDate')
  async getProductBySaleDate(@Request() req) {
    const { userId } = req?.user;

    const user = await this.checkIfUserIsLogged(userId);

    const { initialDate, finalDate } = req?.body;

    const result = await this.stockService.getStockBySaleDate(
      user.franchise.toString(),
      initialDate,
      finalDate,
    );

    return result;
  }

  @Roles(Role.Admin)
  @Get('adm/bySaleDate')
  async getProductInAllFranchiseBySaleDate(@Request() req) {
    const { franchiseId, initialDate, finalDate } = req?.body;

    const result = await this.stockService.getStockBySaleDate(
      franchiseId,
      initialDate,
      finalDate,
    );

    return result;
  }

  @Get('byPurchaseDate')
  async getProductByPurchaseDate(@Request() req) {
    const { userId } = req?.user;

    const user = await this.checkIfUserIsLogged(userId);

    const { initialDate, finalDate } = req?.body;

    const result = await this.stockService.getStockByPurchaseDate(
      user.franchise.toString(),
      initialDate,
      finalDate,
    );

    return result;
  }

  @Roles(Role.Admin)
  @Get('adm/byPurchaseDate')
  async getProductInAllFranchiseByPurchaseDate(@Request() req) {
    const { franchiseId, initialDate, finalDate } = req?.body;

    const result = await this.stockService.getStockByPurchaseDate(
      franchiseId,
      initialDate,
      finalDate,
    );

    return result;
  }

  @Put('updateFranchiseByPurchase')
  async updateFranchiseByPurchase(@Request() req, @Body() dto: UpdateStockDto) {
    const { userId } = req?.user;

    const user = await this.checkIfUserIsLogged(userId);

    dto.franchiseId = user.franchise.toString();

    await this.stockService.updateFranchiseByPurchase(dto);
  }

  @Put('updateFranchiseBySold')
  async updateFranchiseBySold(@Request() req, @Body() dto: UpdateStockDto) {
    const { userId } = req?.user;

    const user = await this.checkIfUserIsLogged(userId);

    dto.franchiseId = user.franchise.toString();

    await this.stockService.updateFranchiseBySold(dto);
  }

  @Roles(Role.Admin)
  @Delete('adm/deleteFranchiseInProduct')
  async deleteFranchiseInProduct(@Request() req) {
    const { productId, franchiseId } = req?.body;

    await this.stockService.deleteFranchiseInProduct(productId, franchiseId);
  }
}
