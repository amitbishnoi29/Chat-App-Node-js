class Users {
    constructor() {
        this.users = [];
    }
    addUser (id , name , room) {
        let user = {id , name , room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        this.users = this.users.filter( (user) => user.id !== id);
    }

    getUser (id) {
        return this.users.filter((user) => user.id === id);
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        return users.map((user) => user.name);
    }
}

let user = new Users();
user.addUser(1234,"amit",'fun');
 user.addUser(2345,'sunnu','fun');
console.log(user.users);
// user.removeUser(1234);
// console.log(user.users);
console.log(user.getUserList('fun'));

module.exports = {Users} ;
