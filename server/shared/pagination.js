export const pagination = (dataType, page, limit) => {

    //const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalCount = dataType.length;
    const pages = Math.ceil (totalCount / limit);
    
    const results = {};

    if(!page) {
        results.items = dataType.slice((1 - 1) * limit, 1 * limit); 
    } else {
        results.items = dataType.slice(startIndex, endIndex);
    }

    results.totalCount = totalCount;
    results.limit = limit;
    results.pages = pages;
    results.currentPage = 1;

    return results;
}