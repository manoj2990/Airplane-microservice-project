const CrudRepository = require("./crud-repositorie");
const {Airplane} = require("../models")


class AirplaneRepository extends CrudRepository {
    constructor() {
        super(Airplane);
    }
}

module.exports = AirplaneRepository;