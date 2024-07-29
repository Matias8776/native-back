import productsModel from '../models/products.js';
import mongoose from 'mongoose';

export default class ProductManager {
  getProducts = async (title, limit, page, category, disponibility, sort) => {
    try {
      const options = {
        limit,
        page
      };

      if (sort == 1 || sort == -1) {
        options.sort = { price: sort };
      }

      const filter = {};

      if (category) {
        filter.$text = {
          $search: category,
          $caseSensitive: false,
          $diacriticSensitive: false
        };
      }

      if (disponibility !== '' && disponibility == 0) {
        filter.stock = { $eq: disponibility };
      } else if (disponibility !== '' && disponibility == 1) {
        filter.stock = { $gte: disponibility };
      }

      if (title) {
        const regex = new RegExp(title.replace(/\s/g, ' '), 'i');
        filter.title = { $regex: regex };
      }

      const paginate = await productsModel.paginate(filter, options);
      return paginate;
    } catch (error) {
      return { error: error.message };
    }
  };

  getProductById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return;
    }
    try {
      return await productsModel.findById(id).lean();
    } catch (error) {
      return { error: error.message };
    }
  };

  addProduct = async (product) => {
    const result = {
      success: false
    };
    if (typeof product.status === 'string') product.status = true;
    try {
      const productAdded = await productsModel.create(product);
      result.product = productAdded;
      result.success = true;
      return result;
    } catch (error) {
      return { error: error.message };
    }
  };

  updateProduct = async (id, product) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return;
    }
    try {
      return await productsModel.findByIdAndUpdate(id, {
        $set: product
      });
    } catch (error) {
      return { error: error.message };
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productsModel.findByIdAndDelete(id);
    } catch (error) {
      return { error: error.message };
    }
  };
}
