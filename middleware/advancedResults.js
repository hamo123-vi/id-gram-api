const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

        //Coping request query params in reqQuery array
        let reqQuery = { ...req.query }

        //Fields to exclude
        const removeFields = [ 'select', 'sort', 'limit', 'page'];

        //Looping out through removeFields array and deleting fields from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        //Creating query string from request query params
        let queryStr = JSON.stringify(reqQuery);

        //Creating mongo operator using Regular expressions
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        //Executing query
        query = model.find(JSON.parse(queryStr));

        //SELECT FIELDS
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        //SORT FIELDS
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
            } else {
                query = query.sort('-createdAt');
        }
        
        if(populate) {
            query = query.populate(populate)
        }
        
        //Assigning query execution results to rray
        
        const results = await query;

        res.advancedResults = {
            success: true,
            count: results.length,
            data: results
        }

        next()
}

module.exports = advancedResults