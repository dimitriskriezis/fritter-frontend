import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
   /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
    static async addOne(authorId: Types.ObjectId | string, content: string, image: string, isMultiOnly: boolean): Promise<HydratedDocument<Freet>> {
      const date = new Date();
      const freet = new FreetModel({
        authorId: authorId,
        dateCreated: date,
        textContent: content,
        imageContent: image,
        isMultiOnly: isMultiOnly
      });
      await freet.save(); // Saves freet to MongoDB
      return freet.populate('authorId');
    }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all freets by given user that have given mode
   * 
   * @param {string} authorId - the id of the user whose freets we are looking for
   * @param {number} freetFilter - number specifying which modes of freets we are selecting is 0,1,2
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
   static async findAllByUserIdAndMode(authorId: Types.ObjectId | string, freetFilter: number): Promise<Array<HydratedDocument<Freet>>>{
    if (freetFilter == 2){
      return FreetModel.find({authorId: authorId, isMultiOnly: true}).populate('authorId');
    }else if(freetFilter == 1){
      return FreetModel.find({authorId: authorId, isMultiOnly: false}).populate('authorId');
    }else{
      return FreetModel.find({authorId: authorId}).populate('authorId');
    }

  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */

    /**
   * Get one freet with freetid and 
   * 
   * @param {string} authorId - the id of the user whose freets we are looking for
   * @param {number} freetFilter - number specifying which modes of freets we are selecting is 0,1,2
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
     static async findOneWithMode(freetId: Types.ObjectId | string, freetFilter: number): Promise<HydratedDocument<Freet>>{
      if (freetFilter == 2){
        return FreetModel.findOne({_id: freetId, isMultiOnly: true}).populate('authorId');
      }else if(freetFilter == 1){
        return FreetModel.findOne({_id: freetId, isMultiOnly: false}).populate('authorId');
      }else{
        return FreetModel.findOne({_id: freetId}).populate('authorId');
    }
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
