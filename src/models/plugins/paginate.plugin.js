/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options,select=false,populate=false) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    var docsPromise = false;
    //const docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).exec();

    if(select){
      
       docsPromise = this.find(filter).select(select).sort(sort).skip(skip).limit(limit)

    }else{
       docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit)
    }
    

    if(populate){
      populate.forEach(element => {
        console.log(element);
        if(element.hasOwnProperty('option'))
        {
          docsPromise= docsPromise.populate(element['collection_name'],element['field']);
         //docsPromise= docsPromise.populate(element);
        }else{
          //docsPromise= docsPromise.populate(element);
          docsPromise= docsPromise.populate(element['collection_name'],element['field'],element['option']);
        }
        
      });
      
    }

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      let next_page= (page<=totalPages)? false :page+1
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
        next_page
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
