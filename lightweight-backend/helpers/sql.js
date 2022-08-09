const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @params dataToUpdate {Object} {field1: newValue, field2: newValue, ...}
 * @params jsToSql {Object} maps js-style data fields to database column names,
 *  like {firstName: "first_name", lastName: "last_name"}
 *
 * @returns {Object} {sqlSetCols, dataUpdate}
 *
 * @example {firstName: 'Oloye', lastName: 'Senior'} =>
 *      {setCols: '"first_name"=$1, "last_name"=$2',
 *          values: ['Oloye', 'Senior']}
 */

const sqlForPartialUpdate = (dataToUpdate, jsToSql) => {
	const keys = Object.keys(dataToUpdate);
	if (keys.length === 0) {
		throw new BadRequestError("No data");
	}

	// {firstName: 'Oloye', lastName: 'Senior'} => ['"first_name"=$1', '"last_name"=$2']
	const cols = keys.map(
		(colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
	);

	return {
		setCols: cols.join(", "),
		values: Object.values(dataToUpdate),
	};
};

module.exports = { sqlForPartialUpdate };
