import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer: customer,
      order_products: products
    });
    // order.order_products = products.map(product => {
    //   return {
    //     order_id: order.id,
    //     product_id: product.product_id,
    //     price: product.price,
    //     quantity: product.quantity
    //   }
    // });

    await this.ormRepository.save(order);

    // console.log(order.order_products);
    // const auxRepository = getRepository(OrdersProducts);
    // const auxOrdersProducts=await auxRepository.findOne({
    //   where: {
    //     product_id: products[0].product_id,
    //   }
    // });
    // console.log(auxOrdersProducts);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const findOrder = await this.ormRepository.findOne({
      where: {
        id: id
      }
    });

    return findOrder;
  }
}

export default OrdersRepository;
