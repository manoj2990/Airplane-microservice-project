
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        
        const response = await this.model.create(data);
       
        return response;
    }

    async destroy(data) {
        console.log("present at crud repo --->",data);
        const response = await this.model.destroy({
            where: {
                id: data
            }
        });

        console.log("res at crud repo --->",response);
    
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data);
       console.log("res at crud repo --->",response);
        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data) { // data -> {col: value, ....}
        console.log("id at crud repo --->",id);
        console.log("data at crud repo --->",data);
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        })
        console.log("res at crud repo --->",response);
        return response;
    }
}

module.exports = CrudRepository; 