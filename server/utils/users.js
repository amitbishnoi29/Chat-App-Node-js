class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        let user = { id, name, room } ;
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user ;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        return users.map((user) => user.name);
    }
}

// let user = new Users();
// user.addUser(1234,"amit",'fun');
//  user.addUser(2345,'sunnu','fun');
// console.log(user.users);
// user.removeUser(1234);
// console.log(user.users);


module.exports = { Users };
