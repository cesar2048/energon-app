
const Depends = function() {
    var registry = {};

    this.register = (name, obj) => {
        registry[name] = obj;
    };

    this.get = (name) => {
        const obj = registry[name];
        if (!obj) {
            throw new Error(`Error while loading dependency: ${name}`);
        }
        
        return obj;
    };
};

const instance = new Depends();

export default instance;
