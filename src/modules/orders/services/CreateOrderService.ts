import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const costumer = await this.customersRepository.findById(customer_id);
    if(!costumer) {
      throw new AppError('Invalid Customer');
    };

    const findProducts = await this.productsRepository.findAllById(products);
    const updateProducts: Product[] = []

    const orderProducts = products.map(product => {
      const auxProd = findProducts.find(p => p.id === product.id);
      
      if(!auxProd) {
        throw new AppError('Invalid Product');
      }

      if(auxProd?.quantity - product.quantity<0) {
        throw new AppError('Unsufficient Quantities');
      }

      auxProd.quantity -= product.quantity;
      updateProducts.push(auxProd);

      return {
        product_id: auxProd.id,
        price: auxProd.price,
        quantity: product.quantity,
      }
    })

    this.productsRepository.updateQuantity(findProducts);

    const order = await this.ordersRepository.create({
      customer: costumer,
      products: orderProducts,
    });

    return order;
  }
}

export default CreateOrderService;
