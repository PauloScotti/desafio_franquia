/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockDto } from './dtos/stock.dto';
import { StockMessagesHelper } from './helpers/messages.helper';
import { Stock, StockDocument } from './schemas/stock.schema';
import { UpdateStockDto } from './dtos/update.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async existsFranchise(
    productId: string,
    franchiseId: string,
  ): Promise<boolean> {
    const result = await this.stockModel.findOne({
      productId: productId,
      franchiseId: franchiseId,
    });
    return !!result;
  }

  async createProductInFranchise(dto: StockDto): Promise<Stock> {
    const createProductInFranchise = new this.stockModel(dto);
    return createProductInFranchise.save();
  }

  async getAllStock() {
    return await this.stockModel.find();
  }

  async getFranchiseInProduct(productId: string, franchiseId: string) {
    return await this.stockModel.find({
      productId: productId,
      franchiseId: franchiseId,
    });
  }

  async getStockByFranchise(franchiseId: string) {
    return await this.stockModel.find({
      franchiseId: franchiseId,
    });
  }

  async getStockBySaleDate(
    franchiseId: string,
    initialDate: Date,
    finalDate: Date,
  ) {
    return await this.stockModel.find({
      franchiseId: franchiseId,
      saleDate: { $gte: initialDate } && { $lte: finalDate },
    });
  }

  async getStockByPurchaseDate(
    franchiseId: string,
    initialDate: Date,
    finalDate: Date,
  ) {
    return await this.stockModel.find({
      franchiseId: franchiseId,
      purchaseDate: { $gte: initialDate } && { $lte: finalDate },
    });
  }

  async updateFranchiseBySold(stockDto: UpdateStockDto) {
    const { productId, franchiseId, amountSold } = stockDto;

    const stockWithProductAndFranchise = await this.stockModel.findOne({
      productId,
      franchiseId,
    });

    if (!stockWithProductAndFranchise) {
      throw new BadRequestException(
        StockMessagesHelper.PRODUCT_NOT_FOUND_IN_FRANCHISE,
      );
    }

    // Atualize os valores específicos da franquia encontrada
    stockWithProductAndFranchise.amountSold = amountSold;
    stockWithProductAndFranchise.amount -= amountSold;
    stockWithProductAndFranchise.saleDate = new Date();

    // Salve o produto atualizado no banco de dados
    await stockWithProductAndFranchise.save();

    return stockWithProductAndFranchise;
  }

  async updateFranchiseByPurchase(stockDto: UpdateStockDto) {
    const { productId, franchiseId, amountPurchase } = stockDto;

    const stockWithProductAndFranchise = await this.stockModel.findOne({
      productId,
      franchiseId,
    });

    if (!stockWithProductAndFranchise) {
      throw new BadRequestException(
        StockMessagesHelper.PRODUCT_NOT_FOUND_IN_FRANCHISE,
      );
    }

    // Atualize os valores específicos da franquia encontrada
    stockWithProductAndFranchise.amountPurchase = amountPurchase;
    stockWithProductAndFranchise.amount += amountPurchase;
    stockWithProductAndFranchise.purchaseDate = new Date();

    // Salve o produto atualizado no banco de dados
    await stockWithProductAndFranchise.save();

    return stockWithProductAndFranchise;
  }

  async deleteFranchiseInProduct(productId: string, franchiseId: string) {
    return await this.stockModel.findOneAndDelete({
      productId,
      franchiseId,
    });
  }
}
